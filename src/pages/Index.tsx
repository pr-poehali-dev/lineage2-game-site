import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { GameClass, Location, NewsItem, Player, LoggedPlayer, ClassStat, ShopItem, RaidBoss } from '@/components/types';
import RegistrationModal from '@/components/RegistrationModal';
import LoginModal from '@/components/LoginModal';
import ProfileModal from '@/components/ProfileModal';
import ShopModal from '@/components/ShopModal';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<GameClass | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [currentPlayer, setCurrentPlayer] = useState<LoggedPlayer | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [showProfile, setShowProfile] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [statistics, setStatistics] = useState<{ total_players: number; online_players: number; class_stats: ClassStat[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [raidBosses, setRaidBosses] = useState<RaidBoss[]>([
    { id: '1', name: 'Баюм', level: 75, respawnTime: '5 дней', isAlive: true, location: 'Лес зеркал', nextRespawn: '29.12.2024 18:00' },
    { id: '2', name: 'Антарас', level: 79, respawnTime: '7 дней', isAlive: false, location: 'Логово Антараса', nextRespawn: '30.12.2024 20:00' },
    { id: '3', name: 'Валакас', level: 85, respawnTime: '10 дней', isAlive: true, location: 'Пещера Валакаса', nextRespawn: '02.01.2025 21:00' },
    { id: '4', name: 'Королева муравьев', level: 40, respawnTime: '24 часа', isAlive: true, location: 'Муравейник', nextRespawn: '28.12.2024 14:00' },
    { id: '5', name: 'Орфен', level: 50, respawnTime: '48 часов', isAlive: false, location: 'Храм Аркан', nextRespawn: '29.12.2024 10:00' },
    { id: '6', name: 'Закен', level: 60, respawnTime: '72 часа', isAlive: true, location: 'Закенский алтарь', nextRespawn: '31.12.2024 22:00' },
    { id: '7', name: 'Кор', level: 70, respawnTime: '4 дня', isAlive: false, location: 'Логово Кора', nextRespawn: '28.12.2024 16:00' },
    { id: '8', name: 'Квин Аркания', level: 80, respawnTime: '6 дней', isAlive: true, location: 'Замок Аркании', nextRespawn: '01.01.2025 19:00' },
    { id: '9', name: 'Фринтеза', level: 85, respawnTime: '8 дней', isAlive: false, location: 'Храм Фринтезы', nextRespawn: '03.01.2025 15:00' },
  ]);
  const { toast } = useToast();

  const API_URL = 'https://functions.poehali.dev/02f42820-5dff-4b5b-abaa-182b01ed3cd8';

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

  const handleRegister = async () => {
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
    
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username: formData.username,
          email: formData.email,
          password: formData.password,
          character_class: selectedClass?.name || 'Воин'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsRegistered(true);
        localStorage.setItem('authToken', data.token);
        setAuthToken(data.token);
        setCurrentPlayer({ ...data.player, coins: 100 });
        
        setTimeout(() => {
          setShowRegister(false);
          setIsRegistered(false);
          setRegistrationStep(1);
          setSelectedClass(null);
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
          toast({ title: 'Успешно!', description: `Добро пожаловать, ${data.player.username}! Персонаж создан.` });
          fetchStatistics();
        }, 2000);
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось зарегистрироваться', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Проблема с соединением', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      toast({ title: 'Ошибка', description: 'Введите имя и пароль', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: loginData.username,
          password: loginData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        setAuthToken(data.token);
        setCurrentPlayer({ ...data.player, coins: data.player.coins || 100 });
        setShowLogin(false);
        setLoginData({ username: '', password: '' });
        toast({ title: 'Успешно!', description: `С возвращением, ${data.player.username}!` });
        fetchStatistics();
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Неверные данные', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Проблема с соединением', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setCurrentPlayer(null);
    setShowProfile(false);
    toast({ title: 'Вы вышли', description: 'До новых встреч в мире Lineage II!' });
  };

  const handlePurchase = (item: ShopItem) => {
    if (currentPlayer && currentPlayer.coins && currentPlayer.coins >= item.price) {
      setCurrentPlayer({
        ...currentPlayer,
        coins: currentPlayer.coins - item.price
      });
      toast({
        title: 'Покупка успешна!',
        description: `Вы приобрели: ${item.name}`
      });
    } else {
      toast({
        title: 'Недостаточно монет',
        description: 'Пополните баланс для покупки',
        variant: 'destructive'
      });
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const resetRegistration = () => {
    setShowRegister(false);
    setRegistrationStep(1);
    setSelectedClass(null);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setIsRegistered(false);
  };

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <nav className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Swords" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-glow">LINEAGE II</h1>
          </div>
          <div className="hidden md:flex gap-6">
            {['home', 'about', 'classes', 'raids', 'map', 'news', 'rankings', 'contact'].map((section) => (
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
                {section === 'raids' && 'Рейды'}
                {section === 'map' && 'Карта мира'}
                {section === 'news' && 'Новости'}
                {section === 'rankings' && 'Рейтинги'}
                {section === 'contact' && 'Контакты'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {currentPlayer ? (
              <>
                <Button size="sm" variant="outline" onClick={() => setShowProfile(true)}>
                  <Icon name="User" size={16} className="mr-2" />
                  {currentPlayer.username}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  <Icon name="LogOut" size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setShowLogin(true)}>
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Войти
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setShowRegister(true)}>
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center animate-fade-in">
          <div className="inline-block mb-6">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500 px-4 py-2 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-ping absolute"></div>
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <Icon name="Wifi" size={16} className="mr-2" />
              Сервер онлайн • {statistics?.online_players || 0} игроков
            </Badge>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-6 text-glow">
            LINEAGE 2
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
            <Card className="card-glow hover-glow cursor-pointer" onClick={() => scrollToSection('raids')}>
              <CardHeader>
                <Icon name="Swords" size={40} className="text-primary mb-4" />
                <CardTitle>Эпические рейды</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Сражайся с легендарными боссами: Баюм, Антарас, Валакас и другие драконы.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Боссов всего:</span>
                    <Badge variant="outline">{raidBosses.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Живых сейчас:</span>
                    <Badge className="bg-green-500">{raidBosses.filter(b => b.isAlive).length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Убитых:</span>
                    <Badge className="bg-red-500">{raidBosses.filter(b => !b.isAlive).length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-glow hover-glow">
              <CardHeader>
                <Icon name="Trophy" size={40} className="text-primary mb-4" />
                <CardTitle>Система кланов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Создай свой клан, объединяйся в альянсы и доминируй на сервере вместе с друзьями.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Shield" size={16} className="text-primary" />
                    <span className="text-muted-foreground">Осадные войны по субботам</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={16} className="text-primary" />
                    <span className="text-muted-foreground">До 40 членов в клане</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Crown" size={16} className="text-primary" />
                    <span className="text-muted-foreground">Уникальные клановые скиллы</span>
                  </div>
                </div>
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

      <section id="raids" className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold mb-4 text-center text-glow">ЭПИЧЕСКИЕ РЕЙД-БОССЫ</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Следите за статусом легендарных боссов в реальном времени
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {raidBosses.map((boss) => (
              <Card key={boss.id} className={`card-glow hover-glow ${boss.isAlive ? 'border-green-500/50' : 'border-red-500/50'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {boss.name}
                        <Badge className={boss.isAlive ? 'bg-green-500' : 'bg-red-500'}>
                          {boss.isAlive ? 'Жив' : 'Убит'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">Уровень {boss.level}</CardDescription>
                    </div>
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${boss.isAlive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      {boss.isAlive && (
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500/30 animate-ping"></div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="MapPin" size={16} className="text-primary" />
                      <span className="text-muted-foreground">{boss.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Clock" size={16} className="text-primary" />
                      <span className="text-muted-foreground">Респаун: {boss.respawnTime}</span>
                    </div>
                    {boss.nextRespawn && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Следующий респаун:</span>
                          <Badge variant="outline" className="text-xs">{boss.nextRespawn}</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="py-20 px-4 bg-card/30">
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
          <h3 className="text-4xl font-bold mb-12 text-center text-glow">СТАТИСТИКА СЕРВЕРА</h3>
          
          {statistics && (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              <Card className="card-glow">
                <CardHeader>
                  <Icon name="Users" size={32} className="text-primary mb-2" />
                  <CardTitle className="text-3xl">{statistics.total_players}</CardTitle>
                  <CardDescription>Всего игроков</CardDescription>
                </CardHeader>
              </Card>
              <Card className="card-glow">
                <CardHeader>
                  <Icon name="Wifi" size={32} className="text-green-500 mb-2" />
                  <CardTitle className="text-3xl">{statistics.online_players}</CardTitle>
                  <CardDescription>Онлайн сейчас</CardDescription>
                </CardHeader>
              </Card>
              <Card className="card-glow">
                <CardHeader>
                  <Icon name="TrendingUp" size={32} className="text-accent mb-2" />
                  <CardTitle className="text-3xl">{statistics.class_stats.length}</CardTitle>
                  <CardDescription>Активных классов</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="card-glow">
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

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" className="text-primary" size={24} />
                  Популярность классов
                </CardTitle>
                <CardDescription>Статистика по зарегистрированным персонажам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && statistics.class_stats.length > 0 ? (
                    statistics.class_stats.map((stat, index) => {
                      const percentage = statistics.total_players > 0 ? (stat.count / statistics.total_players) * 100 : 0;
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{stat.class}</span>
                            <span className="text-sm text-muted-foreground">{stat.count} игроков ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-primary/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-primary h-full transition-all duration-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Нет данных о классах</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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

      <RegistrationModal
        showRegister={showRegister}
        isRegistered={isRegistered}
        registrationStep={registrationStep}
        selectedClass={selectedClass}
        formData={formData}
        isLoading={isLoading}
        gameClasses={gameClasses}
        onClose={resetRegistration}
        onClassSelect={handleClassSelect}
        onFormChange={handleFormChange}
        onRegister={handleRegister}
        onBackToClassSelection={() => setRegistrationStep(1)}
      />

      <LoginModal
        showLogin={showLogin}
        loginData={loginData}
        isLoading={isLoading}
        onClose={() => setShowLogin(false)}
        onLoginDataChange={setLoginData}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <ProfileModal
        showProfile={showProfile}
        currentPlayer={currentPlayer}
        onClose={() => setShowProfile(false)}
        onLogout={handleLogout}
        onOpenShop={() => {
          setShowProfile(false);
          setShowShop(true);
        }}
      />

      <ShopModal
        showShop={showShop}
        playerCoins={currentPlayer?.coins || 0}
        onClose={() => setShowShop(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default Index;