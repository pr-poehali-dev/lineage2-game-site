import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ShopFiltersProps {
  searchQuery: string;
  selectedType: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

const ShopFilters = ({
  searchQuery,
  selectedType,
  sortBy,
  onSearchChange,
  onTypeChange,
  onSortChange,
  onReset
}: ShopFiltersProps) => {
  return (
    <Card className="card-glow">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm">Поиск</Label>
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Название товара..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm">Тип</Label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="weapon">Оружие</SelectItem>
                <SelectItem value="armor">Броня</SelectItem>
                <SelectItem value="potion">Зелья</SelectItem>
                <SelectItem value="boost">Усиления</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort" className="text-sm">Сортировка</Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price-asc">Цена: дешевые</SelectItem>
                <SelectItem value="price-desc">Цена: дорогие</SelectItem>
                <SelectItem value="name-asc">Название: А-Я</SelectItem>
                <SelectItem value="name-desc">Название: Я-А</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="w-full"
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Сбросить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopFilters;
