from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from api.database.db import db
from api.models.ProductTechnicalDetails import ProductTechnicalDetails
from api.models.Product import Product
from api.models.User import User

api = Blueprint('api/product_technical_details', __name__)


@api.route('/product/<int:product_id>/technical-details', methods=['GET'])
def get_technical_details(product_id):

    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404

        technical_details = ProductTechnicalDetails.query.filter_by(
            product_id=product_id
        ).first()

        if not technical_details:
            return jsonify({'message': 'Este producto no tiene detalles técnicos'}), 404

        return jsonify(technical_details.serialize()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


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


@api.route('/product/<int:product_id>/technical-details', methods=['PUT'])
@jwt_required()
def update_technical_details(product_id):

    try:
        current_user_id = int(get_jwt_identity())
        product = Product.query.get(product_id)

        if not product:
            return jsonify({'error': 'Producto no encontrado'}), 404

        # Verificar que el usuario es el propietario del producto
        if product.user_id != current_user_id:
            return jsonify({'error': 'No tienes permiso para modificar este producto'}), 403

        technical_details = ProductTechnicalDetails.query.filter_by(
            product_id=product_id
        ).first()

        if not technical_details:
            return jsonify({'error': 'No existen detalles técnicos para este producto. Usa POST para crear.'}), 404

        body = request.get_json()

        # Actualizar campos (solo si se proporcionan)
        if 'manufacturer' in body:
            technical_details.manufacturer = body['manufacturer']
        if 'collection' in body:
            technical_details.collection = body['collection']
        if 'anime_series' in body:
            technical_details.anime_series = body['anime_series']
        if 'character' in body:
            technical_details.character = body['character']

        db.session.commit()

        return jsonify({
            'message': 'Detalles técnicos actualizados exitosamente',
            'technical_details': technical_details.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/technical-details/search', methods=['GET'])
def search_by_technical_details():

    try:
        manufacturer = request.args.get('manufacturer')
        collection = request.args.get('collection')
        anime_series = request.args.get('anime_series')
        character = request.args.get('character')

        query = db.session.query(Product).join(ProductTechnicalDetails)

        if manufacturer:
            query = query.filter(
                ProductTechnicalDetails.manufacturer.ilike(f'%{manufacturer}%')
            )
        if collection:
            query = query.filter(
                ProductTechnicalDetails.collection.ilike(f'%{collection}%')
            )
        if anime_series:
            query = query.filter(
                ProductTechnicalDetails.anime_series.ilike(f'%{anime_series}%')
            )
        if character:
            query = query.filter(
                ProductTechnicalDetails.character.ilike(f'%{character}%')
            )

        products = query.filter(Product.status == True).all()

        return jsonify([product.serialize() for product in products]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
