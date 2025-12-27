import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('shop');
  
  const [shopItems, setShopItems] = useState<ShopItem[]>([
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
  ]);

  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    icon: 'Sword',
    type: 'weapon' as 'weapon' | 'armor' | 'potion' | 'boost'
  });

  const iconOptions = [
    'Sword', 'Shield', 'Target', 'Wand2', 'Sparkles', 'Droplet', 
    'Zap', 'Star', 'Crown', 'Gem', 'Award', 'Heart'
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

  const handleCreateItem = () => {
    const newItem: ShopItem = {
      id: Date.now().toString(),
      ...formData
    };
    setShopItems([...shopItems, newItem]);
    resetForm();
    toast({
      title: 'Товар создан!',
      description: `${newItem.name} добавлен в магазин`
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    setShopItems(shopItems.map(item => 
      item.id === editingItem.id 
        ? { ...editingItem, ...formData }
        : item
    ));
    resetForm();
    toast({
      title: 'Товар обновлен!',
      description: `${formData.name} успешно изменен`
    });
  };

  const handleDeleteItem = (id: string) => {
    setShopItems(shopItems.filter(item => item.id !== id));
    toast({
      title: 'Товар удален',
      description: 'Товар удален из магазина'
    });
  };

  const startEdit = (item: ShopItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      icon: item.icon,
      type: item.type
    });
    setIsCreating(false);
    setActiveTab('editor');
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
    setEditingItem(null);
    setActiveTab('editor');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      icon: 'Sword',
      type: 'weapon'
    });
    setEditingItem(null);
    setIsCreating(false);
  };

  return (
    <Dialog open={showShop} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-glow">МАГАЗИН ДОНАТА</DialogTitle>
          <DialogDescription className="text-center">
            Улучши своего персонажа премиум предметами
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shop">
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="editor">
              <Icon name="Edit" size={16} className="mr-2" />
              Редактор
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="space-y-6">
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEdit(item)}
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
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isCreating ? 'Создание товара' : editingItem ? 'Редактирование товара' : 'Выберите товар для редактирования'}</span>
                  {!isCreating && !editingItem && (
                    <Button onClick={startCreate} className="bg-primary">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать товар
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(isCreating || editingItem) ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Название товара</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Легендарный меч"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Цена (монеты)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                          placeholder="500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Увеличивает урон на 50%. Сияет в темноте."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Тип товара</Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weapon">Оружие</SelectItem>
                            <SelectItem value="armor">Броня</SelectItem>
                            <SelectItem value="potion">Зелье</SelectItem>
                            <SelectItem value="boost">Усиление</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="icon">Иконка</Label>
                        <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map(icon => (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center gap-2">
                                  <Icon name={icon as any} size={16} />
                                  {icon}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card className="bg-card/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Предпросмотр</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <Icon name={formData.icon as any} size={32} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{formData.name || 'Название товара'}</h4>
                            <p className="text-sm text-muted-foreground">{formData.description || 'Описание товара'}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Icon name="Coins" size={16} className="text-yellow-500" />
                              <span className="font-bold text-yellow-500">{formData.price}</span>
                              <Badge variant="outline" className="ml-2">
                                {formData.type === 'weapon' && 'Оружие'}
                                {formData.type === 'armor' && 'Броня'}
                                {formData.type === 'potion' && 'Зелье'}
                                {formData.type === 'boost' && 'Усиление'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={resetForm}>
                        <Icon name="X" size={16} className="mr-2" />
                        Отмена
                      </Button>
                      {editingItem && (
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleDeleteItem(editingItem.id);
                            resetForm();
                          }}
                        >
                          <Icon name="Trash2" size={16} className="mr-2" />
                          Удалить
                        </Button>
                      )}
                      <Button 
                        onClick={isCreating ? handleCreateItem : handleUpdateItem}
                        className="bg-primary"
                        disabled={!formData.name || !formData.description || formData.price <= 0}
                      >
                        <Icon name="Save" size={16} className="mr-2" />
                        {isCreating ? 'Создать' : 'Сохранить'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {shopItems.map((item) => (
                      <Card 
                        key={item.id} 
                        className="cursor-pointer hover:bg-accent/10 transition-colors"
                        onClick={() => startEdit(item)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <Icon name={item.icon as any} size={24} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold">{item.name}</h4>
                              <div className="flex items-center gap-2 text-sm">
                                <Icon name="Coins" size={14} className="text-yellow-500" />
                                <span className="text-yellow-500">{item.price}</span>
                              </div>
                            </div>
                            <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
