import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { ForumTopic, ForumPost, LoggedPlayer } from '@/components/types';

interface ForumSectionProps {
  currentPlayer: LoggedPlayer | null;
  onLoginClick: () => void;
}

const ForumSection = ({ currentPlayer, onLoginClick }: ForumSectionProps) => {
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);

  const forumTopics: ForumTopic[] = [
    { id: '1', title: 'Гайд по прокачке 1-85 уровень', author: 'GameMaster', category: 'Гайды', replies: 47, views: 1523, lastReply: '10 минут назад', isPinned: true },
    { id: '2', title: 'Обсуждение обновления 2.0', author: 'DarkLord', category: 'Обновления', replies: 89, views: 2341, lastReply: '15 минут назад', isPinned: true },
    { id: '3', title: 'Поиск клана для осадных войн', author: 'WarriorKing', category: 'Кланы', replies: 23, views: 456, lastReply: '1 час назад' },
    { id: '4', title: 'Баг с респауном Антараса', author: 'BugHunter', category: 'Баги', replies: 12, views: 234, lastReply: '2 часа назад', isLocked: true },
    { id: '5', title: 'Лучший билд для мага?', author: 'MysticSage', category: 'Обсуждения', replies: 56, views: 987, lastReply: '3 часа назад' },
    { id: '6', title: 'Продаю +16 меч Дракона', author: 'Trader123', category: 'Торговля', replies: 8, views: 145, lastReply: '4 часа назад' },
    { id: '7', title: 'Набор в топ клан сервера', author: 'ClanLeader', category: 'Кланы', replies: 34, views: 678, lastReply: '5 часов назад' },
    { id: '8', title: 'Как победить Баюма соло?', author: 'SoloPlayer', category: 'Гайды', replies: 19, views: 432, lastReply: '6 часов назад' },
  ];

  const topicPosts: ForumPost[] = [
    {
      id: '1',
      author: 'GameMaster',
      content: 'Привет всем! Сегодня я расскажу вам о самом эффективном способе прокачки с 1 по 85 уровень.\n\n**Уровни 1-20:** Начните с квестов в Глудио. Это даст вам базовую экипировку и опыт.\n\n**Уровни 20-40:** Переходите в Диоон и качайтесь в Крумской Башне. Отличное место для фарма.\n\n**Уровни 40-60:** Катакомбы Еретиков - ваш дом на следующие 20 уровней.\n\n**Уровни 60-85:** Рейдовые боссы и Олимпиада дадут вам максимум опыта.',
      date: '25.12.2024 10:00',
      likes: 156
    },
    {
      id: '2',
      author: 'DarkLord',
      content: 'Отличный гайд! Добавлю от себя: не забывайте про дейли квесты, они дают бонус к опыту.',
      date: '25.12.2024 11:30',
      likes: 45
    },
    {
      id: '3',
      author: 'NewPlayer2024',
      content: 'Спасибо огромное! Очень помогло, уже 30 уровень 🎉',
      date: '25.12.2024 14:20',
      likes: 23
    },
    {
      id: '4',
      author: 'MysticSage',
      content: 'А что насчет магов? Те же локации подходят?',
      date: '27.12.2024 09:15',
      likes: 12
    }
  ];

  const handleCreateTopic = () => {
    if (!currentPlayer) {
      onLoginClick();
      return;
    }
    if (newTopicTitle && newTopicContent) {
      setNewTopicTitle('');
      setNewTopicContent('');
      setShowNewTopic(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Гайды': 'bg-blue-500',
      'Обновления': 'bg-green-500',
      'Кланы': 'bg-purple-500',
      'Баги': 'bg-red-500',
      'Обсуждения': 'bg-yellow-500',
      'Торговля': 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (selectedTopic) {
    return (
      <section id="forum" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => setSelectedTopic(null)}
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к форуму
          </Button>

          <Card className="card-glow mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(selectedTopic.category)}>
                      {selectedTopic.category}
                    </Badge>
                    {selectedTopic.isPinned && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        <Icon name="Pin" size={12} className="mr-1" />
                        Закреплено
                      </Badge>
                    )}
                    {selectedTopic.isLocked && (
                      <Badge variant="outline" className="border-red-500 text-red-500">
                        <Icon name="Lock" size={12} className="mr-1" />
                        Закрыто
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">{selectedTopic.title}</CardTitle>
                  <CardDescription>
                    Автор: {selectedTopic.author} • {selectedTopic.views} просмотров • {selectedTopic.replies} ответов
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4 mb-6">
            {topicPosts.map((post) => (
              <Card key={post.id} className="card-glow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name="User" size={32} className="text-primary" />
                      </div>
                      <p className="font-semibold text-center">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                    <div className="flex-1">
                      <div className="prose prose-invert max-w-none mb-4">
                        <p className="whitespace-pre-line text-muted-foreground">{post.content}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button size="sm" variant="ghost">
                          <Icon name="ThumbsUp" size={16} className="mr-1" />
                          {post.likes}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Icon name="MessageCircle" size={16} className="mr-1" />
                          Ответить
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!selectedTopic.isLocked && (
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Оставить ответ</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPlayer ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Напишите ваш ответ..."
                      className="min-h-[120px]"
                    />
                    <Button className="bg-primary">
                      <Icon name="Send" size={16} className="mr-2" />
                      Отправить
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Войдите, чтобы оставить ответ</p>
                    <Button onClick={onLoginClick}>
                      <Icon name="LogIn" size={16} className="mr-2" />
                      Войти
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="forum" className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <h3 className="text-4xl font-bold mb-4 text-center text-glow">ФОРУМ</h3>
        <p className="text-center text-muted-foreground mb-8">
          Общайтесь с игроками, делитесь опытом и находите союзников
        </p>

        <div className="flex justify-between items-center mb-6">
          <Tabs defaultValue="all" className="flex-1">
            <TabsList>
              <TabsTrigger value="all">Все темы</TabsTrigger>
              <TabsTrigger value="guides">Гайды</TabsTrigger>
              <TabsTrigger value="clans">Кланы</TabsTrigger>
              <TabsTrigger value="trade">Торговля</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={() => {
              if (currentPlayer) {
                setShowNewTopic(!showNewTopic);
              } else {
                onLoginClick();
              }
            }}
            className="bg-primary"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Создать тему
          </Button>
        </div>

        {showNewTopic && currentPlayer && (
          <Card className="card-glow mb-6">
            <CardHeader>
              <CardTitle>Новая тема</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Название темы"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <Textarea
                placeholder="Содержание..."
                className="min-h-[150px]"
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateTopic} className="bg-primary">
                  <Icon name="Send" size={16} className="mr-2" />
                  Создать
                </Button>
                <Button variant="outline" onClick={() => setShowNewTopic(false)}>
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {forumTopics.map((topic) => (
            <Card
              key={topic.id}
              className="card-glow hover-glow cursor-pointer transition-all"
              onClick={() => setSelectedTopic(topic)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="MessageSquare" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className={getCategoryColor(topic.category)}>
                        {topic.category}
                      </Badge>
                      {topic.isPinned && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          <Icon name="Pin" size={12} className="mr-1" />
                          Закреплено
                        </Badge>
                      )}
                      {topic.isLocked && (
                        <Badge variant="outline" className="border-red-500 text-red-500">
                          <Icon name="Lock" size={12} className="mr-1" />
                          Закрыто
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-bold text-lg mb-1 truncate">{topic.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Автор: {topic.author}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="MessageCircle" size={14} />
                        {topic.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={14} />
                        {topic.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {topic.lastReply}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForumSection;
