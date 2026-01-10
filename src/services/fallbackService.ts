// Fallback service that provides basic data without database
export const fallbackService = {
  async getPrayers() {
    return [
      {
        id: 'our-father',
        title: 'Our Father',
        text: 'Our Father, who art in heaven, hallowed be thy name...',
        category: 'basic',
        language: 'English',
        length: 'short',
        tags: ['basic'],
        favorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'hail-mary',
        title: 'Hail Mary',
        text: 'Hail Mary, full of grace, the Lord is with thee...',
        category: 'basic',
        language: 'English',
        length: 'short',
        tags: ['basic'],
        favorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  },

  async searchPrayers(query: string) {
    const prayers = await this.getPrayers();
    const lowerQuery = query.toLowerCase();
    return prayers.filter(prayer => 
      prayer.title.toLowerCase().includes(lowerQuery) ||
      prayer.text.toLowerCase().includes(lowerQuery)
    );
  },

  async getStats() {
    return {
      totalPrayers: 2,
      totalReadings: 0,
      totalSaints: 0,
      favoritePrayers: 2
    };
  }
};
