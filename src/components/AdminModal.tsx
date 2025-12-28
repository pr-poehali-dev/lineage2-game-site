import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { NewsItem, RaidBoss } from '@/components/types';
import { useToast } from '@/hooks/use-toast';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem[];
  raidBosses: RaidBoss[];
  onRefresh: () => void;
}

const AdminModal = ({ isOpen, onClose, news, raidBosses, onRefresh }: AdminModalProps) => {
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState('Обновление');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    support_title: '',
    support_email: '',
    support_phone: '',
    support_discord: '',
    support_telegram: '',
    support_vk: ''
  });

  const NEWS_API_URL = 'https://functions.poehali.dev/da7f7577-0e9b-4797-81f7-b1dfdf0a5538';
  const RAIDS_API_URL = 'https://functions.poehali.dev/fa87c62b-aa78-4162-8e21-2fbf82f4da95';

  useEffect(() => {
    if (isOpen) {
      fetch(`${NEWS_API_URL}/settings`)
        .then(res => res.json())
        .then(data => {
          setSettings({
            support_title: data.support_title || '',
            support_email: data.support_email || '',
            support_phone: data.support_phone || '',
            support_discord: data.support_discord || '',
            support_telegram: data.support_telegram || '',
            support_vk: data.support_vk || ''
          });
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const handleCreateNews = async () => {
    if (!newsTitle) {
      toast({
        title: 'Ошибка',
        description: 'Введите заголовок новости',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(NEWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsTitle,
          content: newsContent,
          category: newsCategory
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Новость создана'
        });
        setNewsTitle('');
        setNewsContent('');
        setNewsCategory('Обновление');
        onRefresh();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать новость',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с соединением',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBoss = async (bossId: string, isAlive: boolean) => {
    setIsSubmitting(true);
    try {
      const nextRespawn = isAlive ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      const response = await fetch(RAIDS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boss_id: bossId,
          is_alive: isAlive,
          next_respawn: nextRespawn
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: `Статус босса обновлен`
        });
        onRefresh();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось обновить босса',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с соединением',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Settings" size={24} className="text-primary" />
            Админ-панель
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="news">
              <Icon name="Newspaper" size={16} className="mr-2" />
              Новости
            </TabsTrigger>
            <TabsTrigger value="raids">
              <Icon name="Skull" size={16} className="mr-2" />
              Рейд-боссы
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Создать новость</CardTitle>
                <CardDescription>Добавить новую новость на сайт</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="news-title">Заголовок</Label>
                  <Input
                    id="news-title"
                    placeholder="Введите заголовок..."
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="news-category">Категория</Label>
                  <Select value={newsCategory} onValueChange={setNewsCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Обновление">Обновление</SelectItem>
                      <SelectItem value="События">События</SelectItem>
                      <SelectItem value="Патч">Патч</SelectItem>
                      <SelectItem value="Контент">Контент</SelectItem>
                      <SelectItem value="Общее">Общее</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="news-content">Содержание (необязательно)</Label>
                  <Textarea
                    id="news-content"
                    placeholder="Введите текст новости..."
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleCreateNews} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать новость
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Список новостей</CardTitle>
                <CardDescription>Последние {news.length} новостей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-primary/5 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="font-medium">{item.title}</p>
                      </div>
                    </div>
                  ))}
                  {news.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Нет новостей</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raids" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление рейд-боссами</CardTitle>
                <CardDescription>Обновить статус босса (жив/мертв)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {raidBosses.map((boss) => (
                    <div
                      key={boss.id}
                      className="flex items-center justify-between p-4 bg-primary/5 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${boss.isAlive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{boss.name}</p>
                            <Badge variant="outline">Ур. {boss.level}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Icon name="MapPin" size={12} />
                              {boss.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={12} />
                              {boss.respawnTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={boss.isAlive ? 'outline' : 'default'}
                          onClick={() => handleUpdateBoss(boss.id, true)}
                          disabled={isSubmitting || boss.isAlive}
                        >
                          <Icon name="Heart" size={14} className="mr-1" />
                          Жив
                        </Button>
                        <Button
                          size="sm"
                          variant={!boss.isAlive ? 'outline' : 'destructive'}
                          onClick={() => handleUpdateBoss(boss.id, false)}
                          disabled={isSubmitting || !boss.isAlive}
                        >
                          <Icon name="Skull" size={14} className="mr-1" />
                          Убит
                        </Button>
                      </div>
                    </div>
                  ))}
                  {raidBosses.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Нет рейд-боссов</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Контакты поддержки</CardTitle>
                <CardDescription>Редактировать контактную информацию в футере</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="support-title">Заголовок</Label>
                  <Input
                    id="support-title"
                    placeholder="Нужна помощь?..."
                    value={settings.support_title}
                    onChange={(e) => setSettings({...settings, support_title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-email">Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="support@example.com"
                    value={settings.support_email}
                    onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-phone">Телефон</Label>
                  <Input
                    id="support-phone"
                    placeholder="+7 (999) 123-45-67"
                    value={settings.support_phone}
                    onChange={(e) => setSettings({...settings, support_phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-discord">Discord</Label>
                  <Input
                    id="support-discord"
                    placeholder="https://discord.gg/..."
                    value={settings.support_discord}
                    onChange={(e) => setSettings({...settings, support_discord: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-telegram">Telegram</Label>
                  <Input
                    id="support-telegram"
                    placeholder="https://t.me/..."
                    value={settings.support_telegram}
                    onChange={(e) => setSettings({...settings, support_telegram: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-vk">ВКонтакте</Label>
                  <Input
                    id="support-vk"
                    placeholder="https://vk.com/..."
                    value={settings.support_vk}
                    onChange={(e) => setSettings({...settings, support_vk: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      const response = await fetch(`${NEWS_API_URL}/settings`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settings)
                      });

                      if (response.ok) {
                        toast({
                          title: 'Успешно!',
                          description: 'Настройки обновлены'
                        });
                        onRefresh();
                      } else {
                        const data = await response.json();
                        toast({
                          title: 'Ошибка',
                          description: data.error || 'Не удалось сохранить',
                          variant: 'destructive'
                        });
                      }
                    } catch (error) {
                      toast({
                        title: 'Ошибка',
                        description: 'Проблема с соединением',
                        variant: 'destructive'
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;