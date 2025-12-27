import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления магазином доната и покупками"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return error_response('DATABASE_URL not configured', 500)
    
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        path_params = event.get('pathParams', {})
        query_params = event.get('queryStringParameters', {})
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}
        
        if method == 'GET' and not path_params:
            return get_shop_items(cursor, query_params)
        
        elif method == 'GET' and path_params.get('action') == 'purchases':
            return get_purchase_history(cursor, query_params)
        
        elif method == 'POST' and path_params.get('action') == 'purchase':
            return purchase_item(cursor, conn, body)
        
        elif method == 'POST' and not path_params:
            return create_item(cursor, conn, body)
        
        elif method == 'PUT' and path_params.get('id'):
            return update_item(cursor, conn, path_params.get('id'), body)
        
        elif method == 'DELETE' and path_params.get('id'):
            return delete_item(cursor, conn, path_params.get('id'))
        
        else:
            return error_response('Invalid endpoint', 404)
    
    except psycopg2.Error as e:
        return error_response(f'Database error: {str(e)}', 500)
    except Exception as e:
        return error_response(f'Server error: {str(e)}', 500)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()


def get_shop_items(cursor, query_params):
    """Получить список товаров с фильтрацией"""
    item_type = query_params.get('type')
    
    if item_type and item_type != 'all':
        cursor.execute(
            "SELECT id, name, description, price, icon, type, image_url FROM shop_items WHERE type = %s ORDER BY id",
            (item_type,)
        )
    else:
        cursor.execute(
            "SELECT id, name, description, price, icon, type, image_url FROM shop_items ORDER BY id"
        )
    
    items = cursor.fetchall()
    
    result = [{
        'id': str(item['id']),
        'name': item['name'],
        'description': item['description'],
        'price': item['price'],
        'icon': item['icon'],
        'type': item['type'],
        'imageUrl': item['image_url']
    } for item in items]
    
    return success_response({'items': result})


def purchase_item(cursor, conn, body):
    """Покупка товара игроком"""
    player_id = body.get('player_id')
    item_id = body.get('item_id')
    
    if not player_id or not item_id:
        return error_response('player_id and item_id required', 400)
    
    cursor.execute(
        "SELECT id, name, price FROM shop_items WHERE id = %s",
        (item_id,)
    )
    item = cursor.fetchone()
    
    if not item:
        return error_response('Item not found', 404)
    
    cursor.execute(
        "SELECT coins FROM players WHERE id = %s",
        (player_id,)
    )
    player = cursor.fetchone()
    
    if not player:
        return error_response('Player not found', 404)
    
    if player['coins'] < item['price']:
        return error_response('Insufficient coins', 400)
    
    new_balance = player['coins'] - item['price']
    cursor.execute(
        "UPDATE players SET coins = %s WHERE id = %s",
        (new_balance, player_id)
    )
    
    cursor.execute(
        "INSERT INTO shop_purchases (player_id, item_id, item_name, item_price) VALUES (%s, %s, %s, %s) RETURNING id",
        (player_id, item_id, item['name'], item['price'])
    )
    purchase_id = cursor.fetchone()['id']
    
    conn.commit()
    
    return success_response({
        'purchase_id': purchase_id,
        'new_balance': new_balance,
        'item_name': item['name']
    })


def get_purchase_history(cursor, query_params):
    """История покупок игрока"""
    player_id = query_params.get('player_id')
    
    if not player_id:
        return error_response('player_id required', 400)
    
    cursor.execute("""
        SELECT 
            p.id,
            p.item_name,
            p.item_price,
            p.purchase_date,
            i.icon,
            i.type
        FROM shop_purchases p
        LEFT JOIN shop_items i ON p.item_id = i.id
        WHERE p.player_id = %s
        ORDER BY p.purchase_date DESC
        LIMIT 50
    """, (player_id,))
    
    purchases = cursor.fetchall()
    
    result = [{
        'id': p['id'],
        'item_name': p['item_name'],
        'item_price': p['item_price'],
        'purchase_date': p['purchase_date'].isoformat() if p['purchase_date'] else None,
        'icon': p['icon'],
        'type': p['type']
    } for p in purchases]
    
    return success_response({'purchases': result})


def create_item(cursor, conn, body):
    """Создать новый товар (админ)"""
    name = body.get('name')
    description = body.get('description')
    price = body.get('price')
    icon = body.get('icon')
    item_type = body.get('type')
    image_url = body.get('imageUrl')
    
    if not all([name, description, price, icon, item_type]):
        return error_response('Missing required fields', 400)
    
    if item_type not in ['weapon', 'armor', 'potion', 'boost']:
        return error_response('Invalid item type', 400)
    
    cursor.execute("""
        INSERT INTO shop_items (name, description, price, icon, type, image_url)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (name, description, price, icon, item_type, image_url))
    
    item_id = cursor.fetchone()['id']
    conn.commit()
    
    return success_response({'id': str(item_id), 'message': 'Item created successfully'})


def update_item(cursor, conn, item_id, body):
    """Обновить товар (админ)"""
    name = body.get('name')
    description = body.get('description')
    price = body.get('price')
    icon = body.get('icon')
    item_type = body.get('type')
    image_url = body.get('imageUrl')
    
    if not all([name, description, price, icon, item_type]):
        return error_response('Missing required fields', 400)
    
    cursor.execute("""
        UPDATE shop_items 
        SET name = %s, description = %s, price = %s, icon = %s, type = %s, image_url = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (name, description, price, icon, item_type, image_url, item_id))
    
    if cursor.rowcount == 0:
        return error_response('Item not found', 404)
    
    conn.commit()
    
    return success_response({'message': 'Item updated successfully'})


def delete_item(cursor, conn, item_id):
    """Удалить товар (админ)"""
    cursor.execute("UPDATE shop_items SET updated_at = CURRENT_TIMESTAMP WHERE id = %s", (item_id,))
    
    if cursor.rowcount == 0:
        return error_response('Item not found', 404)
    
    conn.commit()
    
    return success_response({'message': 'Item marked as deleted'})


def success_response(data):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data),
        'isBase64Encoded': False
    }


def error_response(message, status_code=400):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }
