
import os
from flask_admin import Admin
from api.database.db import db
from api.models.User import User
from api.models.Product import Product
from api.models.Review import Review
from api.models.Rol import Rol
from api.models.Address import Address
from api.models.StripePay import StripePay
from api.models.ProductTechnicalDetails import ProductTechnicalDetails
from flask_admin.contrib.sqla import ModelView


class UserView(ModelView):
    # Columnas a mostrar en la lista
    column_list = ['id', 'user_name', 'first_name',
                   'last_name', 'email', 'rol_id', 'img']

    column_labels = {
        'user_name': 'Usuario',
        'first_name': 'Nombre',
        'last_name': 'Apellido',
        'rol_id': 'ID Rol',
        'img': 'Imagen'
    }

    # Columnas buscables
    column_searchable_list = ['user_name', 'email', 'first_name', 'last_name']

    # Filtros
    column_filters = ['rol_id']

    # Ocultar la contraseña por seguridad
    form_excluded_columns = ['password']
    column_exclude_list = ['password']


class ProductView(ModelView):
    column_list = ['id', 'name', 'price',
                   'review', 'user_id', 'status', 'images']

    column_labels = {
        'name': 'Nombre',
        'price': 'Precio',
        'review': 'Valoración',
        'user_id': 'ID Usuario',
        'status': 'Estado',
        'images': 'Imágenes'
    }

    column_searchable_list = ['name', 'description']
    column_filters = ['user_id', 'status', 'price']

    # Formatear el precio con símbolo de moneda
    column_formatters = {
        'price': lambda v, c, m, p: f'{m.price:.2f}€'
    }


# Vista personalizada para ProductTechnicalDetails
class ProductTechnicalDetailsView(ModelView):
    column_list = ['id', 'product_id', 'manufacturer',
                   'collection', 'anime_series', 'character']

    column_labels = {
        'product_id': 'ID Producto',
        'manufacturer': 'Fabricante',
        'collection': 'Colección',
        'anime_series': 'Serie de Anime',
        'character': 'Personaje'
    }

    column_searchable_list = ['manufacturer', 'anime_series', 'character']
    column_filters = ['product_id', 'manufacturer', 'anime_series']


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Kurisu Shop Admin', template_mode='bootstrap3')

    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(UserView(User, db.session, name='Usuarios'))
    admin.add_view(ModelView(Rol, db.session))
    admin.add_view(ProductView(Product, db.session, name='Productos'))
    admin.add_view(ModelView(Address, db.session))
    admin.add_view(ProductTechnicalDetailsView(
        ProductTechnicalDetails, db.session, name='Detalles Técnicos'))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
