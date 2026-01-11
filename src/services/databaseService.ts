// Clean, simple database service for Catholic Prayer App

export interface Prayer {
  id: string;
  title: string;
  text: string;
  category: string;
  language: string;
  length: 'short' | 'medium' | 'long';
  tags: string[];
  favorite: boolean;
  timesPrayed: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Reading {
  date: string;
  weekday: string;
  season: string;
  color: string;
  firstReading: {
    citation: string;
    text: string;
    book: string;
    chapter: number;
    verses: string;
  };
  psalm: {
    citation: string;
    number: number;
    text: string;
    antiphon: string;
  };
  gospel: {
    citation: string;
    text: string;
    book: string;
    chapter: number;
    verses: string;
  };
  saint?: string;
}

export interface Saint {
  id: string;
  name: string;
  feastDay: string;
  description: string;
  patronage: string[];
  prayer: string;
  popularity: number;
}

export interface RosaryMystery {
  id: string;
  mysteryType: 'joyful' | 'sorrowful' | 'glorious' | 'luminous';
  number: number;
  title: string;
  scripture: string;
  reflection: string;
  fruit: string;
}

class DatabaseService {
  private prayers: Prayer[] = [];
  private readings: Reading[] = [];
  private saints: Saint[] = [];
  private rosaryMysteries: RosaryMystery[] = [];
  private isInitialized = false;

  async init(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      console.log('Initializing database...');
      
      // Initialize with sample data
      await this.initializeSampleData();
      
      this.isInitialized = true;
      console.log('Database initialized with', this.prayers.length, 'prayers');
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return false;
    }
  }

