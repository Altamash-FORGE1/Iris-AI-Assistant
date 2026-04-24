import uuid

import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from passlib.hash import bcrypt
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError

from app import db
from app.models import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


def _generate_jwt(user: User) -> str:
    return jwt.encode(
        {
            'sub': str(user.id),
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(hours=24),
        },
        current_app.config['JWT_SECRET'],
        algorithm='HS256',
    )


@auth_bp.route('/signup', methods=['POST'])
def signup():
    print("--- SIGNUP REQUEST RECEIVED ---")
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

    try:
        hashed_password = bcrypt.hash(password.encode('utf-8'))
    except Exception as e:
        return jsonify({'error': 'password hashing failed', 'message': str(e)}), 500

    user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(user)

    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        print('--- DB COMMIT ERROR ---', str(e))
        return jsonify({'error': 'database error', 'message': str(e)}), 500

    token = _generate_jwt(user)
    return jsonify({'token': token, 'user': user.to_dict()}), 201


@auth_bp.route('/google', methods=['POST'])
def google_login():
    print('--- GOOGLE SIGNIN REQUEST RECEIVED ---')
    payload = request.get_json(silent=True) or {}
    credential = payload.get('credential', '')

    if not credential:
        return jsonify({'error': 'credential is required'}), 400

    try:
        idinfo = id_token.verify_oauth2_token(
            credential,
            GoogleRequest(),
            current_app.config.get('GOOGLE_CLIENT_ID'),
        )
    except ValueError as e:
        return jsonify({'error': 'invalid Google token', 'message': str(e)}), 401

    email = (idinfo.get('email') or '').strip().lower()
    username = (idinfo.get('name') or email.split('@')[0]).strip()
    email_verified = idinfo.get('email_verified', True)

    if not email:
        return jsonify({'error': 'Google credential did not return an email'}), 400

    if email_verified is False:
        return jsonify({'error': 'Google email address is not verified'}), 401

    user = User.query.filter_by(email=email).first()
    new_user = False

    if not user:
        safe_username = username or email.split('@')[0]
        original_username = safe_username
        counter = 1
        while User.query.filter_by(username=safe_username).first():
            safe_username = f"{original_username}-{counter}"
            counter += 1

        user = User(
            username=safe_username,
            email=email,
            password_hash=bcrypt.hash(uuid.uuid4().hex),
        )
        db.session.add(user)

        try:
            db.session.commit()
            new_user = True
        except SQLAlchemyError as e:
            db.session.rollback()
            print('--- DB COMMIT ERROR ---', str(e))
            return jsonify({'error': 'database error', 'message': str(e)}), 500

    token = _generate_jwt(user)
    status = 201 if new_user else 200
    return jsonify({'token': token, 'user': user.to_dict()}), status


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
