"""API для управления форумом сервера Lineage 2"""

import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    # CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': ''
        }
    
    path = event.get('path', '/')
    
    # Подключение к БД
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        # GET /categories - получить все категории
        if method == 'GET' and path == '/categories':
            cur.execute("""
                SELECT c.id, c.name, c.description, c.sort_order,
                       COUNT(t.id) as topics_count,
                       MAX(t.updated_at) as last_activity
                FROM forum_categories c
                LEFT JOIN forum_topics t ON c.id = t.category_id
                GROUP BY c.id, c.name, c.description, c.sort_order
                ORDER BY c.sort_order
            """)
            categories = []
            for row in cur.fetchall():
                categories.append({
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'sort_order': row[3],
                    'topics_count': row[4],
                    'last_activity': row[5].isoformat() if row[5] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'categories': categories})
            }
        
        # GET /topics?category_id=X - получить темы категории
        if method == 'GET' and path == '/topics':
            category_id = event.get('queryStringParameters', {}).get('category_id')
            if not category_id:
                return {'statusCode': 400, 'body': json.dumps({'error': 'category_id required'})}
            
            cur.execute("""
                SELECT t.id, t.title, t.author_name, t.views, t.is_pinned, t.is_locked,
                       t.created_at, t.updated_at,
                       COUNT(p.id) as posts_count
                FROM forum_topics t
                LEFT JOIN forum_posts p ON t.id = p.topic_id
                WHERE t.category_id = %s
                GROUP BY t.id
                ORDER BY t.is_pinned DESC, t.updated_at DESC
            """, (category_id,))
            
            topics = []
            for row in cur.fetchall():
                topics.append({
                    'id': row[0],
                    'title': row[1],
                    'author_name': row[2],
                    'views': row[3],
                    'is_pinned': row[4],
                    'is_locked': row[5],
                    'created_at': row[6].isoformat(),
                    'updated_at': row[7].isoformat(),
                    'posts_count': row[8]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'topics': topics})
            }
        
        # GET /topic?id=X - получить тему с постами
        if method == 'GET' and path == '/topic':
            topic_id = event.get('queryStringParameters', {}).get('id')
            if not topic_id:
                return {'statusCode': 400, 'body': json.dumps({'error': 'id required'})}
            
            # Увеличиваем счетчик просмотров
            cur.execute("UPDATE forum_topics SET views = views + 1 WHERE id = %s", (topic_id,))
            
            # Получаем тему
            cur.execute("""
                SELECT id, title, author_name, content, views, is_pinned, is_locked, created_at
                FROM forum_topics
                WHERE id = %s
            """, (topic_id,))
            topic_row = cur.fetchone()
            
            if not topic_row:
                return {'statusCode': 404, 'body': json.dumps({'error': 'Topic not found'})}
            
            topic = {
                'id': topic_row[0],
                'title': topic_row[1],
                'author_name': topic_row[2],
                'content': topic_row[3],
                'views': topic_row[4],
                'is_pinned': topic_row[5],
                'is_locked': topic_row[6],
                'created_at': topic_row[7].isoformat()
            }
            
            # Получаем посты
            cur.execute("""
                SELECT id, author_name, content, created_at
                FROM forum_posts
                WHERE topic_id = %s
                ORDER BY created_at ASC
            """, (topic_id,))
            
            posts = []
            for row in cur.fetchall():
                posts.append({
                    'id': row[0],
                    'author_name': row[1],
                    'content': row[2],
                    'created_at': row[3].isoformat()
                })
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'topic': topic, 'posts': posts})
            }
        
        # POST /topic - создать новую тему
        if method == 'POST' and path == '/topic':
            data = json.loads(event.get('body', '{}'))
            category_id = data.get('category_id')
            title = data.get('title')
            content = data.get('content')
            author_name = data.get('author_name', 'Гость')
            
            if not all([category_id, title, content]):
                return {'statusCode': 400, 'body': json.dumps({'error': 'Missing required fields'})}
            
            cur.execute("""
                INSERT INTO forum_topics (category_id, title, author_name, content)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (category_id, title, author_name, content))
            
            topic_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': topic_id})
            }
        
        # POST /post - добавить пост в тему
        if method == 'POST' and path == '/post':
            data = json.loads(event.get('body', '{}'))
            topic_id = data.get('topic_id')
            content = data.get('content')
            author_name = data.get('author_name', 'Гость')
            
            if not all([topic_id, content]):
                return {'statusCode': 400, 'body': json.dumps({'error': 'Missing required fields'})}
            
            # Проверяем, не заблокирована ли тема
            cur.execute("SELECT is_locked FROM forum_topics WHERE id = %s", (topic_id,))
            result = cur.fetchone()
            if not result:
                return {'statusCode': 404, 'body': json.dumps({'error': 'Topic not found'})}
            if result[0]:
                return {'statusCode': 403, 'body': json.dumps({'error': 'Topic is locked'})}
            
            cur.execute("""
                INSERT INTO forum_posts (topic_id, author_name, content)
                VALUES (%s, %s, %s)
                RETURNING id
            """, (topic_id, author_name, content))
            
            post_id = cur.fetchone()[0]
            
            # Обновляем время последнего обновления темы
            cur.execute("UPDATE forum_topics SET updated_at = CURRENT_TIMESTAMP WHERE id = %s", (topic_id,))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': post_id})
            }
        
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'})
        }
        
    finally:
        cur.close()
        conn.close()
