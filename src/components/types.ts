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
  coins?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  type: 'weapon' | 'armor' | 'potion' | 'boost';
  imageUrl?: string;
}

export interface RaidBoss {
  id: string;
  name: string;
  level: number;
  respawnTime: string;
  isAlive: boolean;
  location: string;
  nextRespawn?: string;
}

export interface ClassStat {
  class: string;
  count: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastReply: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

export interface PlayerOnMap {
  id: string;
  username: string;
  level: number;
  class: string;
  x: number;
  y: number;
  location: string;
  isOnline: boolean;
}