import jwt
from functools import wraps
from flask import request, jsonify, current_app
from app.models import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = None

        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()

        if not token:
            return jsonify({'error': 'authorization token required'}), 401

        try:
            payload = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
            user_id = payload.get('sub')
            if not user_id:
                raise jwt.InvalidTokenError()

            current_user = User.query.get(user_id)
            if not current_user:
                return jsonify({'error': 'invalid token'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'invalid token'}), 401

        return f(current_user=current_user, *args, **kwargs)

    return decorated
