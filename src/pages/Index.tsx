import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { GameClass, Location, NewsItem, Player, LoggedPlayer, ClassStat, ShopItem, RaidBoss } from '@/components/types';
import RegistrationModal from '@/components/RegistrationModal';
import LoginModal from '@/components/LoginModal';
import ProfileModal from '@/components/ProfileModal';
import ShopModal from '@/components/ShopModal';
import AdminModal from '@/components/AdminModal';
import Navigation from '@/components/sections/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ContentSections from '@/components/sections/ContentSections';
import ForumSection from '@/components/sections/ForumSection';

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
  const [showAdmin, setShowAdmin] = useState(false);
  const [statistics, setStatistics] = useState<{ total_players: number; online_players: number; class_stats: ClassStat[] } | null>(null);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [raidBosses, setRaidBosses] = useState<RaidBoss[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const API_URL = 'https://functions.poehali.dev/02f42820-5dff-4b5b-abaa-182b01ed3cd8';
  const STATS_API_URL = 'https://functions.poehali.dev/7a4a963f-09d9-489c-bb57-674a61703f03';
  const NEWS_API_URL = 'https://functions.poehali.dev/da7f7577-0e9b-4797-81f7-b1dfdf0a5538';
  const RAIDS_API_URL = 'https://functions.poehali.dev/fa87c62b-aa78-4162-8e21-2fbf82f4da95';

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



  const scrollToSection = (section: string) => {
    if (section === 'forum') {
      window.location.href = '/forum';
      return;
    }
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

  const handlePurchase = async (item: ShopItem) => {
    if (!currentPlayer) {
      toast({
        title: 'Войдите в аккаунт',
        description: 'Для покупки необходимо авторизоваться',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/68a98b5c-1fcf-4e68-ae6a-7aba89aa363b/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: currentPlayer.id,
          item_id: item.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentPlayer({
          ...currentPlayer,
          coins: data.new_balance
        });
        toast({
          title: 'Покупка успешна!',
          description: `Вы приобрели: ${data.item_name}`
        });
      } else {
        toast({
          title: 'Ошибка покупки',
          description: data.error || 'Не удалось совершить покупку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с соединением',
        variant: 'destructive'
      });
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(STATS_API_URL);
      const data = await response.json();
      
      if (response.ok) {
        setStatistics(data.statistics);
        setTopPlayers(data.top_players || []);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(NEWS_API_URL);
      const data = await response.json();
      
      if (response.ok) {
        setNews(data.news || []);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  const fetchRaidBosses = async () => {
    try {
      const response = await fetch(RAIDS_API_URL);
      const data = await response.json();
      
      if (response.ok) {
        setRaidBosses(data.bosses || []);
      }
    } catch (error) {
      console.error('Failed to fetch raid bosses:', error);
    }
  };

  const refreshAllData = () => {
    fetchStatistics();
    fetchNews();
    fetchRaidBosses();
  };

  const resetRegistration = () => {
    setShowRegister(false);
    setRegistrationStep(1);
    setSelectedClass(null);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setIsRegistered(false);
  };

  const calculateTimeRemaining = (targetDate: string): string => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return 'Респаун прошёл';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}д ${hours}ч ${minutes}м`;
    } else if (hours > 0) {
      return `${hours}ч ${minutes}м ${seconds}с`;
    } else if (minutes > 0) {
      return `${minutes}м ${seconds}с`;
    } else {
      return `${seconds}с`;
    }
  };

  useEffect(() => {
    const updateTimers = () => {
      const newTimeRemaining: Record<string, string> = {};
      raidBosses.forEach(boss => {
        if (boss.nextRespawn) {
          newTimeRemaining[boss.id] = calculateTimeRemaining(boss.nextRespawn);
        }
      });
      setTimeRemaining(newTimeRemaining);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [raidBosses]);

  useEffect(() => {
    fetchStatistics();
    fetchNews();
    fetchRaidBosses();
    
    const statsInterval = setInterval(fetchStatistics, 30000);
    const raidsInterval = setInterval(fetchRaidBosses, 60000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(raidsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navigation
        activeSection={activeSection}
        currentPlayer={currentPlayer}
        onSectionClick={scrollToSection}
        onProfileClick={() => setShowProfile(true)}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogoutClick={handleLogout}
        onAdminClick={() => setShowAdmin(true)}
      />

      <HeroSection
        statistics={statistics}
        onRegisterClick={() => setShowRegister(true)}
      />

      <AboutSection
        raidBosses={raidBosses}
        onRaidsClick={() => scrollToSection('raids')}
      />

      <ContentSections
        gameClasses={gameClasses}
        raidBosses={raidBosses}
        timeRemaining={timeRemaining}
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        news={news}
        topPlayers={topPlayers}
        statistics={statistics}
      />

      <ForumSection
        currentPlayer={currentPlayer}
        onLoginClick={() => setShowLogin(true)}
      />

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

      <AdminModal
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        news={news}
        raidBosses={raidBosses}
        onRefresh={refreshAllData}
      />
    </div>
  );
};

export default Index;