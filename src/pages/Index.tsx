import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface GameClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'warrior' | 'mage' | 'archer';
}

interface Location {
  id: string;
  name: string;
  level: string;
  type: 'town' | 'dungeon' | 'field';
  x: number;
  y: number;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
}

interface Player {
  id: string;
  name: string;
  level: number;
  class: string;
  score: number;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<GameClass | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const gameClasses: GameClass[] = [
    {
      id: 'warrior',
      name: 'Воин',
      description: 'Мастер ближнего боя с высокой защитой. Использует мечи и тяжелую броню.',
      icon: 'Sword',
      type: 'warrior'
    },
    {
      id: 'mage',
      name: 'Маг',
      description: 'Повелитель магии стихий. Наносит огромный урон заклинаниями.',
      icon: 'Wand2',
      type: 'mage'
    },
    {
      id: 'archer',
      name: 'Лучник',
      description: 'Мастер дальнего боя. Быстрый и смертельно точный.',
      icon: 'Target',
      type: 'archer'
    },
    {
      id: 'knight',
      name: 'Рыцарь',
      description: 'Танк группы с непробиваемой защитой и способностями контроля.',
      icon: 'Shield',
      type: 'warrior'
    },
    {
      id: 'wizard',
      name: 'Волшебник',
      description: 'Специалист по массовым заклинаниям и контролю противника.',
      icon: 'Sparkles',
      type: 'mage'
    },
    {
      id: 'ranger',
      name: 'Следопыт',
      description: 'Охотник с луком и ловушками. Эксперт по выживанию.',
      icon: 'Crosshair',
      type: 'archer'
    }
  ];

  const locations: Location[] = [
    { id: '1', name: 'Глудио', level: '1-20', type: 'town', x: 20, y: 30 },
    { id: '2', name: 'Диоон', level: '20-30', type: 'town', x: 50, y: 25 },
    { id: '3', name: 'Гиран', level: '30-40', type: 'town', x: 75, y: 35 },
    { id: '4', name: 'Крумская Башня', level: '15-25', type: 'dungeon', x: 35, y: 50 },
    { id: '5', name: 'Катакомбы Еретиков', level: '25-35', type: 'dungeon', x: 60, y: 60 },
    { id: '6', name: 'Лес Зеркал', level: '40-50', type: 'field', x: 80, y: 70 },
    { id: '7', name: 'Аден', level: '40+', type: 'town', x: 50, y: 75 },
    { id: '8', name: 'Логово Антараса', level: '70+', type: 'dungeon', x: 25, y: 80 }
  ];

  const news: NewsItem[] = [
    { id: '1', title: 'Новое обновление 2.0: Эра Драконов', date: '25.12.2024', category: 'Обновление' },
    { id: '2', title: 'Турнир Олимпиады начинается!', date: '23.12.2024', category: 'События' },
    { id: '3', title: 'Баланс классов: изменения в патче', date: '20.12.2024', category: 'Патч' },
    { id: '4', title: 'Новые данжи и рейдовые боссы', date: '18.12.2024', category: 'Контент' }
  ];

