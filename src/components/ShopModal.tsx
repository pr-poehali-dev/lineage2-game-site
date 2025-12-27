import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { ShopItem } from './types';
import { useToast } from '@/hooks/use-toast';
import ShopBalance from './shop/ShopBalance';
import ShopItemCard from './shop/ShopItemCard';
import ShopItemEditor from './shop/ShopItemEditor';
import ShopFilters from './shop/ShopFilters';

interface ShopModalProps {
  showShop: boolean;
  playerCoins: number;
  onClose: () => void;
  onPurchase: (item: ShopItem) => void;
}

const ShopModal = ({ showShop, playerCoins, onClose, onPurchase }: ShopModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('shop');
  const [loading, setLoading] = useState(true);
  
  const SHOP_API_URL = 'https://functions.poehali.dev/68a98b5c-1fcf-4e68-ae6a-7aba89aa363b';
  
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
    type: 'weapon' as 'weapon' | 'armor' | 'potion' | 'boost',
    imageUrl: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const iconOptions = [
    'Sword', 'Shield', 'Target', 'Wand2', 'Sparkles', 'Droplet', 
    'Zap', 'Star', 'Crown', 'Gem', 'Award', 'Heart'
  ];

  useEffect(() => {
    if (showShop) {
      loadShopItems();
    }
  }, [showShop]);

  const loadShopItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(SHOP_API_URL);
      if (response.ok) {
        const data = await response.json();
        setShopItems(data.items || []);
      } else {
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить товары магазина',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to load shop items:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateItem = async () => {
    try {
      const response = await fetch(SHOP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadShopItems();
        resetForm();
        toast({
          title: 'Товар создан!',
          description: `${formData.name} добавлен в магазин`
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Ошибка создания',
          description: error.error || 'Не удалось создать товар',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать товар',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    
    try {
      const response = await fetch(`${SHOP_API_URL}/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadShopItems();
        resetForm();
        toast({
          title: 'Товар обновлен!',
          description: `${formData.name} успешно изменен`
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Ошибка обновления',
          description: error.error || 'Не удалось обновить товар',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить товар',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`${SHOP_API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadShopItems();
        toast({
          title: 'Товар удален',
          description: 'Товар удален из магазина'
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Ошибка удаления',
          description: error.error || 'Не удалось удалить товар',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Файл слишком большой',
        description: 'Максимальный размер: 5 МБ',
        variant: 'destructive'
      });
      return;
    }

    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({...formData, imageUrl: reader.result as string});
      setUploadingImage(false);
      toast({
        title: 'Изображение загружено!',
        description: 'Изображение успешно добавлено к товару'
      });
    };
    reader.onerror = () => {
      setUploadingImage(false);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive'
      });
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (item: ShopItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      icon: item.icon,
      type: item.type,
      imageUrl: item.imageUrl || ''
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
      type: 'weapon',
      imageUrl: ''
    });
    setEditingItem(null);
    setIsCreating(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSortBy('default');
  };

  const filteredAndSortedItems = useMemo(() => {
    let items = [...shopItems];

    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      items = items.filter(item => item.type === selectedType);
    }

    switch (sortBy) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return items;
  }, [shopItems, searchQuery, selectedType, sortBy]);

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
            <ShopBalance 
              playerCoins={playerCoins}
              onBuyCoins={handleBuyCoins}
            />

            <ShopFilters
              searchQuery={searchQuery}
              selectedType={selectedType}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onTypeChange={setSelectedType}
              onSortChange={setSortBy}
              onReset={resetFilters}
            />

            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="PackageX" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Товары не найдены</h3>
                <p className="text-muted-foreground mb-4">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredAndSortedItems.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    playerCoins={playerCoins}
                    onPurchase={handlePurchase}
                    onEdit={startEdit}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <ShopItemEditor
              isCreating={isCreating}
              editingItem={editingItem}
              formData={formData}
              uploadingImage={uploadingImage}
              iconOptions={iconOptions}
              shopItems={shopItems}
              onFormDataChange={setFormData}
              onImageUpload={handleImageUpload}
              onCreate={handleCreateItem}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
              onCancel={resetForm}
              onStartCreate={startCreate}
              onStartEdit={startEdit}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;