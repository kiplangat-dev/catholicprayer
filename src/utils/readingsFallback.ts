// Fallback readings data for when USCCB is unavailable
export const fallbackReadings = {
  // Sample readings for different seasons
  advent: {
    season: 'Advent',
    color: 'purple',
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
  },
  christmas: {
    season: 'Christmas',
    color: 'white',
    firstReading: {
      citation: 'Isaiah 9:1-6',
      text: 'The people who walked in darkness have seen a great light; upon those who dwelt in the land of gloom a light has shone.'
    },
    psalm: {
      citation: 'Psalm 96: 1-3, 11-13',
      text: 'Today is born our Savior, Christ the Lord.',
      antiphon: 'Today is born our Savior, Christ the Lord.'
    },
    gospel: {
      citation: 'Luke 2:1-14',
      text: 'In those days a decree went out from Caesar Augustus that the whole world should be enrolled.'
    }
  },
  // Add more seasons as needed
};

export function getFallbackReading(date: Date) {
  const season = getLiturgicalSeason(date);
  const baseReading = fallbackReadings[season as keyof typeof fallbackReadings] || fallbackReadings.advent;
  
  return {
    date: date.toISOString().split('T')[0],
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
    ...baseReading
  };
}

function getLiturgicalSeason(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 12 && day >= 25) || (month === 1 && day <= 8)) return 'christmas';
  if (month === 1 && day <= 9) return 'christmas';
  if (month === 3 && day >= 22 && day <= 31) return 'lent';
  if (month === 4 && day <= 30) return 'easter';
  if (month === 5 && day <= 23) return 'easter';
  if (month === 12 && day >= 1 && day <= 24) return 'advent';
  return 'ordinary';
}
