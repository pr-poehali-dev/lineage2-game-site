import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const FORUM_API = 'https://functions.poehali.dev/7e9448fb-9ed7-4954-81b1-0093e4f6dbd5';

interface Topic {
  id: number;
  title: string;
  author_name: string;
  content: string;
  views: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
}

interface Post {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyForm, setReplyForm] = useState({
    author_name: '',
    content: ''
  });

  useEffect(() => {
    if (id) loadTopic();
  }, [id]);

  const loadTopic = async () => {
    try {
      const res = await fetch(`${FORUM_API}/?action=topic&id=${id}`);
      const data = await res.json();
      setTopic(data.topic);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !replyForm.content || !topic) return;

    try {
      const res = await fetch(`${FORUM_API}/?action=create_post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: parseInt(id),
          content: replyForm.content,
          author_name: replyForm.author_name || 'Гость'
        })
      });

      if (res.ok) {
        setReplyForm({ author_name: '', content: '' });
        loadTopic();
      }
    } catch (error) {
      console.error('Failed to create reply:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-purple-300">Загрузка темы...</div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">Тема не найдена</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-purple-400">
            Главная
          </button>
          <Icon name="ChevronRight" size={16} />
          <button onClick={() => navigate('/forum')} className="hover:text-purple-400">
            Форум
          </button>
          <Icon name="ChevronRight" size={16} />
          <span className="text-white truncate max-w-md">{topic.title}</span>
        </div>

        {/* Заголовок темы */}
        <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-3">
            {topic.is_pinned && (
              <Icon name="Pin" size={20} className="text-purple-400" />
            )}
            {topic.is_locked && (
              <Icon name="Lock" size={20} className="text-slate-500" />
            )}
            <h1 className="text-3xl font-bold text-white flex-1">{topic.title}</h1>
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
              {topic.views} просмотров
            </span>
          </div>
        </div>

        {/* Первый пост (содержание темы) */}
        <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6 mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {topic.author_name[0]?.toUpperCase() || 'G'}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white mb-1">{topic.author_name}</div>
              <div className="text-sm text-slate-500 mb-4">{formatDate(topic.created_at)}</div>
              <div className="text-slate-200 whitespace-pre-wrap">{topic.content}</div>
            </div>
          </div>
        </div>

        {/* Ответы */}
        {posts.length > 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Icon name="MessageCircle" size={20} />
              Ответы ({posts.length})
            </h2>
            {posts.map(post => (
              <div key={post.id} className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {post.author_name[0]?.toUpperCase() || 'G'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{post.author_name}</div>
                    <div className="text-sm text-slate-500 mb-4">{formatDate(post.created_at)}</div>
                    <div className="text-slate-200 whitespace-pre-wrap">{post.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Форма ответа */}
        {!topic.is_locked ? (
          <form onSubmit={handleReply} className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="Reply" size={20} />
              Оставить ответ
            </h3>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Ваше имя (необязательно)"
                  value={replyForm.author_name}
                  onChange={e => setReplyForm({ ...replyForm, author_name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded px-4 py-2 text-white"
                />
              </div>
              <div>
                <textarea
                  placeholder="Ваш ответ"
                  value={replyForm.content}
                  onChange={e => setReplyForm({ ...replyForm, content: e.target.value })}
                  required
                  rows={5}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded px-4 py-2 text-white resize-none"
                />
              </div>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Icon name="Send" size={18} className="mr-2" />
                Отправить
              </Button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
            <Icon name="Lock" size={32} className="text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400">Тема закрыта для обсуждения</p>
          </div>
        )}
      </div>
    </div>
  );
}
