import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для получения новостей сервера'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method == 'GET':
        return get_news()
    
    if method == 'POST':
        return create_news(event)
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }

def get_news():
    '''Получает список новостей'''
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, title, category, 
                   TO_CHAR(created_at, 'DD.MM.YYYY') as date
            FROM news 
            ORDER BY created_at DESC 
            LIMIT 20
        """)
        
        news = []
        for row in cursor.fetchall():
            news.append({
                'id': str(row[0]),
                'title': row[1],
                'category': row[2],
                'date': row[3]
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'news': news})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def create_news(event: dict):
    '''Создает новую новость'''
    try:
        body = json.loads(event.get('body', '{}'))
        title = body.get('title')
        content = body.get('content', '')
        category = body.get('category', 'Общее')
        
        if not title:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Title is required'})
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO news (title, content, category) 
            VALUES (%s, %s, %s) 
            RETURNING id
        """, (title, content, category))
        
        news_id = cursor.fetchone()[0]
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'id': news_id, 'message': 'News created'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
