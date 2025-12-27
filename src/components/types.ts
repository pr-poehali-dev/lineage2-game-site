export interface GameClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'warrior' | 'mage' | 'archer';
}

export interface Location {
  id: string;
  name: string;
  level: string;
  type: 'town' | 'dungeon' | 'field';
  x: number;
  y: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  class: string;
  score: number;
}

export interface LoggedPlayer {
  id: number;
  username: string;
  email: string;
  character_class: string;
  level: number;
  experience: number;
}

export interface ClassStat {
  class: string;
  count: number;
}
