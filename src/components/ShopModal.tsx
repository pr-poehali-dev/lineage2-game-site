import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ShopItem } from './types';
import { useToast } from '@/hooks/use-toast';

interface ShopModalProps {
  showShop: boolean;
  playerCoins: number;
  onClose: () => void;
  onPurchase: (item: ShopItem) => void;
}

const ShopModal = ({ showShop, playerCoins, onClose, onPurchase }: ShopModalProps) => {
  const { toast } = useToast();

  const shopItems: ShopItem[] = [
    {
      id: '1',
      name: 'Легендарный меч',
      description: 'Увеличивает урон на 50%. Сияет в темноте.',
      price: 500,
      icon: 'Sword',
      type: 'weapon'
    },
    {
      id: '2',
      name: 'Доспехи дракона',
      description: 'Защита +100. Иммунитет к огню.',
      price: 750,
      icon: 'Shield',
      type: 'armor'
    },
    {
      id: '3',
      name: 'Эликсир опыта',
      description: '+200% опыта на 1 час.',
      price: 200,
      icon: 'Droplet',
      type: 'potion'
    },
    {
      id: '4',
      name: 'Благословение богов',
      description: 'Все характеристики +20% на 24 часа.',
      price: 350,
      icon: 'Sparkles',
      type: 'boost'
    },
    {
      id: '5',
      name: 'Лук снайпера',
      description: 'Критический урон +75%. Дальность атаки +50%.',
      price: 600,
      icon: 'Target',
      type: 'weapon'
    },
    {
      id: '6',
      name: 'Посох архимага',
      description: 'Магический урон +100%. Мана +500.',
      price: 800,
      icon: 'Wand2',
      type: 'weapon'
    }
  ];

  const handleBuyCoins = (amount: number) => {
    toast({
      title: 'Пополнение баланса',
      description: `Открывается страница оплаты ${amount} монет...`
    });
  };

  const handlePurchase = (item: ShopItem) => {
    if (playerCoins >= item.price) {
      onPurchase(item);
      toast({
        title: 'Покупка успешна!',
        description: `Вы приобрели: ${item.name}`
      });
    } else {
      toast({
        title: 'Недостаточно монет',
        description: `Нужно еще ${item.price - playerCoins} монет`,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={showShop} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-glow">МАГАЗИН ДОНАТА</DialogTitle>
          <DialogDescription className="text-center">
            Улучши своего персонажа премиум предметами
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
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
                  <Button onClick={() => handleBuyCoins(100)} variant="outline" size="sm">
                    <Icon name="Plus" size={16} className="mr-1" />
                    100 монет - 99₽
                  </Button>
                  <Button onClick={() => handleBuyCoins(500)} variant="outline" size="sm">
                    <Icon name="Plus" size={16} className="mr-1" />
                    500 монет - 399₽
                  </Button>
                  <Button onClick={() => handleBuyCoins(1000)} className="bg-primary" size="sm">
                    <Icon name="Plus" size={16} className="mr-1" />
                    1000 монет - 699₽
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {shopItems.map((item) => (
              <Card key={item.id} className="card-glow hover-glow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name={item.icon as any} size={24} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {item.type === 'weapon' && 'Оружие'}
                          {item.type === 'armor' && 'Броня'}
                          {item.type === 'potion' && 'Зелье'}
                          {item.type === 'boost' && 'Усиление'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 min-h-[40px]">{item.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Coins" size={20} className="text-yellow-500" />
                      <span className="text-xl font-bold text-yellow-500">{item.price}</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={playerCoins < item.price}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      Купить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
