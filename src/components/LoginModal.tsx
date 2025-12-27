import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface LoginModalProps {
  showLogin: boolean;
  loginData: { username: string; password: string };
  isLoading: boolean;
  onClose: () => void;
  onLoginDataChange: (data: { username: string; password: string }) => void;
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal = ({
  showLogin,
  loginData,
  isLoading,
  onClose,
  onLoginDataChange,
  onLogin,
  onSwitchToRegister
}: LoginModalProps) => {
  return (
    <Dialog open={showLogin} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-glow">ВХОД В ИГРУ</DialogTitle>
          <DialogDescription className="text-center">
            Введите данные вашего персонажа
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-username">Имя персонажа</Label>
            <div className="relative">
              <Icon name="User" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-username"
                placeholder="Введите имя персонажа"
                value={loginData.username}
                onChange={(e) => onLoginDataChange({ ...loginData, username: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Пароль</Label>
            <div className="relative">
              <Icon name="Lock" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                type="password"
                placeholder="Введите пароль"
                value={loginData.password}
                onChange={(e) => onLoginDataChange({ ...loginData, password: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={onLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Вход...
              </>
            ) : (
              <>
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <button
              className="text-primary hover:underline"
              onClick={onSwitchToRegister}
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
