import logging
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from api.database.db import db
from api.models.Product import Product
from api.models.User import User
import cloudinary.uploader
import cloudinary
import os

logger = logging.getLogger(__name__)

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
        logger.error(f"Error en get_products: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@api.route('/products/actives', methods=['GET'])
def get_actives_products():
    try:
        active_products = Product.query.filter_by(status=True).all()
        return jsonify([product.serialize() for product in active_products]), 200
    except Exception as e:
        logger.error(f"Error en get_actives_products: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@api.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404
        return jsonify(product.serialize()), 200
    except Exception as e:
        logger.error(f"Error en get_product_by_id: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


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
                    logger.error(f'Error subiendo imagen {idx}: %s', img_exc)
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
            name=body['name'].strip().upper(),
            description=body['description'].strip(),
            images=uploaded_images,
            price=float(body['price']),
            user_id=current_user_id,
            status=body.get('status', True),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            original_price=body.get("original_price", None),
            on_sale=body.get("on_sale", False),
            sale_updated_at=datetime.utcnow() if body.get("on_sale", False) else None,
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            'message': 'Producto creado exitosamente',
            'product': new_product.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error en create_product: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


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

        # Detectar si el precio ha cambiado
        if "price" in body and body["price"] != product.price:
            if product.on_sale:
                product.sale_updated_at = datetime.utcnow()

        # Si se activa la oferta y no hay precio original, guardar el precio actual
        if body.get("on_sale", False) and not product.original_price:
            product.original_price = product.price

        # Actualizar campos básicos
        if 'name' in body:
            product.name = body['name'].strip().upper()
        if 'description' in body:
            product.description = body['description'].strip()
        if 'price' in body:
            product.price = float(body['price'])
        if 'status' in body:
            product.status = body['status']

        product.original_price = body.get("original_price", product.original_price)
        product.on_sale = body.get("on_sale", product.on_sale)
        product.updated_at = datetime.utcnow()

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
                        logger.error(f'Error subiendo imagen {idx}: %s', img_exc)
                        return jsonify({'error': f'Error al subir la imagen {idx + 1}'}), 500

            product.images = new_uploaded_images

        db.session.commit()

        return jsonify({
            'message': 'Producto actualizado exitosamente',
            'product': product.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error en manage_product: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


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
        logger.error(f"Error en change_product_status: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@api.route("/products/<int:product_id>/toggle-sale", methods=["PATCH"])
@jwt_required()
def toggle_product_sale(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    current_user_id = get_jwt_identity()
    if product.user_id != current_user_id:
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()

    if data.get("on_sale") == True:
        product.original_price = product.price
        product.on_sale = True
        product.sale_updated_at = datetime.utcnow()
    elif data.get("on_sale") == False:
        if product.original_price:
            product.price = product.original_price
            product.original_price = None
        product.on_sale = False
        product.sale_updated_at = None

    product.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"msg": "Oferta actualizada", "product": product.serialize()}), 200


@api.route("/products/new", methods=["GET"])
def get_new_products():
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_products = Product.query.filter(
        Product.created_at >= thirty_days_ago,
        Product.status == True
    ).order_by(Product.created_at.desc()).all()
    return jsonify([p.serialize() for p in new_products]), 200


@api.route("/products/recently-updated", methods=["GET"])
def get_recently_updated_products():
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    updated_products = Product.query.filter(
        Product.sale_updated_at >= thirty_days_ago,
        Product.status == True,
        Product.on_sale == True
    ).order_by(Product.sale_updated_at.desc()).all()
    return jsonify([p.serialize() for p in updated_products]), 200