import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from passlib.hash import bcrypt
from sqlalchemy import or_

from app import db
from app.models import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/signup', methods=['POST'])
def signup():
    payload = request.get_json(silent=True) or {}
    username = (payload.get('username') or '').strip()
    email = (payload.get('email') or '').strip().lower()
    password = payload.get('password', '')

    if not username or not email or not password:
        return jsonify({'error': 'username, email, and password are required'}), 400

    if len(password) < 8:
        return jsonify({'error': 'password must be at least 8 characters long'}), 400

    if '@' not in email:
        return jsonify({'error': 'invalid email address'}), 400

    existing_user = User.query.filter(or_(User.username == username, User.email == email)).first()
    if existing_user:
        return jsonify({'error': 'username or email already in use'}), 409

    hashed_password = bcrypt.hash(password)
    user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()

    token = jwt.encode(
        {
            'sub': str(user.id),
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(hours=24),
        },
        current_app.config['JWT_SECRET'],
        algorithm='HS256',
    )

    return jsonify({'token': token, 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get('email') or '').strip().lower()
    password = payload.get('password', '')

    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.verify(password, user.password_hash):
        return jsonify({'error': 'invalid credentials'}), 401

    token = jwt.encode(
        {
            'sub': str(user.id),
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(hours=24),
        },
        current_app.config['JWT_SECRET'],
        algorithm='HS256',
    )

    return jsonify({'token': token, 'user': user.to_dict()}), 200
