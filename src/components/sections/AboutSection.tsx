import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { RaidBoss } from '@/components/types';

interface AboutSectionProps {
  raidBosses: RaidBoss[];
  onRaidsClick: () => void;
}

const AboutSection = ({ raidBosses, onRaidsClick }: AboutSectionProps) => {
  return (
    <section id="about" className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <h3 className="text-4xl font-bold mb-8 text-center text-glow">О ИГРЕ</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="card-glow hover-glow">
            <CardHeader>
              <Icon name="Users" size={40} className="text-primary mb-4" />
              <CardTitle>Массовые PvP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Осадные войны с участием сотен игроков. Захватывай замки и контролируй территории.
              </p>
            </CardContent>
          </Card>
          <Card className="card-glow hover-glow cursor-pointer" onClick={onRaidsClick}>
            <CardHeader>
              <Icon name="Swords" size={40} className="text-primary mb-4" />
              <CardTitle>Эпические рейды</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Сражайся с легендарными боссами: Баюм, Антарас, Валакас и другие драконы.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Боссов всего:</span>
                  <Badge variant="outline">{raidBosses.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Живых сейчас:</span>
                  <Badge className="bg-green-500">{raidBosses.filter(b => b.isAlive).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Убитых:</span>
                  <Badge className="bg-red-500">{raidBosses.filter(b => !b.isAlive).length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-glow hover-glow">
            <CardHeader>
              <Icon name="Trophy" size={40} className="text-primary mb-4" />
              <CardTitle>Система кланов</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Создай свой клан, объединяйся в альянсы и доминируй на сервере вместе с друзьями.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Shield" size={16} className="text-primary" />
                  <span className="text-muted-foreground">Осадные войны по субботам</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={16} className="text-primary" />
                  <span className="text-muted-foreground">До 40 членов в клане</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Crown" size={16} className="text-primary" />
                  <span className="text-muted-foreground">Уникальные клановые скиллы</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
