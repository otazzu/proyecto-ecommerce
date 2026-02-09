from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from api.database.db import db
from api.models.Product import Product
from api.models.User import User
import cloudinary.uploader
import cloudinary
import os

api = Blueprint('api/product', __name__)

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

MAX_IMAGES = 5


@api.route('/products', methods=['GET'])
def get_products():
    try:
        all_products = Product.query.all()
        return jsonify([product.serialize() for product in all_products]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/products/actives', methods=['GET'])
def get_actives_products():
    try:
        active_products = Product.query.filter_by(status=True).all()
        return jsonify([product.serialize() for product in active_products]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404
        return jsonify(product.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/create', methods=['POST'])
@jwt_required()
def create_product():
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user or user.rol.id != 2:
            return jsonify({'error': 'No tienes permisos para crear productos'}), 403

        body = request.get_json()
        required_fields = ['name', 'description', 'price']

        for field in required_fields:
            if field not in body or not body[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400

        # Procesar imágenes
        images_data = body.get('images', [])
        if not images_data:
            return jsonify({'error': 'Debes subir al menos una imagen'}), 400

        if len(images_data) > MAX_IMAGES:
            return jsonify({'error': f'Máximo {MAX_IMAGES} imágenes permitidas'}), 400

        uploaded_images = []

        for idx, img_data in enumerate(images_data):
            if img_data.startswith('data:image'):
                try:
                    upload_result = cloudinary.uploader.upload(
                        img_data,
                        folder="kurisushop_products"
                    )
                    uploaded_images.append(upload_result.get('secure_url'))
                except Exception as img_exc:
                    print(f'ERROR SUBIENDO IMAGEN {idx}:', img_exc)
                    # Si falla alguna imagen, eliminar las ya subidas
                    for uploaded_url in uploaded_images:
                        try:
                            public_id = uploaded_url.split(
                                '/')[-1].split('.')[0]
                            cloudinary.uploader.destroy(
                                f"kurisushop_products/{public_id}")
                        except:
                            pass
                    return jsonify({'error': f'Error al subir la imagen {idx + 1}'}), 500
            else:
                uploaded_images.append(img_data)

        new_product = Product(
            name=body['name'],
            description=body['description'],
            images=uploaded_images,
            price=float(body['price']),
            user_id=current_user_id,
            status=body.get('status', True)
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            'message': 'Producto creado exitosamente',
            'product': new_product.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/selectproducttomodify/<int:product_id>', methods=['GET', 'PUT'])
@jwt_required()
def manage_product(product_id):
    try:
        current_user_id = int(get_jwt_identity())
        product = Product.query.get(product_id)

        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404

        if product.user_id != current_user_id:
            return jsonify({'error': 'No tienes permiso para modificar este producto'}), 403

        if request.method == 'GET':
            return jsonify(product.serialize()), 200

        # PUT - Actualizar producto
        body = request.get_json()

        # Actualizar campos básicos
        if 'name' in body:
            product.name = body['name']
        if 'description' in body:
            product.description = body['description']
        if 'price' in body:
            product.price = float(body['price'])
        if 'status' in body:
            product.status = body['status']

        # Procesar imágenes si se envían
        if 'images' in body:
            images_data = body['images']

            if len(images_data) > MAX_IMAGES:
                return jsonify({'error': f'Máximo {MAX_IMAGES} imágenes permitidas'}), 400

            new_uploaded_images = []

            for idx, img_data in enumerate(images_data):
                # Si es una URL existente, mantenerla
                if img_data.startswith('http'):
                    new_uploaded_images.append(img_data)
                # Si es base64, subirla
                elif img_data.startswith('data:image'):
                    try:
                        upload_result = cloudinary.uploader.upload(
                            img_data,
                            folder="kurisushop_products"
                        )
                        new_uploaded_images.append(
                            upload_result.get('secure_url'))
                    except Exception as img_exc:
                        print(f'ERROR SUBIENDO IMAGEN {idx}:', img_exc)
                        return jsonify({'error': f'Error al subir la imagen {idx + 1}'}), 500

            product.images = new_uploaded_images

        db.session.commit()

        return jsonify({
            'message': 'Producto actualizado exitosamente',
            'product': product.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/selectproducttomodify/<int:product_id>/status', methods=['PATCH'])
@jwt_required()
def change_product_status(product_id):
    try:
        current_user_id = int(get_jwt_identity())
        product = Product.query.get(product_id)

        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404

        if product.user_id != current_user_id:
            return jsonify({'error': 'No tienes permiso para modificar este producto'}), 403

        body = request.get_json()
        product.status = body.get('status', product.status)

        db.session.commit()

        return jsonify({
            'message': 'Estado del producto actualizado',
            'product': product.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