  const topPlayers: Player[] = [
    { id: '1', name: 'DarkLord', level: 85, class: 'Воин', score: 15420 },
    { id: '2', name: 'MysticSage', level: 84, class: 'Маг', score: 14850 },
    { id: '3', name: 'ShadowArrow', level: 83, class: 'Лучник', score: 14200 },
    { id: '4', name: 'HolyKnight', level: 82, class: 'Рыцарь', score: 13900 },
    { id: '5', name: 'StormMage', level: 81, class: 'Волшебник', score: 13500 }
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClassSelect = (gameClass: GameClass) => {
    setSelectedClass(gameClass);
    setRegistrationStep(2);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Ошибка', description: 'Пароли не совпадают', variant: 'destructive' });
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: 'Ошибка', description: 'Пароль должен быть не менее 6 символов', variant: 'destructive' });
      return;
    }
    setIsRegistered(true);
    setTimeout(() => {
      setShowRegister(false);
      setIsRegistered(false);
      setRegistrationStep(1);
      setSelectedClass(null);
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      toast({ title: 'Успешно!', description: `Добро пожаловать, ${formData.username}! Персонаж создан.` });
    }, 2000);
  };

  const resetRegistration = () => {
    setShowRegister(false);
    setRegistrationStep(1);
    setSelectedClass(null);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setIsRegistered(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <nav className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Swords" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-glow">LINEAGE II</h1>
          </div>
          <div className="hidden md:flex gap-6">
            {['home', 'about', 'classes', 'map', 'news', 'rankings', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === section ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {section === 'home' && 'Главная'}
                {section === 'about' && 'О игре'}
                {section === 'classes' && 'Классы'}
                {section === 'map' && 'Карта мира'}
                {section === 'news' && 'Новости'}
                {section === 'rankings' && 'Рейтинги'}
                {section === 'contact' && 'Контакты'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setShowRegister(true)}>
              <Icon name="UserPlus" size={16} className="mr-2" />
              Регистрация
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center animate-fade-in">
          <div className="inline-block mb-6">
            <Badge variant="outline" className="text-primary border-primary px-4 py-2">
              <Icon name="Zap" size={16} className="mr-2" />
              Эра Драконов 2.0
            </Badge>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-6 text-glow">
            ВОЙДИ В ЛЕГЕНДУ
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Эпическая MMORPG с тысячами игроков, масштабными сражениями и бесконечными приключениями
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" onClick={() => setShowRegister(true)}>
              <Icon name="Play" size={20} className="mr-2" />
              Начать играть
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Icon name="Download" size={20} className="mr-2" />
              Скачать клиент
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold mb-8 text-center text-glow">О ИГРЕ</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="card-glow hover-glow">
              <CardHeader>
                <Icon name="Users" size={40} className="text-primary mb-4" />
                <CardTitle>Массовые PvP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Осадные войны с участием сотен игроков. Захватывай замки и контролируй территории.
                </p>
              </CardContent>
            </Card>
            <Card className="card-glow hover-glow">
              <CardHeader>
                <Icon name="Swords" size={40} className="text-primary mb-4" />
                <CardTitle>Эпические рейды</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Сражайся с легендарными боссами: Баюм, Антарас, Валакас и другие драконы ждут тебя.
                </p>
              </CardContent>
            </Card>
            <Card className="card-glow hover-glow">
              <CardHeader>
                <Icon name="Trophy" size={40} className="text-primary mb-4" />
                <CardTitle>Система кланов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Создай свой клан, объединяйся в альянсы и доминируй на сервере вместе с друзьями.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="classes" className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold mb-4 text-center text-glow">ВЫБЕРИ СВОЙ КЛАСС</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Каждый класс обладает уникальными способностями и стилем игры
          </p>
          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">Все классы</TabsTrigger>
              <TabsTrigger value="warrior">Воины</TabsTrigger>
              <TabsTrigger value="mage">Маги</TabsTrigger>
              <TabsTrigger value="archer">Лучники</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="grid md:grid-cols-3 gap-6">
              {gameClasses.map((cls) => (
                <Card key={cls.id} className="card-glow hover-glow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name={cls.icon as any} size={24} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle>{cls.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {cls.type === 'warrior' && 'Воин'}
                          {cls.type === 'mage' && 'Маг'}
                          {cls.type === 'archer' && 'Лучник'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{cls.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="warrior" className="grid md:grid-cols-3 gap-6">
              {gameClasses.filter(cls => cls.type === 'warrior').map((cls) => (
                <Card key={cls.id} className="card-glow hover-glow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name={cls.icon as any} size={24} className="text-primary" />
                      </div>
                      <CardTitle>{cls.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{cls.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="mage" className="grid md:grid-cols-3 gap-6">
              {gameClasses.filter(cls => cls.type === 'mage').map((cls) => (
                <Card key={cls.id} className="card-glow hover-glow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name={cls.icon as any} size={24} className="text-primary" />
                      </div>
                      <CardTitle>{cls.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{cls.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="archer" className="grid md:grid-cols-3 gap-6">
              {gameClasses.filter(cls => cls.type === 'archer').map((cls) => (
                <Card key={cls.id} className="card-glow hover-glow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name={cls.icon as any} size={24} className="text-primary" />
                      </div>
                      <CardTitle>{cls.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{cls.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="map" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold mb-4 text-center text-glow">КАРТА МИРА</h3>
          <p className="text-center text-muted-foreground mb-12">
            Исследуй огромный мир, полный опасностей и сокровищ
          </p>
          <div className="max-w-4xl mx-auto">
            <Card className="card-glow">
              <CardContent className="p-8">
                <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-primary/30">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocation(location)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: `${location.x}%`, top: `${location.y}%` }}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-ping"></div>
                        {location.type === 'town' && (
                          <Icon name="Home" size={20} className="absolute -top-6 -left-2 text-accent" />
                        )}
                        {location.type === 'dungeon' && (
                          <Icon name="Castle" size={20} className="absolute -top-6 -left-2 text-destructive" />
                        )}
                        {location.type === 'field' && (
                          <Icon name="Trees" size={20} className="absolute -top-6 -left-2 text-green-500" />
                        )}
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <div className="bg-card border border-border rounded px-3 py-2 text-sm">
                          <div className="font-semibold">{location.name}</div>
                          <div className="text-xs text-muted-foreground">Уровень: {location.level}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedLocation && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        {selectedLocation.type === 'town' && <Icon name="Home" size={24} className="text-accent" />}
                        {selectedLocation.type === 'dungeon' && <Icon name="Castle" size={24} className="text-destructive" />}
                        {selectedLocation.type === 'field' && <Icon name="Trees" size={24} className="text-green-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{selectedLocation.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Рекомендуемый уровень: {selectedLocation.level}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {selectedLocation.type === 'town' && 'Город'}
                          {selectedLocation.type === 'dungeon' && 'Подземелье'}
                          {selectedLocation.type === 'field' && 'Поле охоты'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="news" className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold mb-12 text-center text-glow">ПОСЛЕДНИЕ НОВОСТИ</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {news.map((item) => (
              <Card key={item.id} className="card-glow hover-glow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="rankings" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold mb-12 text-center text-glow">ТОП ИГРОКОВ</h3>
          <Card className="max-w-3xl mx-auto card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Trophy" className="text-primary" size={24} />
                Рейтинг Олимпиады
              </CardTitle>
              <CardDescription>Лучшие бойцы сервера</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        index === 1 ? 'bg-gray-400/20 text-gray-400' :
                        index === 2 ? 'bg-orange-500/20 text-orange-500' :
                        'bg-primary/20 text-primary'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.class} • Уровень {player.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{player.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">очков</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8 text-glow">ПОДДЕРЖКА</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Нужна помощь? Свяжись с нашей командой поддержки
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="outline">
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Discord
            </Button>
            <Button size="lg" variant="outline">
              <Icon name="Mail" size={20} className="mr-2" />
              Email
            </Button>
            <Button size="lg" variant="outline">
              <Icon name="FileText" size={20} className="mr-2" />
              FAQ
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border bg-card/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Swords" className="text-primary" size={24} />
            <span className="font-bold text-foreground">LINEAGE II</span>
          </div>
          <p className="text-sm">© 2024 Lineage II. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={showRegister} onOpenChange={resetRegistration}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {!isRegistered ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-center text-glow">
                  {registrationStep === 1 ? 'ВЫБЕРИ КЛАСС' : 'СОЗДАЙ ПЕРСОНАЖА'}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {registrationStep === 1 ? 'Выбери класс для своего первого персонажа' : 'Заполни данные для регистрации'}
                </DialogDescription>
              </DialogHeader>

              {registrationStep === 1 && (
                <div className="grid md:grid-cols-3 gap-4 mt-4 animate-fade-in">
                  {gameClasses.map((cls) => (
                    <Card
                      key={cls.id}
                      className="cursor-pointer hover-glow transition-all hover:scale-105"
                      onClick={() => handleClassSelect(cls)}
                    >
                      <CardHeader>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <Icon name={cls.icon as any} size={32} className="text-primary" />
                          </div>
                          <CardTitle className="text-center">{cls.name}</CardTitle>
                          <Badge variant="outline">
                            {cls.type === 'warrior' && 'Воин'}
                            {cls.type === 'mage' && 'Маг'}
                            {cls.type === 'archer' && 'Лучник'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">{cls.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {registrationStep === 2 && selectedClass && (
                <div className="space-y-6 animate-fade-in">
                  <Card className="bg-primary/10 border-primary/30">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name={selectedClass.icon as any} size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold">{selectedClass.name}</h4>
                        <p className="text-sm text-muted-foreground">Выбранный класс</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setRegistrationStep(1)}
                      >
                        Изменить
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Имя персонажа</Label>
                      <div className="relative">
                        <Icon name="User" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="username"
                          placeholder="Введите имя персонажа"
                          value={formData.username}
                          onChange={(e) => handleFormChange('username', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Icon name="Mail" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <div className="relative">
                          <Icon name="Lock" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Минимум 6 символов"
                            value={formData.password}
                            onChange={(e) => handleFormChange('password', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Подтверждение</Label>
                        <div className="relative">
                          <Icon name="Lock" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Повторите пароль"
                            value={formData.confirmPassword}
                            onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setRegistrationStep(1)}
                    >
                      <Icon name="ArrowLeft" size={18} className="mr-2" />
                      Назад
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={handleRegister}
                    >
                      <Icon name="CheckCircle" size={18} className="mr-2" />
                      Зарегистрироваться
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Icon name="CheckCircle" size={48} className="text-green-500" />
              </div>
              <DialogTitle className="text-3xl font-bold mb-3 text-glow">Регистрация завершена!</DialogTitle>
              <DialogDescription className="text-lg">
                Персонаж {formData.username} создан. Класс: {selectedClass?.name}
              </DialogDescription>
              <p className="text-muted-foreground mt-4">Добро пожаловать в мир Lineage II!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;