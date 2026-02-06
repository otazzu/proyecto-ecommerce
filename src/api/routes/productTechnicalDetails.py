from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from api.database.db import db
from api.models.ProductTechnicalDetails import ProductTechnicalDetails
from api.models.Product import Product
from api.models.User import User

api = Blueprint('api/product_technical_details', __name__)


@api.route('/product/<int:product_id>/technical-details', methods=['POST'])
@jwt_required()
def create_technical_details(product_id):
    try:
        current_user_id = int(get_jwt_identity())
        product = Product.query.get(product_id)

        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404

        # Verificar que el usuario es el propietario del producto
        if product.user_id != current_user_id:
            return jsonify({'error': 'No tienes permiso para modificar este producto'}), 403

        # Verificar si ya existen detalles técnicos
        existing_details = ProductTechnicalDetails.query.filter_by(
            product_id=product_id
        ).first()

        if existing_details:
            return jsonify({'error': 'Este producto ya tiene detalles técnicos. Usa PUT para actualizar.'}), 400

        body = request.get_json()

        new_technical_details = ProductTechnicalDetails(
            product_id=product_id,
            manufacturer=body.get('manufacturer'),
            collection=body.get('collection'),
            anime_series=body.get('anime_series'),
            character=body.get('character')
        )

        db.session.add(new_technical_details)
        db.session.commit()

        return jsonify({
            'message': 'Detalles técnicos creados exitosamente',
            'technical_details': new_technical_details.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
