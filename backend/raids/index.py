import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для получения информации о рейд-боссах'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method == 'GET':
        return get_raid_bosses()
    
    if method == 'PUT':
        return update_raid_boss(event)
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }

def get_raid_bosses():
    '''Получает список рейд-боссов'''
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, name, level, respawn_time, is_alive, location, 
                   next_respawn::text
            FROM raid_bosses 
            ORDER BY level DESC
        """)
        
        bosses = []
        for row in cursor.fetchall():
            boss = {
                'id': str(row[0]),
                'name': row[1],
                'level': row[2],
                'respawnTime': row[3],
                'isAlive': row[4],
                'location': row[5]
            }
            if row[6]:
                boss['nextRespawn'] = row[6]
            bosses.append(boss)
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'bosses': bosses})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def update_raid_boss(event: dict):
    '''Обновляет статус рейд-босса'''
    try:
        body = json.loads(event.get('body', '{}'))
        boss_id = body.get('boss_id')
        is_alive = body.get('is_alive')
        next_respawn = body.get('next_respawn')
        
        if not boss_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'boss_id is required'})
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        if next_respawn:
            cursor.execute("""
                UPDATE raid_bosses 
                SET is_alive = %s, next_respawn = %s 
                WHERE id = %s
            """, (is_alive, next_respawn, boss_id))
        else:
            cursor.execute("""
                UPDATE raid_bosses 
                SET is_alive = %s, next_respawn = NULL 
                WHERE id = %s
            """, (is_alive, boss_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Boss updated'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
