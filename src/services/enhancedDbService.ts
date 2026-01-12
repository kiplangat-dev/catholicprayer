// Enhanced database service with comprehensive prayer data
import { simpleDbService } from './simpleDbService';
import { usccbService } from './usccbService';

export class EnhancedDbService {
  private prayers = [
    // Basic Prayers
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
      description: 'The prayer Jesus taught his disciples'
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
      description: 'Traditional Catholic prayer to the Virgin Mary'
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
      description: 'Short prayer glorifying the Holy Trinity'
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
      category: 'creed',
      language: 'English',
      length: 'medium',
      tags: ['creed', 'belief', 'rosary', 'mass'],
      favorite: true,
      description: 'Profession of Christian faith'
    },
    {
      id: 'nicene-creed',
      title: 'Nicene Creed',
      text: `I believe in one God,
the Father almighty,
maker of heaven and earth,
of all things visible and invisible.

I believe in one Lord Jesus Christ,
the Only Begotten Son of God,
born of the Father before all ages.
God from God, Light from Light,
true God from true God,
begotten, not made,
consubstantial with the Father;
through him all things were made.
For us men and for our salvation
he came down from heaven...`,
      category: 'creed',
      language: 'English',
      length: 'long',
      tags: ['creed', 'mass', 'belief'],
      favorite: false,
      description: 'Profession of faith used in Mass'
    },
    // Morning Prayers
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
      tags: ['morning', 'offering', 'daily'],
      favorite: true,
      description: 'Prayer to offer the day to God'
    },
    {
      id: 'prayer-to-guardian-angel',
      title: 'Prayer to Guardian Angel',
      text: `Angel of God,
my guardian dear,
to whom God's love commits me here,
ever this day be at my side,
to light and guard, to rule and guide. Amen.`,
      category: 'morning',
      language: 'English',
      length: 'short',
      tags: ['morning', 'angel', 'protection'],
      favorite: false,
      description: 'Traditional prayer to one\'s guardian angel'
    },
    // Evening Prayers
    {
      id: 'evening-prayer',
      title: 'Evening Prayer',
      text: `Lord, thank you for the blessings of this day.
Forgine me for any wrong I have done.
Watch over me and my loved ones through the night.
May your angels protect us,
and may I wake refreshed to serve you tomorrow.
In Jesus' name. Amen.`,
      category: 'evening',
      language: 'English',
      length: 'short',
      tags: ['evening', 'night', 'protection', 'thanksgiving'],
      favorite: true,
      description: 'Simple prayer before sleep'
    },
    {
      id: 'examination-of-conscience',
      title: 'Examination of Conscience',
      text: `My God, I am heartily sorry for having offended you,
and I detest all my sins because of your just punishments,
but most of all because they offend you, my God,
who are all good and deserving of all my love.
I firmly resolve, with the help of your grace,
to sin no more and to avoid the near occasions of sin. Amen.`,
      category: 'evening',
      language: 'English',
      length: 'medium',
      tags: ['evening', 'examination', 'contrition', 'repentance'],
      favorite: false,
      description: 'Prayer for examining one\'s conscience'
    },
    // Marian Prayers
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
      category: 'marian',
      language: 'English',
      length: 'medium',
      tags: ['marian', 'intercession', 'urgent'],
      favorite: true,
      description: 'Traditional prayer seeking Mary\'s intercession'
    },
    {
      id: 'hail-holy-queen',
      title: 'Hail Holy Queen (Salve Regina)',
      text: `Hail, holy Queen, Mother of mercy,
our life, our sweetness, and our hope.
To you do we cry, poor banished children of Eve.
To you do we send up our sighs,
mourning and weeping in this valley of tears.
Turn then, most gracious advocate,
your eyes of mercy toward us,
and after this, our exile,
show unto us the blessed fruit of your womb, Jesus.
O clement, O loving, O sweet Virgin Mary.

Pray for us, O holy Mother of God,
that we may be made worthy of the promises of Christ.`,
      category: 'marian',
      language: 'English',
      length: 'medium',
      tags: ['marian', 'rosary', 'conclusion'],
      favorite: true,
      description: 'Traditional Marian prayer concluding the Rosary'
    },
    // Rosary Prayers
    {
      id: 'fatima-prayer',
      title: 'Fatima Prayer',
      text: `O my Jesus, forgive us our sins,
save us from the fires of hell,
lead all souls to Heaven,
especially those who are in most need of Thy mercy.`,
      category: 'rosary',
      language: 'English',
      length: 'short',
      tags: ['rosary', 'fatima', 'mercy'],
      favorite: false,
      description: 'Prayer from Our Lady of Fatima'
    },
    // Sacramental Prayers
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
      tags: ['confession', 'penance', 'contrition', 'sacraments'],
      favorite: true,
      description: 'Prayer of sorrow for sins'
    },
    {
      id: 'act-of-spiritual-communion',
      title: 'Act of Spiritual Communion',
      text: `My Jesus, I believe that You are present in the Most Holy Sacrament.
I love You above all things, and I desire to receive You into my soul.
Since I cannot at this moment receive You sacramentally,
come at least spiritually into my heart.
I embrace You as if You were already there
and unite myself wholly to You.
Never permit me to be separated from You. Amen.`,
      category: 'eucharist',
      language: 'English',
      length: 'medium',
      tags: ['eucharist', 'communion', 'spiritual'],
      favorite: true,
      description: 'Prayer for spiritual communion'
    },
    // Saints Prayers
    {
      id: 'prayer-to-st-michael',
      title: 'Prayer to St. Michael the Archangel',
      text: `St. Michael the Archangel,
defend us in battle.
Be our protection against the wickedness and snares of the devil.
May God rebuke him, we humbly pray,
and do thou, O Prince of the heavenly hosts,
by the power of God, cast into hell Satan,
and all the evil spirits,
who prowl about the world seeking the ruin of souls. Amen.`,
      category: 'saints',
      language: 'English',
      length: 'short',
      tags: ['st-michael', 'protection', 'spiritual-warfare', 'archangel'],
      favorite: true,
      description: 'Powerful prayer for protection against evil'
    },
    {
      id: 'prayer-to-st-joseph',
      title: 'Prayer to St. Joseph',
      text: `O St. Joseph, whose protection is so great, so strong, so prompt before the throne of God,
I place in you all my interests and desires.
O St. Joseph, do assist me by your powerful intercession,
and obtain for me from your divine Son all spiritual blessings,
through Jesus Christ, our Lord.
So that, having engaged here below your heavenly power,
I may offer my thanksgiving and homage to the most loving of Fathers.

O St. Joseph, I never weary contemplating you, and Jesus asleep in your arms;
I dare not approach while He reposes near your heart.
Press Him in my name and kiss His fine head for me and ask Him to return the kiss when I draw my dying breath.
St. Joseph, Patron of departing souls, pray for me. Amen.`,
      category: 'saints',
      language: 'English',
      length: 'long',
      tags: ['st-joseph', 'patron', 'family', 'workers'],
      favorite: false,
      description: 'Traditional prayer to St. Joseph'
    },
    // Healing Prayers
    {
      id: 'prayer-for-healing',
      title: 'Prayer for Healing',
      text: `Lord, You are the Divine Physician,
the Healer of our souls and bodies.
I come before You today asking for Your healing touch.
Whatever illness or suffering I am experiencing,
I place it in Your hands.
Grant me patience in my suffering,
and if it be Your will, restore me to health.
But above all, grant me the grace to say,
"Your will be done."
May my suffering be united with Yours on the cross
for the salvation of souls. Amen.`,
      category: 'healing',
      language: 'English',
      length: 'medium',
      tags: ['healing', 'health', 'sickness', 'suffering'],
      favorite: false,
      description: 'Prayer for physical and spiritual healing'
    },
    // Thanksgiving Prayers
    {
      id: 'prayer-of-thanksgiving',
      title: 'Prayer of Thanksgiving',
      text: `We give You thanks for all Your gifts, Almighty God,
living and reigning now and for ever. Amen.`,
      category: 'thanksgiving',
      language: 'English',
      length: 'short',
      tags: ['thanksgiving', 'gratitude', 'blessings'],
      favorite: false,
      description: 'Simple prayer of thanksgiving'
    },
    // Family Prayers
    {
      id: 'family-prayer',
      title: 'Family Prayer',
      text: `Heavenly Father, we come before You as a family.
Bless each member of our family.
Keep us safe in Your love.
Help us to love and support one another,
to forgive each other's faults,
and to grow in holiness together.
May our home be a place of peace, joy, and faith.
We ask this through Christ our Lord. Amen.`,
      category: 'family',
      language: 'English',
      length: 'short',
      tags: ['family', 'home', 'parents', 'children'],
      favorite: false,
      description: 'Prayer for family unity and blessings'
    },
    // Latin Prayers
    {
      id: 'pater-noster',
      title: 'Pater Noster (Our Father in Latin)',
      text: `Pater noster, qui es in caelis,
sanctificetur nomen tuum.
Adveniat regnum tuum.
Fiat voluntas tua,
sicut in caelo et in terra.
Panem nostrum quotidianum da nobis hodie,
et dimitte nobis debita nostra,
sicut et nos dimittimus debitoribus nostris.
Et ne nos inducas in tentationem,
sed libera nos a malo. Amen.`,
      category: 'latin',
      language: 'Latin',
      length: 'short',
      tags: ['latin', 'traditional', 'mass'],
      favorite: false,
      description: 'Our Father in traditional Latin'
    },
    {
      id: 'ave-maria-latin',
      title: 'Ave Maria (Hail Mary in Latin)',
      text: `Ave Maria, gratia plena,
Dominus tecum.
Benedicta tu in mulieribus,
et benedictus fructus ventris tui, Iesus.
Sancta Maria, Mater Dei,
ora pro nobis peccatoribus,
nunc et in hora mortis nostrae. Amen.`,
      category: 'latin',
      language: 'Latin',
      length: 'short',
      tags: ['latin', 'marian', 'rosary'],
      favorite: false,
      description: 'Hail Mary in traditional Latin'
    }
  ];

  // Rosary mysteries data
  private rosaryMysteries = {
    joyful: [
      { title: 'The Annunciation', scripture: 'Luke 1:26-38', fruit: 'Humility' },
      { title: 'The Visitation', scripture: 'Luke 1:39-56', fruit: 'Love of Neighbor' },
      { title: 'The Nativity', scripture: 'Luke 2:1-20', fruit: 'Poverty' },
      { title: 'The Presentation', scripture: 'Luke 2:22-40', fruit: 'Obedience' },
      { title: 'The Finding in the Temple', scripture: 'Luke 2:41-52', fruit: 'Joy in Finding Jesus' }
    ],
    sorrowful: [
      { title: 'The Agony in the Garden', scripture: 'Matthew 26:36-46', fruit: 'Sorrow for Sin' },
      { title: 'The Scourging at the Pillar', scripture: 'John 19:1', fruit: 'Purity' },
      { title: 'The Crowning with Thorns', scripture: 'Matthew 27:27-31', fruit: 'Moral Courage' },
      { title: 'The Carrying of the Cross', scripture: 'Luke 23:26-32', fruit: 'Patience' },
      { title: 'The Crucifixion', scripture: 'Luke 23:33-46', fruit: 'Perseverance' }
    ],
    glorious: [
      { title: 'The Resurrection', scripture: 'Matthew 28:1-10', fruit: 'Faith' },
      { title: 'The Ascension', scripture: 'Acts 1:6-11', fruit: 'Hope' },
      { title: 'The Descent of the Holy Spirit', scripture: 'Acts 2:1-4', fruit: 'Love' },
      { title: 'The Assumption', scripture: 'Revelation 12:1', fruit: 'Grace of a Happy Death' },
      { title: 'The Coronation', scripture: 'Revelation 12:1', fruit: 'Trust in Mary\'s Intercession' }
    ],
    luminous: [
      { title: 'The Baptism of Jesus', scripture: 'Matthew 3:13-17', fruit: 'Openness to the Holy Spirit' },
      { title: 'The Wedding at Cana', scripture: 'John 2:1-11', fruit: 'To Jesus through Mary' },
      { title: 'The Proclamation of the Kingdom', scripture: 'Mark 1:14-15', fruit: 'Repentance and Trust in God' },
      { title: 'The Transfiguration', scripture: 'Luke 9:28-36', fruit: 'Desire for Holiness' },
      { title: 'The Institution of the Eucharist', scripture: 'Luke 22:14-20', fruit: 'Adoration' }
    ]
  };

  // Saints data
  private saints = [
    { id: 'mary-mother-god', name: 'Solemnity of Mary, Mother of God', feastDay: '01-01', description: 'Honors Mary as the Mother of God', patronage: ['mothers', 'universal church'] },
    { id: 'john-neumann', name: 'St. John Neumann', feastDay: '01-05', description: 'Bishop and missionary to immigrants', patronage: ['immigrants', 'educators'] },
    { id: 'francis-de-sales', name: 'St. Francis de Sales', feastDay: '01-24', description: 'Bishop and Doctor of the Church', patronage: ['writers', 'journalists'] },
    { id: 'thomas-aquinas', name: 'St. Thomas Aquinas', feastDay: '01-28', description: 'Doctor of the Church, philosopher', patronage: ['students', 'universities'] },
    { id: 'valentine', name: 'St. Valentine', feastDay: '02-14', description: 'Martyr, patron of love', patronage: ['love', 'happy marriages'] },
    { id: 'joseph', name: 'St. Joseph', feastDay: '03-19', description: 'Husband of Mary, foster father of Jesus', patronage: ['workers', 'fathers', 'the Church'] },
    { id: 'patrick', name: 'St. Patrick', feastDay: '03-17', description: 'Apostle of Ireland', patronage: ['Ireland', 'engineers'] },
    { id: 'therese-lisieux', name: 'St. Therese of Lisieux', feastDay: '10-01', description: 'Doctor of the Church, Little Flower', patronage: ['missionaries', 'florists'] },
    { id: 'francis-assisi', name: 'St. Francis of Assisi', feastDay: '10-04', description: 'Founder of Franciscan Order', patronage: ['animals', 'ecology'] },
    { id: 'teresa-calcutta', name: 'St. Teresa of Calcutta', feastDay: '09-05', description: 'Founder of Missionaries of Charity', patronage: ['the poor', 'volunteers'] }
  ];

  async init() {
    console.log('Enhanced DB initialized with', this.prayers.length, 'prayers');
    return true;
  }

  async getAllPrayers() {
    return this.prayers;
  }

  async getPrayersByCategory(category: string) {
    return this.prayers.filter(prayer => prayer.category === category);
  }

  async getCategories() {
    const categories = new Set(this.prayers.map(p => p.category));
    return Array.from(categories);
  }

  async searchPrayers(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.prayers.filter(prayer => 
      prayer.title.toLowerCase().includes(lowerQuery) ||
      prayer.text.toLowerCase().includes(lowerQuery) ||
      prayer.description?.toLowerCase().includes(lowerQuery) ||
      prayer.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getStats() {
    return {
      totalPrayers: this.prayers.length,
      totalReadings: 0,
      totalSaints: this.saints.length,
      favoritePrayers: this.prayers.filter(p => p.favorite).length,
      categories: this.prayers.reduce((acc, prayer) => {
        acc[prayer.category] = (acc[prayer.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  async toggleFavorite(prayerId: string) {
    const prayer = this.prayers.find(p => p.id === prayerId);
    if (prayer) {
      prayer.favorite = !prayer.favorite;
      return true;
    }
    return false;
  }

  async getRosaryMysteries(type: string) {
    return this.rosaryMysteries[type as keyof typeof this.rosaryMysteries] || [];
  }

  async getTodaysRosaryMystery() {
    const day = new Date().getDay();
    const days = ['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'];
    return days[day];
  }

  async getSaints() {
    return this.saints;
  }

  async getSaintByDate(date?: string) {
    const today = date || new Date().toISOString().split('T')[0];
    const monthDay = today.substring(5); // MM-DD
    
    // Find saint for today or return a default
    const saint = this.saints.find(s => s.feastDay === monthDay);
    if (saint) return saint;
    
    // Default saint for today
    return {
      id: 'default',
      name: 'All Saints',
      feastDay: monthDay,
      description: 'Today we remember all the saints who inspire our faith journey.',
      patronage: ['all needs']
    };
  }

  async getSaintsByMonth(month: number) {
    const monthStr = month.toString().padStart(2, '0');
    return this.saints.filter(s => s.feastDay.startsWith(monthStr));
  }

  async addCustomPrayer(prayerData: any) {
    const newPrayer = {
      id: `custom-${Date.now()}`,
      ...prayerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.prayers.push(newPrayer);
    return newPrayer;
  }

  async getDailyReading(date?: Date) {
    try {
      // Try to fetch from USCCB
      const usccbReading = await import('./usccbService').then(module => 
        module.usccbService.getDailyReading(date)
      );
      
      if (usccbReading) {
        // Merge with saint data
        const saint = await this.getSaintByDate(usccbReading.date);
        return {
          ...usccbReading,
          saint: saint || await this.getSaintByDate()
        };
      }
    } catch (error) {
      console.log('Using fallback reading:', error);
    }
    
    // Fallback to local data
    const today = date || new Date();
    const saint = await this.getSaintByDate(today.toISOString().split('T')[0]);
    
    return {
      date: today.toISOString().split('T')[0],
      weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()],
      season: this.getLiturgicalSeason(today),
      color: this.getLiturgicalColor(today),
      firstReading: {
        citation: 'Isaiah 40:1-5, 9-11',
        text: 'Comfort, give comfort to my people, says your God. Speak tenderly to Jerusalem, and proclaim to her that her service is at an end, her guilt is expiated.'
      },
      psalm: {
        citation: 'Psalm 85:9-14',
        text: 'I will hear what God proclaims; the LORD—for he proclaims peace. Near indeed is his salvation to those who fear him.',
        antiphon: 'Lord, let us see your kindness, and grant us your salvation.'
      },
      gospel: {
        citation: 'John 1:19-28',
        text: 'This is the testimony of John. When the Jews from Jerusalem sent priests and Levites to ask him, "Who are you?" he admitted and did not deny it, but admitted, "I am not the Christ."'
      },
      saint: saint
    };
  }

  private getLiturgicalColor(date: Date): string {
    const season = this.getLiturgicalSeason(date);
    switch (season) {
      case 'Advent': return 'purple';
      case 'Christmas': return 'white';
      case 'Lent': return 'purple';
      case 'Easter': return 'white';
      default: return 'green';
    }
  }
  // private getLiturgicalSeason(date: Date): string {
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
    
  //   if ((month === 12 && day >= 25) || (month === 1 && day <= 8)) return 'Christmas';
  //   if (month === 1 && day <= 9) return 'Christmas';
  //   if (month === 3 && day >= 22 && day <= 31) return 'Lent';
  //   if (month === 4 && day <= 30) return 'Easter';
  //   if (month === 5 && day <= 23) return 'Easter';
  //   if (month === 12 && day >= 1 && day <= 24) return 'Advent';
  //   return 'Ordinary Time';
  // }
}

export const enhancedDbService = new EnhancedDbService();
