import { db } from '../database/db';
import type { 
  Prayer, Reading, RosaryMystery, Saint, LiturgicalHour,
  PrayerCategory, LiturgicalSeason, RosaryMysteryType, LiturgicalHourType
} from '../database/schema';

class DatabaseService {
  // Initialization
  async init(): Promise<boolean> {
    try {
      // Check if we already initialized
      const initialized = await db.getAppSetting('initialized');
      
      if (!initialized) {
        console.log('Initializing database with basic data...');
        
        // Add basic prayers directly
        const basicPrayers: Prayer[] = [
          {
            id: 'our-father',
            title: 'Our Father (The Lord\'s Prayer)',
            text: `Our Father, who art in heaven,
hallowed be thy name;
thy kingdom come;
thy will be done on earth as it is in heaven.
Give us this day our daily bread;
and forgive us our trespasses
as we forgive those who trespass against us;
and lead us not into temptation,
but deliver us from evil. Amen.`,
            category: 'daily',
            language: 'English',
            length: 'short',
            tags: ['basic', 'essential', 'mass', 'rosary'],
            favorite: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'hail-mary',
            title: 'Hail Mary',
            text: `Hail Mary, full of grace,
the Lord is with thee.
Blessed art thou among women,
and blessed is the fruit of thy womb, Jesus.
Holy Mary, Mother of God,
pray for us sinners,
now and at the hour of our death. Amen.`,
            category: 'daily',
            language: 'English',
            length: 'short',
            tags: ['basic', 'essential', 'rosary', 'marian'],
            favorite: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'glory-be',
            title: 'Glory Be (Doxology)',
            text: `Glory be to the Father,
and to the Son,
and to the Holy Spirit.
As it was in the beginning,
is now, and ever shall be,
world without end. Amen.`,
            category: 'daily',
            language: 'English',
            length: 'short',
            tags: ['basic', 'trinity', 'mass', 'rosary'],
            favorite: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'apostles-creed',
            title: 'Apostles\' Creed',
            text: `I believe in God, the Father almighty,
Creator of heaven and earth,
and in Jesus Christ, his only Son, our Lord,
who was conceived by the Holy Spirit,
born of the Virgin Mary,
suffered under Pontius Pilate,
was crucified, died and was buried;
he descended into hell;
on the third day he rose again from the dead;
he ascended into heaven,
and is seated at the right hand of God the Father almighty;
from there he will come to judge the living and the dead.

I believe in the Holy Spirit,
the holy catholic Church,
the communion of saints,
the forgiveness of sins,
the resurrection of the body,
and life everlasting. Amen.`,
            category: 'daily',
            language: 'English',
            length: 'medium',
            tags: ['creed', 'belief', 'rosary', 'mass'],
            favorite: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'morning-offering',
            title: 'Morning Offering',
            text: `O Jesus, through the Immaculate Heart of Mary,
I offer you my prayers, works, joys, and sufferings of this day
for all the intentions of your Sacred Heart,
in union with the Holy Sacrifice of the Mass throughout the world,
for the salvation of souls, the reparation of sins,
the reunion of all Christians,
and in particular for the intentions of the Holy Father this month. Amen.`,
            category: 'morning',
            language: 'English',
            length: 'medium',
            tags: ['offering', 'consecration', 'daily'],
            favorite: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'evening-prayer',
            title: 'Evening Prayer',
            text: `Lord, thank you for the blessings of this day.
Forgive me for any wrong I have done.
Watch over me and my loved ones through the night.
May your angels protect us,
and may I wake refreshed to serve you tomorrow.
In Jesus' name. Amen.`,
            category: 'evening',
            language: 'English',
            length: 'short',
            tags: ['night', 'protection', 'thanksgiving'],
            favorite: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        await db.transaction('rw', db.prayers, db.appSettings, async () => {
          await db.prayers.bulkAdd(basicPrayers);
          await db.setAppSetting('initialized', true);
          await db.setAppSetting('lastUpdated', new Date().toISOString());
        });

        console.log('Database initialized with', basicPrayers.length, 'prayers');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return false;
    }
  }

  // Prayers
  async getAllPrayers(): Promise<Prayer[]> {
    try {
      return await db.prayers.toArray();
    } catch (error) {
      console.error('Error getting all prayers:', error);
      return [];
    }
  }

  async getPrayersByCategory(category: PrayerCategory): Promise<Prayer[]> {
    try {
      return await db.prayers
        .where('category')
        .equals(category)
        .toArray();
    } catch (error) {
      console.error('Error getting prayers by category:', error);
      return [];
    }
  }

  async getFavoritePrayers(): Promise<Prayer[]> {
    try {
      return await db.prayers
        .where('favorite')
        .equals(1)
        .toArray();
    } catch (error) {
      console.error('Error getting favorite prayers:', error);
      return [];
    }
  }

  async searchPrayers(query: string): Promise<Prayer[]> {
    try {
      const allPrayers = await this.getAllPrayers();
      const lowerQuery = query.toLowerCase();
      
      return allPrayers.filter(prayer => 
        prayer.title.toLowerCase().includes(lowerQuery) ||
        prayer.text.toLowerCase().includes(lowerQuery) ||
        prayer.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching prayers:', error);
      return [];
    }
  }

  async toggleFavorite(prayerId: string): Promise<void> {
    try {
      const prayer = await db.prayers.get(prayerId);
      if (prayer) {
        await db.prayers.update(prayerId, { 
          favorite: !prayer.favorite,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  // Readings
  async getTodaysReading(): Promise<Reading | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.getReadingByDate(today);
    } catch (error) {
      console.error('Error getting today\'s reading:', error);
      return null;
    }
  }

  async getReadingByDate(date: string): Promise<Reading | null> {
    try {
      // For now, return a default reading
      // In a real app, you would fetch from your database
      return {
        id: date,
        date: date,
        weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
        season: 'ordinary-time',
        color: 'green',
        firstReading: {
          citation: 'Isaiah 40:1-5, 9-11',
          text: 'Comfort, give comfort to my people, says your God. Speak tenderly to Jerusalem, and proclaim to her...',
          book: 'Isaiah',
          chapter: 40,
          verses: '1-5, 9-11'
        },
        psalm: {
          citation: 'Psalm 85:9-10, 11-12, 13-14',
          number: 85,
          text: 'I will hear what God proclaims; the LORD—for he proclaims peace. Near indeed is his salvation...',
          antiphon: 'Lord, let us see your kindness, and grant us your salvation.'
        },
        gospel: {
          citation: 'John 1:19-28',
          text: 'This is the testimony of John. When the Jews from Jerusalem sent priests and Levites to ask him, "Who are you?"...',
          book: 'John',
          chapter: 1,
          verses: '19-28'
        },
        saint: 'St. John Neumann - Bishop and missionary'
      };
    } catch (error) {
      console.error('Error getting reading by date:', error);
      return null;
    }
  }

  // Rosary
  async getRosaryMysteries(type: RosaryMysteryType): Promise<RosaryMystery[]> {
    try {
      // Default mysteries
      const mysteries: RosaryMystery[] = [
        {
          id: 'joyful-1',
          mysteryType: 'joyful',
          number: 1,
          title: 'The Annunciation',
          scripture: 'Luke 1:26-38',
          reflection: 'The angel Gabriel announces to Mary that she will conceive the Son of God. Mary\'s "yes" shows complete trust.',
          fruit: 'Humility',
          prayer: 'Hail Mary, full of grace...'
        },
        {
          id: 'joyful-2',
          mysteryType: 'joyful',
          number: 2,
          title: 'The Visitation',
          scripture: 'Luke 1:39-56',
          reflection: 'Mary visits her cousin Elizabeth, who recognizes her as the mother of the Lord.',
          fruit: 'Love of Neighbor',
          prayer: 'Hail Mary, full of grace...'
        }
      ];
      
      return mysteries.filter(m => m.mysteryType === type);
    } catch (error) {
      console.error('Error getting rosary mysteries:', error);
      return [];
    }
  }

  async getTodaysRosaryMystery(): Promise<RosaryMysteryType> {
    const day = new Date().getDay();
    const days: RosaryMysteryType[] = ['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'];
    return days[day] as RosaryMysteryType;
  }

  // Saints
  async getSaintByDate(date?: string): Promise<Saint | null> {
    try {
      // Default saint for today
      return {
        id: 'john-neumann',
        name: 'St. John Neumann',
        feastDay: '01-05',
        description: 'Bishop and missionary known for his work with immigrants and establishing the Catholic school system in the United States.',
        patronage: ['Immigrants', 'Educators', 'Bishops'],
        prayer: `O God, who called the Bishop Saint John Neumann,
renowned for his charity and pastoral service,
to shepherd your people in America,
grant by his intercession
that, as we foster the Christian education of youth
and are strengthened by the witness of brotherly love,
we may constantly increase the family of your Church.
Through our Lord Jesus Christ, your Son,
who lives and reigns with you in the unity of the Holy Spirit,
God, for ever and ever. Amen.`
      };
    } catch (error) {
      console.error('Error getting saint by date:', error);
      return null;
    }
  }

  async getSaintsByMonth(month: number): Promise<Saint[]> {
    try {
      const saints: Saint[] = [
        {
          id: 'mary-mother-god',
          name: 'Solemnity of Mary, Mother of God',
          feastDay: '01-01',
          description: 'The Blessed Virgin Mary is honored under this title for her role as the mother of Jesus Christ.',
          patronage: ['mothers', 'universal church'],
          prayer: 'Holy Mary, Mother of God, pray for us sinners...'
        },
        {
          id: 'john-neumann',
          name: 'St. John Neumann',
          feastDay: '01-05',
          description: 'Bishop and missionary known for his work with immigrants and Catholic education.',
          patronage: ['Immigrants', 'Educators', 'Bishops'],
          prayer: 'Prayer to St. John Neumann...'
        }
      ];
      
      const monthStr = month.toString().padStart(2, '0');
      return saints.filter(s => s.feastDay.startsWith(monthStr));
    } catch (error) {
      console.error('Error getting saints by month:', error);
      return [];
    }
  }

  // Statistics
  async getStats(): Promise<{
    totalPrayers: number;
    totalReadings: number;
    totalSaints: number;
    favoritePrayers: number;
  }> {
    try {
      const totalPrayers = await db.prayers.count();
      const favoritePrayers = await db.prayers.where('favorite').equals(1).count();
      
      return {
        totalPrayers,
        totalReadings: 0, // You can add readings count if you have them
        totalSaints: 0,   // You can add saints count if you have them
        favoritePrayers
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalPrayers: 0,
        totalReadings: 0,
        totalSaints: 0,
        favoritePrayers: 0
      };
    }
  }

  // App Settings
  async getAppSetting(key: string): Promise<any> {
    try {
      return await db.getAppSetting(key);
    } catch (error) {
      console.error('Error getting app setting:', error);
      return null;
    }
  }

  async setAppSetting(key: string, value: any): Promise<void> {
    try {
      await db.setAppSetting(key, value);
    } catch (error) {
      console.error('Error setting app setting:', error);
    }
  }
}

export const databaseService = new DatabaseService();
