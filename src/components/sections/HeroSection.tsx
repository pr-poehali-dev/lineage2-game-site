import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  statistics: { online_players: number } | null;
  onRegisterClick: () => void;
}

const HeroSection = ({ statistics, onRegisterClick }: HeroSectionProps) => {
  return (
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
        <h2 className="text-6xl md:text-8xl font-bold mb-6 text-glow tracking-wider">
          ЛЕГЕНДА ВОЗРОЖДАЕТСЯ
        </h2>
        <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto font-medium">
          Погрузись в мир эпических сражений, древних замков и легендарных героев
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" onClick={onRegisterClick}>
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
  );
};

export default HeroSection;