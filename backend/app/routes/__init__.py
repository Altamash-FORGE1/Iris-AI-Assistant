from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__, url_prefix='/api/v1/health')

@health_bp.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'Iris AI Assistant backend is running'
    }), 200