  private async initializeSampleData() {
    // Sample prayers
    this.prayers = [
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
        timesPrayed: 0,
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
        timesPrayed: 0,
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
        timesPrayed: 0,
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
        timesPrayed: 0,
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
        timesPrayed: 0,
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
        timesPrayed: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'act-of-contrition',
        title: 'Act of Contrition',
        text: `O my God, I am heartily sorry for having offended Thee,
and I detest all my sins because of thy just punishments,
but most of all because they offend Thee, my God,
who art all good and deserving of all my love.
I firmly resolve, with the help of Thy grace,
to sin no more and to avoid the near occasion of sin. Amen.`,
        category: 'sacraments',
        language: 'English',
        length: 'medium',
        tags: ['confession', 'penance', 'contrition'],
        favorite: false,
        timesPrayed: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'memorare',
        title: 'Memorare',
        text: `Remember, O most gracious Virgin Mary,
that never was it known that anyone who fled to your protection,
implored your help, or sought your intercession was left unaided.
Inspired by this confidence, I fly unto you,
O Virgin of virgins, my mother.
To you do I come, before you I stand, sinful and sorrowful.
O Mother of the Word Incarnate,
despise not my petitions,
but in your mercy hear and answer me. Amen.`,
        category: 'rosary',
        language: 'English',
        length: 'medium',
        tags: ['marian', 'intercession', 'urgent'],
        favorite: true,
        timesPrayed: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    // Sample readings
    const today = new Date().toISOString().split('T')[0];
    this.readings = [
      {
        date: today,
        weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
        season: 'ordinary-time',
        color: 'green',
        firstReading: {
          citation: 'Isaiah 40:1-5, 9-11',
          text: 'Comfort, give comfort to my people, says your God. Speak tenderly to Jerusalem, and proclaim to her that her service is at an end, her guilt is expiated; Indeed, she has received from the hand of the LORD double for all her sins.',
          book: 'Isaiah',
          chapter: 40,
          verses: '1-5, 9-11'
        },
        psalm: {
          citation: 'Psalm 85:9-10, 11-12, 13-14',
          number: 85,
          text: 'I will hear what God proclaims; the LORD—for he proclaims peace. Near indeed is his salvation to those who fear him, glory dwelling in our land.',
          antiphon: 'Lord, let us see your kindness, and grant us your salvation.'
        },
        gospel: {
          citation: 'John 1:19-28',
          text: 'This is the testimony of John. When the Jews from Jerusalem sent priests and Levites to ask him, "Who are you?" he admitted and did not deny it, but admitted, "I am not the Christ."',
          book: 'John',
          chapter: 1,
          verses: '19-28'
        },
        saint: 'St. John Neumann'
      }
    ];

    // Sample saints
    this.saints = [
      {
        id: 'mary-mother-god',
        name: 'Solemnity of Mary, Mother of God',
        feastDay: '01-01',
        description: 'The Blessed Virgin Mary is honored under this title for her role as the mother of Jesus Christ, the Son of God.',
        patronage: ['mothers', 'universal church', 'priests'],
        prayer: `Holy Mary, Mother of God,
pray for us sinners,
now and at the hour of our death.
Amen.`,
        popularity: 100
      },
      {
        id: 'john-neumann',
        name: 'St. John Neumann',
        feastDay: '01-05',
        description: 'Bishop and missionary known for his work with immigrants and establishing the Catholic school system in the United States.',
        patronage: ['immigrants', 'educators', 'bishops', 'Catholic education'],
        prayer: `O God, who called the Bishop Saint John Neumann,
renowned for his charity and pastoral service,
to shepherd your people in America,
grant by his intercession
that, as we foster the Christian education of youth
and are strengthened by the witness of brotherly love,
we may constantly increase the family of your Church.
Through our Lord Jesus Christ, your Son,
who lives and reigns with you in the unity of the Holy Spirit,
God, for ever and ever. Amen.`,
        popularity: 85
      }
    ];

    // Sample rosary mysteries
    this.rosaryMysteries = [
      {
        id: 'joyful-1',
        mysteryType: 'joyful',
        number: 1,
        title: 'The Annunciation',
        scripture: 'Luke 1:26-38',
        reflection: 'The angel Gabriel announces to Mary that she will conceive the Son of God.',
        fruit: 'Humility'
      },
      {
        id: 'joyful-2',
        mysteryType: 'joyful',
        number: 2,
        title: 'The Visitation',
        scripture: 'Luke 1:39-56',
        reflection: 'Mary visits her cousin Elizabeth, who recognizes her as the mother of the Lord.',
        fruit: 'Love of Neighbor'
      }
    ];
  }

  // ========== PRAYER METHODS ==========
  async getAllPrayers(): Promise<Prayer[]> {
    return [...this.prayers];
  }

  async getPrayersByCategory(category: string): Promise<Prayer[]> {
    return this.prayers.filter(prayer => prayer.category === category);
  }

  async getFavoritePrayers(): Promise<Prayer[]> {
    return this.prayers.filter(prayer => prayer.favorite);
  }

  async searchPrayers(query: string): Promise<Prayer[]> {
    const lowerQuery = query.toLowerCase();
    return this.prayers.filter(prayer =>
      prayer.title.toLowerCase().includes(lowerQuery) ||
      prayer.text.toLowerCase().includes(lowerQuery) ||
      prayer.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getPrayerById(id: string): Promise<Prayer | null> {
    return this.prayers.find(prayer => prayer.id === id) || null;
  }

  async toggleFavorite(prayerId: string): Promise<void> {
    const prayer = this.prayers.find(p => p.id === prayerId);
    if (prayer) {
      prayer.favorite = !prayer.favorite;
      prayer.updatedAt = new Date();
    }
  }

  async recordPrayer(prayerId: string): Promise<void> {
    const prayer = this.prayers.find(p => p.id === prayerId);
    if (prayer) {
      prayer.timesPrayed += 1;
      prayer.lastPrayedAt = new Date();
      prayer.updatedAt = new Date();
    }
  }

  // ========== READING METHODS ==========
  async getTodaysReading(): Promise<Reading | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.readings.find(reading => reading.date === today) || null;
  }

  async getReadingByDate(date: string): Promise<Reading | null> {
    return this.readings.find(reading => reading.date === date) || null;
  }

  // ========== SAINT METHODS ==========
  async getSaintByDate(date?: string): Promise<Saint | null> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const monthDay = targetDate.substring(5); // MM-DD
    return this.saints.find(saint => saint.feastDay === monthDay) || null;
  }

  async getSaintsByMonth(month: number): Promise<Saint[]> {
    const monthStr = month.toString().padStart(2, '0');
    return this.saints.filter(saint => saint.feastDay.startsWith(monthStr));
  }

  // ========== ROSARY METHODS ==========
  async getRosaryMysteries(type: 'joyful' | 'sorrowful' | 'glorious' | 'luminous'): Promise<RosaryMystery[]> {
    return this.rosaryMysteries.filter(mystery => mystery.mysteryType === type);
  }

  async getTodaysRosaryMystery(): Promise<'joyful' | 'sorrowful' | 'glorious' | 'luminous'> {
    const day = new Date().getDay();
    const days: ('joyful' | 'sorrowful' | 'glorious' | 'luminous')[] = [
      'glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'
    ];
    return days[day];
  }

  // ========== STATISTICS ==========
  async getStats() {
    return {
      totalPrayers: this.prayers.length,
      favoritePrayers: this.prayers.filter(p => p.favorite).length,
      totalReadings: this.readings.length,
      totalSaints: this.saints.length,
      totalUserPrayers: 0 // You can track this if you add user history
    };
  }

  async getPopularPrayers(limit: number = 10): Promise<Prayer[]> {
    return [...this.prayers]
      .sort((a, b) => b.timesPrayed - a.timesPrayed)
      .slice(0, limit);
  }

  // ========== ADDITIONAL DATA ==========
  async addPrayer(prayer: Omit<Prayer, 'id' | 'createdAt' | 'updatedAt' | 'timesPrayed'>): Promise<Prayer> {
    const newPrayer: Prayer = {
      ...prayer,
      id: `custom-${Date.now()}`,
      timesPrayed: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.prayers.push(newPrayer);
    return newPrayer;
  }
}

// Create and export singleton instance
export const databaseService = new DatabaseService();
