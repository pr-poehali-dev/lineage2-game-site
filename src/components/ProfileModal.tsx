import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LoggedPlayer } from './types';

interface ProfileModalProps {
  showProfile: boolean;
  currentPlayer: LoggedPlayer | null;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileModal = ({
  showProfile,
  currentPlayer,
  onClose,
  onLogout
}: ProfileModalProps) => {
  return (
    <Dialog open={showProfile} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-glow">ЛИЧНЫЙ КАБИНЕТ</DialogTitle>
          <DialogDescription className="text-center">
            Информация о персонаже
          </DialogDescription>
        </DialogHeader>

        {currentPlayer && (
          <div className="space-y-6 mt-4">
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
