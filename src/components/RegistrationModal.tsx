import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { GameClass } from './types';

interface RegistrationModalProps {
  showRegister: boolean;
  isRegistered: boolean;
  registrationStep: number;
  selectedClass: GameClass | null;
  formData: { username: string; email: string; password: string; confirmPassword: string };
  isLoading: boolean;
  gameClasses: GameClass[];
  onClose: () => void;
  onClassSelect: (gameClass: GameClass) => void;
  onFormChange: (field: string, value: string) => void;
  onRegister: () => void;
  onBackToClassSelection: () => void;
}

const RegistrationModal = ({
  showRegister,
  isRegistered,
  registrationStep,
  selectedClass,
  formData,
  isLoading,
  gameClasses,
  onClose,
  onClassSelect,
  onFormChange,
  onRegister,
  onBackToClassSelection
}: RegistrationModalProps) => {
  return (
    <Dialog open={showRegister} onOpenChange={onClose}>
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
                    onClick={() => onClassSelect(cls)}
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
                      onClick={onBackToClassSelection}
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
                        onChange={(e) => onFormChange('username', e.target.value)}
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
                        onChange={(e) => onFormChange('email', e.target.value)}
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
                          onChange={(e) => onFormChange('password', e.target.value)}
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
                          onChange={(e) => onFormChange('confirmPassword', e.target.value)}
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
                    onClick={onBackToClassSelection}
                  >
                    <Icon name="ArrowLeft" size={18} className="mr-2" />
                    Назад
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={onRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                        Создание...
                      </>
                    ) : (
                      <>
                        <Icon name="CheckCircle" size={18} className="mr-2" />
                        Зарегистрироваться
                      </>
                    )}
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
  );
};

export default RegistrationModal;
