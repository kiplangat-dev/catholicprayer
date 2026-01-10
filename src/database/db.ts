import Dexie, { type EntityTable } from 'dexie';
import { 
  Prayer, Reading, RosaryMystery, Saint
} from './schema';

class CatholicPrayerDB extends Dexie {
  prayers!: EntityTable<Prayer, 'id'>;
  readings!: EntityTable<Reading, 'id'>;
  rosaryMysteries!: EntityTable<RosaryMystery, 'id'>;
  saints!: EntityTable<Saint, 'id'>;
  userFavorites!: EntityTable<{id: string, type: string, itemId: string, createdAt: Date}, 'id'>;
  userNotes!: EntityTable<{id: string, type: string, itemId: string, note: string, createdAt: Date}, 'id'>;
  appSettings!: EntityTable<{id: string, key: string, value: any, updatedAt: Date}, 'id'>;

  constructor() {
    super('CatholicPrayerDB');
    
    this.version(1).stores({
      prayers: '++id, category, language, favorite, createdAt',
      readings: '++id, date, weekday, season',
      rosaryMysteries: '++id, mysteryType, number',
      saints: '++id, feastDay, name',
      userFavorites: '++id, type, itemId, createdAt',
      userNotes: '++id, type, itemId, createdAt',
      appSettings: '++id, key, updatedAt'
    });
  }
  
  // Helper methods
  async getPrayersByCategory(category: string): Promise<Prayer[]> {
    return await this.prayers
      .where('category')
      .equals(category)
      .toArray();
  }
  
  async getFavoritePrayers(): Promise<Prayer[]> {
    return await this.prayers
      .where('favorite')
      .equals(1)
      .toArray();
  }
  
  async getTodaysReading(dateStr: string = new Date().toISOString().split('T')[0]): Promise<Reading | undefined> {
    return await this.readings
      .where('date')
      .equals(dateStr)
      .first();
  }
  
  async getSaintByDate(dateStr: string): Promise<Saint | undefined> {
    const monthDay = dateStr.substring(5); // MM-DD
    return await this.saints
      .where('feastDay')
      .equals(monthDay)
      .first();
  }
  
  async getRosaryMysteries(type: string): Promise<RosaryMystery[]> {
    return await this.rosaryMysteries
      .where('mysteryType')
      .equals(type)
      .toArray();
  }
  
  async getAppSetting(key: string): Promise<any> {
    const setting = await this.appSettings
      .where('key')
      .equals(key)
      .first();
    return setting?.value;
  }
  
  async setAppSetting(key: string, value: any): Promise<void> {
    await this.appSettings.put({
      id: key,
      key,
      value,
      updatedAt: new Date()
    });
  }
}

export const db = new CatholicPrayerDB();
