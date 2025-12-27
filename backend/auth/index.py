import json
import os
import psycopg2
import hashlib
import secrets
from datetime import datetime

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: dict, context) -> dict:
    """API для регистрации и авторизации игроков Lineage 2"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                username = body.get('username', '').strip()
                email = body.get('email', '').strip()
                password = body.get('password', '')
                character_class = body.get('character_class', '')
                
                if not username or not email or not password or not character_class:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Все поля обязательны'}),
                        'isBase64Encoded': False
                    }
                
                if len(password) < 6:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                token = generate_token()
                
                conn = get_db_connection()
                cur = conn.cursor()
                
                try:
                    cur.execute(
                        """INSERT INTO players (username, email, password_hash, character_class, last_login, is_online) 
                           VALUES (%s, %s, %s, %s, %s, true) RETURNING id""",
                        (username, email, password_hash, character_class, datetime.now())
                    )
                    player_id = cur.fetchone()[0]
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({
                            'success': True,
                            'token': token,
                            'player': {
                                'id': player_id,
                                'username': username,
                                'email': email,
                                'character_class': character_class,
                                'level': 1,
                                'experience': 0
                            }
                        }),
                        'isBase64Encoded': False
                    }
                except psycopg2.IntegrityError as e:
                    conn.rollback()
                    if 'username' in str(e):
                        error_msg = 'Это имя персонажа уже занято'
                    else:
                        error_msg = 'Этот email уже зарегистрирован'
                    return {
                        'statusCode': 409,
                        'headers': headers,
                        'body': json.dumps({'error': error_msg}),
                        'isBase64Encoded': False
                    }
                finally:
                    cur.close()
                    conn.close()
            
            elif action == 'login':
                username = body.get('username', '').strip()
                password = body.get('password', '')
                
                if not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Введите имя и пароль'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                token = generate_token()
                
                conn = get_db_connection()
                cur = conn.cursor()
                
                try:
                    cur.execute(
                        """SELECT id, username, email, character_class, level, experience 
                           FROM players WHERE username = %s AND password_hash = %s""",
                        (username, password_hash)
                    )
                    result = cur.fetchone()
                    
                    if not result:
                        return {
                            'statusCode': 401,
                            'headers': headers,
                            'body': json.dumps({'error': 'Неверное имя или пароль'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(
                        """UPDATE players SET last_login = %s, is_online = true WHERE id = %s""",
                        (datetime.now(), result[0])
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({
                            'success': True,
                            'token': token,
                            'player': {
                                'id': result[0],
                                'username': result[1],
                                'email': result[2],
                                'character_class': result[3],
                                'level': result[4],
                                'experience': result[5]
                            }
                        }),
                        'isBase64Encoded': False
                    }
                finally:
                    cur.close()
                    conn.close()
            
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неизвестное действие'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            conn = get_db_connection()
            cur = conn.cursor()
            
            try:
                cur.execute(
                    """SELECT character_class, COUNT(*) as count 
                       FROM players 
                       GROUP BY character_class 
                       ORDER BY count DESC"""
                )
                stats = cur.fetchall()
                
                cur.execute("SELECT COUNT(*) FROM players")
                total = cur.fetchone()[0]
                
                cur.execute("SELECT COUNT(*) FROM players WHERE is_online = true")
                online = cur.fetchone()[0]
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'total_players': total,
                        'online_players': online,
                        'class_stats': [{'class': row[0], 'count': row[1]} for row in stats]
                    }),
                    'isBase64Encoded': False
                }
            finally:
                cur.close()
                conn.close()
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Метод не поддерживается'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
