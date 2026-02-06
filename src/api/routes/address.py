from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from api.database.db import db
from api.models.Address import Address
from api.models.User import User

api = Blueprint('api/address', __name__)


@api.route('/addresses', methods=['GET', 'POST'])
@jwt_required()
def manage_addresses():

    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if request.method == 'GET':
            addresses = Address.query.filter_by(user_id=current_user_id).all()
            return jsonify([address.serialize() for address in addresses]), 200

        # POST - Crear nueva dirección
        body = request.get_json()
        required_fields = ['street', 'number',
                           'city', 'province', 'postal_code']

        for field in required_fields:
            if field not in body or not body[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400

        # Si es la primera dirección o se marca como default, hacer que sea la predeterminada
        is_default = body.get('is_default', False)
        existing_addresses = Address.query.filter_by(
            user_id=current_user_id).count()

        if existing_addresses == 0:
            is_default = True
        elif is_default:
            # Si se marca como default, quitar el default de las demás
            Address.query.filter_by(user_id=current_user_id, is_default=True).update(
                {'is_default': False})

        new_address = Address(
            user_id=current_user_id,
            street=body['street'],
            number=body['number'],
            apartment=body.get('apartment'),
            city=body['city'],
            province=body['province'],
            postal_code=body['postal_code'],
            country=body.get('country', 'España'),
            phone=body.get('phone'),
            is_default=is_default
        )

        db.session.add(new_address)
        db.session.commit()

        return jsonify({
            'message': 'Dirección creada exitosamente',
            'address': new_address.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/addresses/<int:address_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def manage_address(address_id):

    try:
        current_user_id = int(get_jwt_identity())
        address = Address.query.get(address_id)

        if not address:
            return jsonify({'error': 'Dirección no encontrada'}), 404

        if address.user_id != current_user_id:
            return jsonify({'error': 'No tienes permiso para acceder a esta dirección'}), 403

        if request.method == 'GET':
            return jsonify(address.serialize()), 200

        elif request.method == 'PUT':
            body = request.get_json()

            # Si se marca como default, quitar el default de las demás
            if body.get('is_default') == True:
                Address.query.filter_by(user_id=current_user_id, is_default=True).update(
                    {'is_default': False})

            # Actualizar campos
            updatable_fields = ['street', 'number', 'apartment', 'city',
                                'province', 'postal_code', 'country', 'phone', 'is_default']

            for field in updatable_fields:
                if field in body:
                    setattr(address, field, body[field])

            db.session.commit()

            return jsonify({
                'message': 'Dirección actualizada exitosamente',
                'address': address.serialize()
            }), 200

        elif request.method == 'DELETE':
            # No permitir eliminar si es la única dirección
            remaining_addresses = Address.query.filter_by(
                user_id=current_user_id).count()

            if remaining_addresses == 1:
                return jsonify({'warning': 'No puedes eliminar tu única dirección'}), 400

            db.session.delete(address)

            # Si era la dirección por defecto, hacer que otra sea la default
            if address.is_default:
                new_default = Address.query.filter_by(
                    user_id=current_user_id).first()
                if new_default:
                    new_default.is_default = True

            db.session.commit()

            return jsonify({'message': 'Dirección eliminada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/addresses/<int:address_id>/set-default', methods=['PUT'])
@jwt_required()
def set_default_address(address_id):

    try:
        current_user_id = int(get_jwt_identity())
        address = Address.query.get(address_id)

        if not address:
            return jsonify({'error': 'Dirección no encontrada'}), 404

        if address.user_id != current_user_id:
            return jsonify({'error': 'No tienes permiso para acceder a esta dirección'}), 403

        # Quitar el default de todas las direcciones del usuario
        Address.query.filter_by(user_id=current_user_id,
                                is_default=True).update({'is_default': False})

        # Establecer esta como default
        address.is_default = True
        db.session.commit()

        return jsonify({
            'message': 'Dirección establecida como predeterminada',
            'address': address.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/addresses/default', methods=['GET'])
@jwt_required()
def get_default_address():

    try:
        current_user_id = int(get_jwt_identity())
        address = Address.query.filter_by(
            user_id=current_user_id,
            is_default=True
        ).first()

        if not address:
            return jsonify({'error': 'No tienes una dirección predeterminada'}), 404

        return jsonify(address.serialize()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
