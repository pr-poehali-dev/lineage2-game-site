import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Location, PlayerOnMap } from '@/components/types';

interface MapSectionProps {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}

const MapSection = ({ locations, selectedLocation, setSelectedLocation }: MapSectionProps) => {
  const [searchNickname, setSearchNickname] = useState('');
  const [searchedPlayer, setSearchedPlayer] = useState<PlayerOnMap | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const playersOnMap: PlayerOnMap[] = [
    { id: '1', username: 'DarkLord', level: 85, class: 'Воин', x: 50, y: 75, location: 'Аден', isOnline: true },
    { id: '2', username: 'MysticSage', level: 84, class: 'Маг', x: 80, y: 70, location: 'Лес Зеркал', isOnline: true },
    { id: '3', username: 'ShadowArrow', level: 83, class: 'Лучник', x: 75, y: 35, location: 'Гиран', isOnline: true },
    { id: '4', username: 'HolyKnight', level: 82, class: 'Рыцарь', x: 20, y: 30, location: 'Глудио', isOnline: true },
    { id: '5', username: 'StormMage', level: 81, class: 'Волшебник', x: 60, y: 60, location: 'Катакомбы Еретиков', isOnline: true },
    { id: '6', username: 'WarriorKing', level: 78, class: 'Воин', x: 35, y: 50, location: 'Крумская Башня', isOnline: true },
    { id: '7', username: 'GameMaster', level: 90, class: 'Админ', x: 50, y: 25, location: 'Диоон', isOnline: true },
    { id: '8', username: 'NewPlayer2024', level: 15, class: 'Лучник', x: 25, y: 80, location: 'Логово Антараса', isOnline: false },
  ];

  const handleSearchPlayer = () => {
    setSearchAttempted(true);
    const player = playersOnMap.find(
      p => p.username.toLowerCase() === searchNickname.toLowerCase()
    );
    
    if (player) {
      setSearchedPlayer(player);
    } else {
      setSearchedPlayer(null);
    }
  };

  const getClassColor = (className: string) => {
    const colors: Record<string, string> = {
      'Воин': 'text-red-500',
      'Маг': 'text-blue-500',
      'Лучник': 'text-green-500',
      'Рыцарь': 'text-yellow-500',
      'Волшебник': 'text-purple-500',
      'Админ': 'text-pink-500'
    };
    return colors[className] || 'text-gray-500';
  };

  const handleClearSearch = () => {
    setSearchNickname('');
    setSearchedPlayer(null);
    setSearchAttempted(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="card-glow mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Поиск игрока на карте
              </label>
              <Input
                placeholder="Введите никнейм игрока..."
                value={searchNickname}
                onChange={(e) => setSearchNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchPlayer()}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearchPlayer} className="bg-primary">
              <Icon name="Search" size={16} className="mr-2" />
              Найти
            </Button>
            {(searchedPlayer || searchAttempted) && (
              <Button onClick={handleClearSearch} variant="outline">
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>

          {searchAttempted && !searchedPlayer && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <Icon name="AlertCircle" size={20} />
                <p className="font-medium">Игрок "{searchNickname}" не найден или оффлайн</p>
              </div>
            </div>
          )}

          {searchedPlayer && (
            <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="User" size={28} className="text-primary" />
                  </div>
                  {searchedPlayer.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-xl">{searchedPlayer.username}</h4>
                    <Badge className={searchedPlayer.isOnline ? 'bg-green-500' : 'bg-gray-500'}>
                      {searchedPlayer.isOnline ? 'Онлайн' : 'Оффлайн'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Уровень: {searchedPlayer.level}</span>
                    <span className={getClassColor(searchedPlayer.class)}>
                      {searchedPlayer.class}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} className="text-primary" />
                      {searchedPlayer.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-glow">
        <CardContent className="p-8">
          <div className="relative w-full h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-primary/30 overflow-hidden">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
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
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  <div className="bg-card border border-border rounded px-3 py-2 text-sm shadow-lg">
                    <div className="font-semibold">{location.name}</div>
                    <div className="text-xs text-muted-foreground">Уровень: {location.level}</div>
                  </div>
                </div>
              </button>
            ))}

            {playersOnMap.filter(p => p.isOnline).map((player) => (
              <div
                key={player.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 ${
                  searchedPlayer?.id === player.id ? 'z-30' : ''
                }`}
                style={{ left: `${player.x}%`, top: `${player.y}%` }}
              >
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    searchedPlayer?.id === player.id 
                      ? 'bg-yellow-500 ring-4 ring-yellow-500/50 animate-pulse' 
                      : 'bg-green-500/80 hover:bg-green-500'
                  } transition-all cursor-pointer`}>
                    <Icon name="User" size={16} className="text-white" />
                  </div>
                  {searchedPlayer?.id === player.id && (
                    <>
                      <div className="absolute inset-0 w-8 h-8 rounded-full bg-yellow-500/30 animate-ping"></div>
                      <Icon name="Navigation" size={32} className="absolute -top-10 -left-4 text-yellow-500 animate-bounce" />
                    </>
                  )}
                </div>
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                  <div className="bg-card border border-green-500/50 rounded px-3 py-2 text-sm shadow-lg">
                    <div className="font-semibold text-green-500">{player.username}</div>
                    <div className="text-xs text-muted-foreground">
                      Ур. {player.level} • {player.class}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Icon name="MapPin" size={10} />
                      {player.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
              <h5 className="font-semibold mb-3 text-sm">Легенда карты</h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Icon name="Home" size={16} className="text-accent" />
                  <span>Город</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Castle" size={16} className="text-destructive" />
                  <span>Подземелье</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Trees" size={16} className="text-green-500" />
                  <span>Поле охоты</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Игроки онлайн</span>
                </div>
              </div>
            </div>
          </div>

          {selectedLocation && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  {selectedLocation.type === 'town' && <Icon name="Home" size={24} className="text-accent" />}
                  {selectedLocation.type === 'dungeon' && <Icon name="Castle" size={24} className="text-destructive" />}
                  {selectedLocation.type === 'field' && <Icon name="Trees" size={24} className="text-green-500" />}
                </div>
                <div className="flex-1">
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
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Игроков в зоне:</p>
                  <p className="text-2xl font-bold text-primary">
                    {playersOnMap.filter(p => p.location === selectedLocation.name && p.isOnline).length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSection;
