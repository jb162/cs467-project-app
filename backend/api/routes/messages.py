from flask import Blueprint, request, jsonify
from api.utils.db import get_db_connection
import traceback

messages_bp = Blueprint('messages', __name__, url_prefix='/v1')

@messages_bp.route('/Messages', methods=['GET'])
def get_messages():
    """Get messages between a sender and receiver OR all messages involving a user (inbox view)"""
    try:
        sender = request.args.get('sender')
        receiver = request.args.get('receiver')
        user = request.args.get('user')  # for inbox
        page = request.args.get('page', default=1, type=int)
        page_size = request.args.get('page_size', default=100, type=int)
        offset = (page - 1) * page_size

        conn = get_db_connection()
        cursor = conn.cursor()

        if sender and receiver:
            # Thread between two users
            cursor.execute("""
                SELECT COUNT(*) FROM messages
                WHERE (sender = %s AND receiver = %s) OR (sender = %s AND receiver = %s)
            """, (sender, receiver, receiver, sender))
            total_count = cursor.fetchone()[0]

            cursor.execute("""
                SELECT id, sender, receiver, sent_datetime, message_body
                FROM messages
                WHERE (sender = %s AND receiver = %s) OR (sender = %s AND receiver = %s)
                ORDER BY sent_datetime ASC
                LIMIT %s OFFSET %s
            """, (sender, receiver, receiver, sender, page_size, offset))

        elif user:
            # Inbox
            cursor.execute("""
                SELECT COUNT(*) FROM messages
                WHERE sender = %s OR receiver = %s
            """, (user, user))
            total_count = cursor.fetchone()[0]

            cursor.execute("""
                SELECT id, sender, receiver, sent_datetime, message_body
                FROM messages
                WHERE sender = %s OR receiver = %s
                ORDER BY sent_datetime DESC
                LIMIT %s OFFSET %s
            """, (user, user, page_size, offset))

        else:
            return jsonify({"error": "Provide either sender and receiver, or user"}), 400

        rows = cursor.fetchall()
        messages = [{
            'id': row[0],
            'sender': row[1],
            'receiver': row[2],
            'sent_datetime': row[3].isoformat() if row[3] else None,
            'message_body': row[4]
        } for row in rows]

        total_pages = (total_count + page_size - 1) // page_size

        cursor.close()
        conn.close()

        return jsonify({
            'messages': messages,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_count': total_count,
                'total_pages': total_pages
            }
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Error retrieving messages: {str(e)}"}), 500

@messages_bp.route('/Messages', methods=['POST'])
def send_message():
    """Send a new message from sender to receiver"""
    try:
        data = request.get_json()
        sender = data.get('sender')
        receiver = data.get('receiver')
        message_body = data.get('message_body')

        if not sender or not receiver or not message_body:
            return jsonify({"error": "sender, receiver, and message_body are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO messages (sender, receiver, message_body)
            VALUES (%s, %s, %s)
            RETURNING id, sent_datetime
        """, (sender, receiver, message_body))

        message_id, sent_datetime = cursor.fetchone()

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "id": message_id,
            "sender": sender,
            "receiver": receiver,
            "message_body": message_body,
            "sent_datetime": sent_datetime.isoformat()
        }), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Error sending message: {str(e)}"}), 500

@messages_bp.route('/Messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    """Delete a message by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM messages WHERE id = %s", (message_id,))
        if cursor.fetchone() is None:
            cursor.close()
            conn.close()
            return jsonify({"error": "Message not found"}), 404

        cursor.execute("DELETE FROM messages WHERE id = %s", (message_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": f"Message {message_id} deleted"}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Error deleting message: {str(e)}"}), 500

