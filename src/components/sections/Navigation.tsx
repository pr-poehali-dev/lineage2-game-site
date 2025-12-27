import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LoggedPlayer } from '@/components/types';

interface NavigationProps {
  activeSection: string;
  currentPlayer: LoggedPlayer | null;
  onSectionClick: (section: string) => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoutClick: () => void;
}

const Navigation = ({
  activeSection,
  currentPlayer,
  onSectionClick,
  onProfileClick,
  onLoginClick,
  onRegisterClick,
  onLogoutClick
}: NavigationProps) => {
  return (
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
              onClick={() => onSectionClick(section)}
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
              <Button size="sm" variant="outline" onClick={onProfileClick}>
                <Icon name="User" size={16} className="mr-2" />
                {currentPlayer.username}
              </Button>
              <Button size="sm" variant="ghost" onClick={onLogoutClick}>
                <Icon name="LogOut" size={16} />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={onLoginClick}>
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onRegisterClick}>
                <Icon name="UserPlus" size={16} className="mr-2" />
                Регистрация
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
