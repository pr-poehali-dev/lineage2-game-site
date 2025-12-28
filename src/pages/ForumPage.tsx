import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const FORUM_API = 'https://functions.poehali.dev/7e9448fb-9ed7-4954-81b1-0093e4f6dbd5';

interface Category {
  id: number;
  name: string;
  description: string;
  topics_count: number;
  last_activity: string | null;
}

interface Topic {
  id: number;
  title: string;
  author_name: string;
  views: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  posts_count: number;
}

export default function ForumPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    content: '',
    author_name: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch(`${FORUM_API}/?action=categories`);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (categoryId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${FORUM_API}/?action=topics&category_id=${categoryId}`);
      const data = await res.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    loadTopics(category.id);
    setShowNewTopic(false);
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !newTopicForm.title || !newTopicForm.content) return;

    try {
      const res = await fetch(`${FORUM_API}/?action=create_topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: selectedCategory.id,
          title: newTopicForm.title,
          content: newTopicForm.content,
          author_name: newTopicForm.author_name || 'Гость'
        })
      });

      if (res.ok) {
        setNewTopicForm({ title: '', content: '', author_name: '' });
        setShowNewTopic(false);
        loadTopics(selectedCategory.id);
      }
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-purple-300">Загрузка форума...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-purple-400">
            Главная
          </button>
          <Icon name="ChevronRight" size={16} />
          {!selectedCategory ? (
            <span className="text-white">Форум</span>
          ) : (
            <>
              <button onClick={() => setSelectedCategory(null)} className="hover:text-purple-400">
                Форум
              </button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-white">{selectedCategory.name}</span>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">
          {selectedCategory ? selectedCategory.name : 'Форум сообщества'}
        </h1>

        {!selectedCategory ? (
          // Список категорий
          <div className="space-y-4">
            {categories.map(category => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="MessageSquare" size={24} className="text-purple-400" />
                      <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                    </div>
                    <p className="text-slate-400 ml-9">{category.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-purple-400">{category.topics_count}</div>
                    <div className="text-sm text-slate-500">тем</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Список тем категории
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400">{selectedCategory.description}</p>
              <Button
                onClick={() => setShowNewTopic(!showNewTopic)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Создать тему
              </Button>
            </div>

            {showNewTopic && (
              <form onSubmit={handleCreateTopic} className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Новая тема</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ваше имя (необязательно)"
                      value={newTopicForm.author_name}
                      onChange={e => setNewTopicForm({ ...newTopicForm, author_name: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Название темы"
                      value={newTopicForm.title}
                      onChange={e => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Содержание темы"
                      value={newTopicForm.content}
                      onChange={e => setNewTopicForm({ ...newTopicForm, content: e.target.value })}
                      required
                      rows={6}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded px-4 py-2 text-white resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      Создать
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowNewTopic(false)}
                      className="bg-slate-700 hover:bg-slate-600"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {loading ? (
              <div className="text-center text-purple-300 py-8">Загрузка тем...</div>
            ) : topics.length === 0 ? (
              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-12 text-center">
                <Icon name="MessageSquare" size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Пока нет тем в этой категории</p>
                <p className="text-sm text-slate-500 mt-2">Будьте первым, кто создаст тему!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => navigate(`/forum/topic/${topic.id}`)}
                    className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {topic.is_pinned && (
                            <Icon name="Pin" size={16} className="text-purple-400" />
                          )}
                          {topic.is_locked && (
                            <Icon name="Lock" size={16} className="text-slate-500" />
                          )}
                          <h4 className="text-lg font-semibold text-white">{topic.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={14} />
                            {topic.author_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {formatDate(topic.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Eye" size={14} />
                            {topic.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="MessageCircle" size={14} />
                            {topic.posts_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
