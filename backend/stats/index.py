import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для получения статистики сервера и рейтинга игроков'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method == 'GET':
        return get_statistics()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }

def get_statistics():
    '''Получает статистику сервера и топ игроков'''
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM players")
        total_players = cursor.fetchone()[0]
        
        cursor.execute("""
            SELECT COUNT(*) FROM players 
            WHERE last_login > NOW() - INTERVAL '15 minutes'
        """)
        online_players = cursor.fetchone()[0]
        
        cursor.execute("""
            SELECT character_class, COUNT(*) as count 
            FROM players 
            GROUP BY character_class 
            ORDER BY count DESC
        """)
        class_stats = [{'class': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT id, username, character_class, level, experience 
            FROM players 
            ORDER BY experience DESC 
            LIMIT 10
        """)
        top_players = []
        for row in cursor.fetchall():
            top_players.append({
                'id': str(row[0]),
                'name': row[1],
                'class': row[2],
                'level': row[3],
                'score': row[4]
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'statistics': {
                    'total_players': total_players,
                    'online_players': online_players,
                    'class_stats': class_stats
                },
                'top_players': top_players
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
