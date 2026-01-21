from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.database.db import db
from api.models.User import User
from api.models.Product import Product
import cloudinary.uploader
import cloudinary
import os

api = Blueprint('api/product', __name__)

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.serialize() for product in products]), 200


@api.route('/products/<int:product_id>', methods=['GET'])
@jwt_required(optional=True)
def get_product_by_id(product_id):

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    current_user_id = get_jwt_identity()

    if not product.status and product.user_id != current_user_id:
        return jsonify({"error": "Producto no disponible"}), 403

    return jsonify(product.serialize()), 200


@api.route('/create', methods=['POST'])
@jwt_required()
def add_product():
    body = request.get_json()
    img_url = None
    video_url = None

    if "img" in body and body['img']:
        try:
            upload_result = cloudinary.uploader.upload(
                body['img'], folder="kurisushop_media")
            img_url = upload_result.get('secure_url')
        except Exception as img_exc:
            print('ERROR SUBIENDO IMAGEN A CLOUDINARY:', img_exc)
            img_url = None

    if "video" in body and body['video']:
        try:
            upload_result = cloudinary.uploader.upload(
                body['video'],
                folder="kurisushop_media",
                resource_type="video")
            video_url = upload_result.get('secure_url')
        except Exception as video_exc:
            print('ERROR SUBIENDO EL VIDEO A CLOUDINARY:', video_exc)
            video_url = None

    if body is None:
        return jsonify({"Error": "Error al enviar los datos"}), 400

    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if user.rol_id == 1:
        return jsonify({"error": "El usuario no tiene permiso"}), 400

    if "name" not in body:
        return jsonify({"error": "Falta el nombre"}), 400

    if "description" not in body:
        return jsonify({"error": "Falta la descripcion"}), 400

    if "price" not in body:
        return jsonify({"error": "Falta el precio"}), 400

    existing_name = Product.query.filter_by(name=body["name"]).first()

    if existing_name:
        return jsonify({"error": "Nombre de producto ya existente"}), 400

    new_product = Product(
        name=body["name"],
        description=body['description'],
        img=img_url,
        video=video_url,
        price=body['price'],
        url=body.get('url'),
        review=body.get('review'),
        user_id=user.id,
        status=body.get('status'),
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.serialize()), 201
