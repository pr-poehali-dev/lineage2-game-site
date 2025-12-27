import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ShopBalanceProps {
  playerCoins: number;
  onBuyCoins: (amount: number) => void;
}

const ShopBalance = ({ playerCoins, onBuyCoins }: ShopBalanceProps) => {
  return (
    <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Icon name="Coins" size={32} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ваш баланс:</p>
              <p className="text-3xl font-bold text-yellow-500">{playerCoins} монет</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onBuyCoins(100)} variant="outline" size="sm">
              <Icon name="Plus" size={16} className="mr-1" />
              100 монет - 99₽
            </Button>
            <Button onClick={() => onBuyCoins(500)} variant="outline" size="sm">
              <Icon name="Plus" size={16} className="mr-1" />
              500 монет - 399₽
            </Button>
            <Button onClick={() => onBuyCoins(1000)} className="bg-primary" size="sm">
              <Icon name="Plus" size={16} className="mr-1" />
              1000 монет - 699₽
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopBalance;
