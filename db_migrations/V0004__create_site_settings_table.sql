-- Создание таблицы для настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса для быстрого поиска по ключу
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Вставка начальных значений для контактов поддержки
INSERT INTO site_settings (key, value) VALUES
    ('support_title', 'Нужна помощь? Свяжись с нашей командой поддержки'),
    ('support_email', 'support@lineage2server.ru'),
    ('support_phone', '+7 (999) 123-45-67'),
    ('support_discord', 'https://discord.gg/lineage2'),
    ('support_telegram', 'https://t.me/lineage2support'),
    ('support_vk', 'https://vk.com/lineage2server')
ON CONFLICT (key) DO NOTHING;