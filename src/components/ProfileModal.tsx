import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { LoggedPlayer } from './types';

interface ProfileModalProps {
  showProfile: boolean;
  currentPlayer: LoggedPlayer | null;
  onClose: () => void;
  onLogout: () => void;
  onOpenShop: () => void;
}

const ProfileModal = ({
  showProfile,
  currentPlayer,
  onClose,
  onLogout,
  onOpenShop
}: ProfileModalProps) => {
  return (
    <Dialog open={showProfile} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-glow">ЛИЧНЫЙ КАБИНЕТ</DialogTitle>
          <DialogDescription className="text-center">
            Информация о персонаже
          </DialogDescription>
        </DialogHeader>

        {currentPlayer && (
          <Tabs defaultValue="profile" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <Icon name="User" size={16} className="mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="shop">
                <Icon name="ShoppingBag" size={16} className="mr-2" />
                Магазин
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-4">
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="User" size={40} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{currentPlayer.username}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{currentPlayer.email}</p>
                    <Badge variant="outline" className="text-base">
                      {currentPlayer.character_class}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Star" className="text-accent" size={20} />
                    Уровень
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">{currentPlayer.level}</p>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Zap" className="text-yellow-500" size={20} />
                    Опыт
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">{currentPlayer.experience.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" className="text-green-500" size={20} />
                  Прогресс до следующего уровня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{currentPlayer.experience.toLocaleString()} / {((currentPlayer.level + 1) * 1000).toLocaleString()} XP</span>
                    <span>{Math.min(100, (currentPlayer.experience / ((currentPlayer.level + 1) * 1000)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(100, (currentPlayer.experience / ((currentPlayer.level + 1) * 1000)) * 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

              <Button
                variant="outline"
                className="w-full"
                onClick={onLogout}
              >
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти из аккаунта
              </Button>
            </TabsContent>

            <TabsContent value="shop" className="space-y-4 mt-4">
              <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Icon name="Coins" size={32} className="text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ваш баланс:</p>
                        <p className="text-3xl font-bold text-yellow-500">{currentPlayer.coins || 0} монет</p>
                      </div>
                    </div>
                    <Button onClick={onOpenShop} className="bg-primary hover:bg-primary/90">
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      Открыть магазин
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="card-glow hover:scale-105 transition-transform cursor-pointer">
                  <CardHeader className="text-center">
                    <Icon name="Plus" size={40} className="mx-auto text-primary mb-2" />
                    <CardTitle className="text-xl">100 монет</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-primary mb-4">99₽</p>
                    <Button className="w-full bg-primary">Купить</Button>
                  </CardContent>
                </Card>

                <Card className="card-glow hover:scale-105 transition-transform cursor-pointer border-primary">
                  <CardHeader className="text-center">
                    <Badge className="mb-2 bg-green-500">ПОПУЛЯРНОЕ</Badge>
                    <Icon name="Zap" size={40} className="mx-auto text-primary mb-2" />
                    <CardTitle className="text-xl">500 монет</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-primary mb-4">399₽</p>
                    <Button className="w-full bg-primary">Купить</Button>
                  </CardContent>
                </Card>

                <Card className="card-glow hover:scale-105 transition-transform cursor-pointer">
                  <CardHeader className="text-center">
                    <Icon name="Crown" size={40} className="mx-auto text-yellow-500 mb-2" />
                    <CardTitle className="text-xl">1000 монет</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-primary mb-4">699₽</p>
                    <Button className="w-full bg-primary">Купить</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;