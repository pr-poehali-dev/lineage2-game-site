-- Создание таблицы товаров магазина
CREATE TABLE shop_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price > 0),
    icon VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('weapon', 'armor', 'potion', 'boost')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы истории покупок
CREATE TABLE shop_purchases (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL REFERENCES shop_items(id),
    item_name VARCHAR(255) NOT NULL,
    item_price INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Создание индексов для оптимизации
CREATE INDEX idx_shop_items_type ON shop_items(type);
CREATE INDEX idx_shop_purchases_player ON shop_purchases(player_id);
CREATE INDEX idx_shop_purchases_date ON shop_purchases(purchase_date DESC);

-- Вставка начальных товаров
INSERT INTO shop_items (name, description, price, icon, type) VALUES
('Легендарный меч', 'Увеличивает урон на 50%. Сияет в темноте.', 500, 'Sword', 'weapon'),
('Доспехи дракона', 'Защита +100. Иммунитет к огню.', 750, 'Shield', 'armor'),
('Эликсир опыта', '+200% опыта на 1 час.', 200, 'Droplet', 'potion'),
('Благословение богов', 'Все характеристики +20% на 24 часа.', 350, 'Sparkles', 'boost'),
('Лук снайпера', 'Критический урон +75%. Дальность атаки +50%.', 600, 'Target', 'weapon'),
('Посох архимага', 'Магический урон +100%. Мана +500.', 800, 'Wand2', 'weapon');
