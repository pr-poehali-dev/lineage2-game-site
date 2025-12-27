-- Таблица новостей
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица рейд-боссов
CREATE TABLE IF NOT EXISTS raid_bosses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL,
  respawn_time VARCHAR(50) NOT NULL,
  is_alive BOOLEAN DEFAULT true,
  location VARCHAR(100) NOT NULL,
  next_respawn TIMESTAMP
);

-- Таблица игроков на карте (для отображения онлайн)
CREATE TABLE IF NOT EXISTS players_map (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  location VARCHAR(100) NOT NULL,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id)
);

-- Вставка тестовых данных
INSERT INTO news (title, category, created_at) VALUES
  ('Открытие нового сервера!', 'Обновление', NOW() - INTERVAL '2 days'),
  ('Турнир Олимпиады начинается!', 'События', NOW() - INTERVAL '1 day'),
  ('Обновление баланса классов', 'Патч', NOW() - INTERVAL '5 hours'),
  ('Новые рейд-боссы в игре', 'Контент', NOW() - INTERVAL '3 days');

INSERT INTO raid_bosses (name, level, respawn_time, is_alive, location, next_respawn) VALUES
  ('Антарас', 85, '12-24 часа', false, 'Логово Антараса', NOW() + INTERVAL '8 hours'),
  ('Валакас', 85, '12-24 часа', true, 'Логово Валакаса', NULL),
  ('Баюм', 75, '6-12 часов', false, 'Башня Крумы', NOW() + INTERVAL '3 hours'),
  ('Королева Муравьев', 40, '2-4 часа', true, 'Гнездо Муравьев', NULL),
  ('Орфен', 50, '4-6 часов', false, 'Лес Орфена', NOW() + INTERVAL '2 hours'),
  ('Ядро', 55, '4-6 часов', true, 'Кратер Крумы', NULL);

-- Создаем индексы
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_raid_bosses_next_respawn ON raid_bosses(next_respawn);
CREATE INDEX IF NOT EXISTS idx_players_map_location ON players_map(location);