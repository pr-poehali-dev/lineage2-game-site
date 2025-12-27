import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { GameClass, Location, NewsItem, Player, ClassStat, RaidBoss } from '@/components/types';

interface ContentSectionsProps {
  gameClasses: GameClass[];
  raidBosses: RaidBoss[];
  timeRemaining: Record<string, string>;
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  news: NewsItem[];
  topPlayers: Player[];
  statistics: { total_players: number; online_players: number; class_stats: ClassStat[] } | null;
}

const ContentSections = ({
  gameClasses,
  raidBosses,
  timeRemaining,
  locations,
  selectedLocation,
  setSelectedLocation,
  news,
  topPlayers,
  statistics
}: ContentSectionsProps) => {
  return (
    <>
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

      <section id="raids" className="py-20 px-4 bg-card/30">
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
                      <div className="pt-2 border-t border-border space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Дата респауна:</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(boss.nextRespawn).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Осталось:</span>
                          <Badge 
                            className={`text-xs font-mono ${boss.isAlive ? 'bg-blue-500' : 'bg-orange-500'}`}
                          >
                            <Icon name="Timer" size={12} className="mr-1" />
                            {timeRemaining[boss.id] || 'Загрузка...'}
                          </Badge>
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

      <section id="map" className="py-20 px-4">
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

      <section id="rankings" className="py-20 px-4">
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

      <section id="contact" className="py-20 px-4 bg-card/30">
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
    </>
  );
};

export default ContentSections;
