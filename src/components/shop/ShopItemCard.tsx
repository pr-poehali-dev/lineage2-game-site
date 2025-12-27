import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ShopItem } from '../types';

interface ShopItemCardProps {
  item: ShopItem;
  playerCoins: number;
  onPurchase: (item: ShopItem) => void;
  onEdit: (item: ShopItem) => void;
}

const ShopItemCard = ({ item, playerCoins, onPurchase, onEdit }: ShopItemCardProps) => {
  return (
    <Card className="card-glow hover-glow overflow-hidden">
      {item.imageUrl && (
        <div className="w-full h-48 overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {!item.imageUrl && (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name={item.icon as any} size={24} className="text-primary" />
              </div>
            )}
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(item)}
            className="h-8 w-8"
          >
            <Icon name="Edit" size={16} />
          </Button>
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
            onClick={() => onPurchase(item)}
            disabled={playerCoins < item.price}
            className="bg-primary hover:bg-primary/90"
          >
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            Купить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopItemCard;
