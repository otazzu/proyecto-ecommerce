"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import logging
from datetime import timedelta
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.database.db import db
from api.models import *
from flask_cors import CORS
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from api.routes.user import api as user_api
from api.routes.product import api as product_api
from api.routes.address import api as address_api
from api.routes.productTechnicalDetails import api as product_technical_details_api
from api.limiter import limiter
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

load_dotenv()

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)

# Validate JWT_SECRET_KEY
jwt_secret = os.environ.get('JWT_SECRET_KEY')
if not jwt_secret:
    raise RuntimeError("JWT_SECRET_KEY no está configurada. Por favor, define la variable de entorno JWT_SECRET_KEY.")

CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')], supports_credentials=True)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = jwt_secret
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

# Rate limiting
limiter.init_app(app)

# Security headers (only in production)
if ENV != "development":
    from flask_talisman import Talisman
    csp = {
        'default-src': "'self'",
        'script-src': "'self' 'unsafe-inline'",
        'style-src': "'self' 'unsafe-inline'",
        'img-src': "'self' data: https: cloudinary.com res.cloudinary.com",
        'connect-src': "'self' http://localhost:3001 https:",
        'font-src': "'self' https: data:",
    }
    Talisman(app, content_security_policy=csp, force_https=False)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(user_api, url_prefix='/api/user')
app.register_blueprint(product_api, url_prefix='/api/product')
app.register_blueprint(address_api, url_prefix='/api/address')
app.register_blueprint(product_technical_details_api,
                       url_prefix='/api/product_technical_details')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.errorhandler(500)
def handle_internal_error(error):
    app.logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Error interno del servidor'}), 500

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)