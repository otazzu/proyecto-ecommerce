import logging
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from api.database.db import db
from api.models.ProductTechnicalDetails import ProductTechnicalDetails
from api.models.Product import Product
from api.models.User import User

logger = logging.getLogger(__name__)

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
        logger.error(f"Error en get_technical_details: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


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
            manufacturer=body.get('manufacturer', '').strip().upper() if body.get('manufacturer') else None,
            collection=body.get('collection', '').strip().upper() if body.get('collection') else None,
            anime_series=body.get('anime_series', '').strip().upper() if body.get('anime_series') else None,
            character=body.get('character', '').strip().upper() if body.get('character') else None
        )

        db.session.add(new_technical_details)
        db.session.commit()

        return jsonify({
            'message': 'Detalles técnicos creados exitosamente',
            'technical_details': new_technical_details.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error en create_technical_details: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


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
            technical_details.manufacturer = body['manufacturer'].strip().upper() if body['manufacturer'] else None
        if 'collection' in body:
            technical_details.collection = body['collection'].strip().upper() if body['collection'] else None
        if 'anime_series' in body:
            technical_details.anime_series = body['anime_series'].strip().upper() if body['anime_series'] else None
        if 'character' in body:
            technical_details.character = body['character'].strip().upper() if body['character'] else None

        db.session.commit()

        return jsonify({
            'message': 'Detalles técnicos actualizados exitosamente',
            'technical_details': technical_details.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error en update_technical_details: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


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
        logger.error(f"Error en search_by_technical_details: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@api.route('/anime-series', methods=['GET'])
def get_all_anime_series():

    try:
        # Obtener todas las series únicas que tienen productos activos
        anime_series = db.session.query(ProductTechnicalDetails.anime_series)\
            .join(Product)\
            .filter(
                Product.status == True,
                ProductTechnicalDetails.anime_series != None,
                ProductTechnicalDetails.anime_series != ''
        )\
            .distinct()\
            .all()

        # Extraer solo los nombres de las series
        series_list = [series[0] for series in anime_series if series[0]]

        return jsonify(series_list), 200

    except Exception as e:
        logger.error(f"Error en get_all_anime_series: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500