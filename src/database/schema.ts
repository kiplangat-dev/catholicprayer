// Simplified schema without complex imports

export interface Prayer {
  id: string;
  title: string;
  text: string;
  category: string;
  language: string;
  length: string;
  tags: string[];
  favorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reading {
  id: string;
  date: string;
  weekday: string;
  season: string;
  color: string;
  firstReading: BibleReading;
  psalm: PsalmReading;
  gospel: BibleReading;
  saint?: string;
}

export interface BibleReading {
  citation: string;
  text: string;
  book: string;
  chapter: number;
  verses: string;
}

export interface PsalmReading {
  citation: string;
  number: number;
  text: string;
  antiphon: string;
}

export interface RosaryMystery {
  id: string;
  mysteryType: string;
  number: number;
  title: string;
  scripture: string;
  reflection: string;
  fruit: string;
  prayer: string;
}

export interface Saint {
  id: string;
  name: string;
  feastDay: string;
  description: string;
  patronage: string[];
  prayer: string;
}

export interface LiturgicalHour {
  id: string;
  type: string;
  time: string;
  prayers: Prayer[];
}

export interface PrayerCategory {
  id: string;
  name: string;
  description: string;
}

export interface LiturgicalSeason {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
}

export interface RosaryMysteryType {
  id: string;
  name: string;
  description: string;
}

export interface LiturgicalHourType {
  id: string;
  name: string;
  description: string;
}