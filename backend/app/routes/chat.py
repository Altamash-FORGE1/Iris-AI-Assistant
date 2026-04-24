import os
from flask import Blueprint, request, jsonify
from groq import Groq

chat_bp = Blueprint('chat', __name__)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    if not message:
        return jsonify({"error": "Message is required"}), 400

    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are Iris, a supportive and professional AI health assistant."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        iris_response = response.choices[0].message.content
        return jsonify({"response": iris_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500