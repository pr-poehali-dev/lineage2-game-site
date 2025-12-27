import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ShopItem } from '../types';

interface ShopItemEditorProps {
  isCreating: boolean;
  editingItem: ShopItem | null;
  formData: {
    name: string;
    description: string;
    price: number;
    icon: string;
    type: 'weapon' | 'armor' | 'potion' | 'boost';
    imageUrl: string;
  };
  uploadingImage: boolean;
  iconOptions: string[];
  shopItems: ShopItem[];
  onFormDataChange: (data: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  onStartCreate: () => void;
  onStartEdit: (item: ShopItem) => void;
}

const ShopItemEditor = ({
  isCreating,
  editingItem,
  formData,
  uploadingImage,
  iconOptions,
  shopItems,
  onFormDataChange,
  onImageUpload,
  onCreate,
  onUpdate,
  onDelete,
  onCancel,
  onStartCreate,
  onStartEdit
}: ShopItemEditorProps) => {
  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isCreating ? 'Создание товара' : editingItem ? 'Редактирование товара' : 'Выберите товар для редактирования'}</span>
          {!isCreating && !editingItem && (
            <Button onClick={onStartCreate} className="bg-primary">
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
                  onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
                  placeholder="Легендарный меч"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Цена (монеты)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => onFormDataChange({...formData, price: Number(e.target.value)})}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onFormDataChange({...formData, description: e.target.value})}
                placeholder="Увеличивает урон на 50%. Сияет в темноте."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Изображение товара</Label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    disabled={uploadingImage}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG или GIF. Макс. 5 МБ
                  </p>
                </div>
                {formData.imageUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/50">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => onFormDataChange({...formData, imageUrl: ''})}
                    >
                      <Icon name="X" size={12} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Тип товара</Label>
                <Select value={formData.type} onValueChange={(value: any) => onFormDataChange({...formData, type: value})}>
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
                <Label htmlFor="icon">Иконка (если нет изображения)</Label>
                <Select value={formData.icon} onValueChange={(value) => onFormDataChange({...formData, icon: value})}>
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

            <Card className="bg-card/50 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm">Предпросмотр</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.imageUrl && (
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden border border-border">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {!formData.imageUrl && (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name={formData.icon as any} size={32} className="text-primary" />
                    </div>
                  )}
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
              <Button variant="outline" onClick={onCancel}>
                <Icon name="X" size={16} className="mr-2" />
                Отмена
              </Button>
              {editingItem && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDelete(editingItem.id);
                    onCancel();
                  }}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить
                </Button>
              )}
              <Button 
                onClick={isCreating ? onCreate : onUpdate}
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
                onClick={() => onStartEdit(item)}
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
  );
};

export default ShopItemEditor;
