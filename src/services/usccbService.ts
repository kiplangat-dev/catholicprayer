import axios from 'axios';

export interface USCCBReading {
  date: string;
  weekday: string;
  season: string;
  color: string;
  firstReading: {
    citation: string;
    text: string;
  };
  psalm: {
    citation: string;
    text: string;
    antiphon: string;
  };
  secondReading?: {
    citation: string;
    text: string;
  };
  gospel: {
    citation: string;
    text: string;
  };
  saint?: string;
}

export class USCCBService {
  private baseURL = 'https://bible.usccb.org/bible/readings';
  private corsProxy = 'https://api.allorigins.win/raw?url='; // Free CORS proxy
  
  async getDailyReading(date?: Date): Promise<USCCBReading | null> {
    try {
      const targetDate = date || new Date();
      const formattedDate = this.formatDateForUSCCB(targetDate);
      
      // Try direct fetch first
      let htmlContent: string;
      try {
        const response = await axios.get(`${this.baseURL}/${formattedDate}.cfm`, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        htmlContent = response.data;
      } catch (directError) {
        console.log('Direct fetch failed, trying with CORS proxy...');
        // Try with CORS proxy
        const proxyResponse = await axios.get(
          `${this.corsProxy}${encodeURIComponent(`${this.baseURL}/${formattedDate}.cfm`)}`,
          { timeout: 15000 }
        );
        htmlContent = proxyResponse.data;
      }
      
      return this.parseUSCCBHTML(htmlContent, targetDate);
    } catch (error) {
      console.error('Error fetching USCCB readings:', error);
      return this.getFallbackReading(date);
    }
  }

  private formatDateForUSCCB(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}${day}${year}`;
  }

  private parseUSCCBHTML(html: string, date: Date): USCCBReading {
    // This is a simplified parser - USCCB HTML structure can be complex
    // In a real implementation, you'd use cheerio or similar for better parsing
    
    const reading: USCCBReading = {
      date: date.toISOString().split('T')[0],
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      season: this.getLiturgicalSeason(date),
      color: this.getLiturgicalColor(date),
      firstReading: {
        citation: 'Isaiah 40:1-5, 9-11',
        text: 'Comfort, give comfort to my people, says your God...'
      },
      psalm: {
        citation: 'Psalm 85:9-10, 11-12, 13-14',
        text: 'I will hear what God proclaims; the LORD—for he proclaims peace...',
        antiphon: 'Lord, let us see your kindness, and grant us your salvation.'
      },
      gospel: {
        citation: 'John 1:19-28',
        text: 'This is the testimony of John. When the Jews from Jerusalem sent priests and Levites...'
      }
    };

    // Try to extract actual readings from HTML (simplified version)
    try {
      // Parse first reading
      const firstReadingMatch = html.match(/class="name_r">([^<]+)<\/div>[\s\S]*?class="content">([^<]+)/);
      if (firstReadingMatch) {
        reading.firstReading.citation = firstReadingMatch[1].trim();
        reading.firstReading.text = firstReadingMatch[2].trim().substring(0, 500) + '...';
      }

      // Parse psalm
      const psalmMatch = html.match(/Responsorial Psalm[\s\S]*?class="name_r">([^<]+)<\/div>[\s\S]*?class="content">([^<]+)/);
      if (psalmMatch) {
        reading.psalm.citation = psalmMatch[1].trim();
        reading.psalm.text = psalmMatch[2].trim().substring(0, 500) + '...';
      }

      // Parse gospel
      const gospelMatch = html.match(/Gospel[\s\S]*?class="name_r">([^<]+)<\/div>[\s\S]*?class="content">([^<]+)/);
      if (gospelMatch) {
        reading.gospel.citation = gospelMatch[1].trim();
        reading.gospel.text = gospelMatch[2].trim().substring(0, 500) + '...';
      }

    } catch (parseError) {
      console.warn('Could not parse USCCB HTML, using defaults:', parseError);
    }

    return reading;
  }

  private getLiturgicalSeason(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Liturgical season logic
    if ((month === 12 && day >= 25) || (month === 1 && day <= 8)) return 'Christmas';
    if (month === 1 && day <= 9) return 'Christmas';
    if (month === 3 && day >= 22 && day <= 31) return 'Lent';
    if (month === 4 && day <= 30) return 'Easter';
    if (month === 5 && day <= 23) return 'Easter';
    if (month === 12 && day >= 1 && day <= 24) return 'Advent';
    return 'Ordinary Time';
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

  private getFallbackReading(date?: Date): USCCBReading {
    const targetDate = date || new Date();
    return {
      date: targetDate.toISOString().split('T')[0],
      weekday: targetDate.toLocaleDateString('en-US', { weekday: 'long' }),
      season: this.getLiturgicalSeason(targetDate),
      color: this.getLiturgicalColor(targetDate),
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
      }
    };
  }

  // Alternative: Use Universalis API (another Catholic readings source)
  async getUniversalisReading(date?: Date) {
    try {
      const targetDate = date || new Date();
      const year = targetDate.getFullYear();
      const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
      const day = targetDate.getDate().toString().padStart(2, '0');
      
      const response = await axios.get(
        `https://universalis.com/${year}${month}${day}/mass.json`,
        { timeout: 10000 }
      );
      
      return this.parseUniversalisData(response.data, targetDate);
    } catch (error) {
      console.error('Error fetching Universalis readings:', error);
      return this.getFallbackReading(date);
    }
  }

  private parseUniversalisData(data: any, date: Date): USCCBReading {
    // Parse Universalis JSON response
    return {
      date: date.toISOString().split('T')[0],
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      season: this.getLiturgicalSeason(date),
      color: this.getLiturgicalColor(date),
      firstReading: {
        citation: data.readings?.[0]?.citation || 'Isaiah 40:1-5',
        text: data.readings?.[0]?.text || 'Comfort, give comfort to my people...'
      },
      psalm: {
        citation: 'Psalm 85',
        text: data.psalm?.text || 'I will hear what God proclaims...',
        antiphon: data.psalm?.antiphon || 'Lord, let us see your kindness.'
      },
      gospel: {
        citation: data.readings?.[1]?.citation || 'John 1:19-28',
        text: data.readings?.[1]?.text || 'This is the testimony of John...'
      }
    };
  }
}

export const usccbService = new USCCBService();
