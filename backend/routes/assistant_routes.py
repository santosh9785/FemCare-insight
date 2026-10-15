"""
Symptom Assistant routes for Sahaaya.
Handles conversational turns, language switching, saving history, and structured outputs.
"""
from flask import Blueprint, request, jsonify
import uuid
import json
from models.database import get_db
from services.ai_service import generate_symptom_response, detect_language

assistant_bp = Blueprint('assistant', __name__)

@assistant_bp.route('/message', methods=['POST'])
def process_message():
    data = request.get_json() or {}
    message_text = data.get('message', '').strip()
    user_id = data.get('user_id', 'user-demo-priya')
    conversation_id = data.get('conversation_id')
    user_lang = data.get('language', 'en')

    if not message_text:
        return jsonify({"error": "Message content cannot be empty"}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Create conversation if not exists
    if not conversation_id:
        conversation_id = f"conv-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO symptom_conversations (id, user_id, language)
            VALUES (?, ?, ?)
        """, (conversation_id, user_id, user_lang))

    # Save user message
    user_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
    detected_lang = detect_language(message_text, user_lang)
    cursor.execute("""
        INSERT INTO symptom_messages (id, conversation_id, role, content, detected_language)
        VALUES (?, ?, 'user', ?, ?)
    """, (user_msg_id, conversation_id, message_text, detected_lang))

    # Generate AI structured response
    ai_result = generate_symptom_response(message_text, detected_lang)

    # Save assistant message
    asst_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO symptom_messages (id, conversation_id, role, content, detected_language, structured_data)
        VALUES (?, ?, 'assistant', ?, ?, ?)
    """, (asst_msg_id, conversation_id, ai_result.get('general_explanation', ''), detected_lang, json.dumps(ai_result)))

    conn.commit()
    conn.close()

    return jsonify({
        "conversation_id": conversation_id,
        "user_message": {
            "id": user_msg_id,
            "role": "user",
            "content": message_text,
            "language": detected_lang
        },
        "response": ai_result
    })

@assistant_bp.route('/conversations', methods=['GET'])
def get_conversations():
    user_id = request.args.get('user_id', 'user-demo-priya')
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.id, c.language, c.created_at,
               (SELECT content FROM symptom_messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1) as first_query,
               (SELECT COUNT(*) FROM symptom_messages WHERE conversation_id = c.id) as message_count
        FROM symptom_conversations c
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    conversations = []
    for r in rows:
        conversations.append({
            "id": r['id'],
            "language": r['language'],
            "created_at": r['created_at'],
            "first_query": r['first_query'] or "Health Discussion",
            "message_count": r['message_count']
        })
    return jsonify({"conversations": conversations})

@assistant_bp.route('/conversations/<conv_id>', methods=['GET'])
def get_conversation_detail(conv_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, role, content, detected_language, structured_data, created_at
        FROM symptom_messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
    """, (conv_id,))
    rows = cursor.fetchall()
    conn.close()

    messages = []
    for r in rows:
        item = {
            "id": r['id'],
            "role": r['role'],
            "content": r['content'],
            "detected_language": r['detected_language'],
            "created_at": r['created_at']
        }
        if r['structured_data']:
            try:
                item['structured_data'] = json.loads(r['structured_data'])
            except:
                pass
        messages.append(item)

    return jsonify({"conversation_id": conv_id, "messages": messages})

@assistant_bp.route('/conversations/<conv_id>', methods=['DELETE'])
def delete_conversation(conv_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM symptom_messages WHERE conversation_id = ?", (conv_id,))
    cursor.execute("DELETE FROM symptom_conversations WHERE id = ?", (conv_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Conversation history deleted permanently", "deleted_id": conv_id})
