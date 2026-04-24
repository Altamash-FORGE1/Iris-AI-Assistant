import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

load_dotenv()

# Flask extension instances

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    """Application factory function."""
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://iris_user:iris_password@localhost:5432/iris_db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET'] = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Import models so Flask-Migrate can autogenerate migrations
    from app.models import User, VisionProfile, IrisScan  # noqa: F401

    # Enable CORS
    CORS(app)

    # Register blueprints
    from app.routes import health_bp, auth_bp
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)

    return app
