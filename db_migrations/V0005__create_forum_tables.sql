-- Создание таблиц для форума
CREATE TABLE IF NOT EXISTS forum_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_topics (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES forum_categories(id),
  title VARCHAR(500) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_id INTEGER,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER REFERENCES forum_topics(id),
  author_name VARCHAR(255) NOT NULL,
  author_id INTEGER,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление начальных категорий
INSERT INTO forum_categories (name, description, sort_order) VALUES
  ('Новости сервера', 'Официальные новости и обновления', 1),
  ('Общее обсуждение', 'Общение игроков о сервере и игре', 2),
  ('Техническая поддержка', 'Помощь по техническим вопросам', 3),
  ('Торговля', 'Купля-продажа игровых предметов', 4),
  ('Гильдии и кланы', 'Поиск союзников и набор в кланы', 5);