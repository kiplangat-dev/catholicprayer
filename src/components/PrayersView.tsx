import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/enhancedDbService';

interface Prayer {
  id: string;
  title: string;
  text: string;
  category: string;
  language: string;
  length: string;
  tags: string[];
  favorite?: boolean;
  description?: string;
}

const PrayersView: React.FC = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [filteredPrayers, setFilteredPrayers] = useState<Prayer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPrayers();
  }, [selectedCategory, searchQuery, prayers]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allPrayers, allCategories, allStats] = await Promise.all([
        databaseService.getAllPrayers(),
        databaseService.getCategories(),
        databaseService.getStats()
      ]);
      setPrayers(allPrayers);
      setCategories(allCategories as string[]);
      setFilteredPrayers(allPrayers);
      setStats(allStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrayers = () => {
    let filtered = [...prayers];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prayer => prayer.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prayer =>
        prayer.title.toLowerCase().includes(query) ||
        prayer.text.toLowerCase().includes(query) ||
        prayer.description?.toLowerCase().includes(query) ||
        prayer.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredPrayers(filtered);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      try {
        const results = await databaseService.searchPrayers(searchQuery);
        setFilteredPrayers(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      filterPrayers();
    }
  };

  const handleToggleFavorite = async (prayerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await databaseService.toggleFavorite(prayerId);
    loadData(); // Refresh data
  };

  const handleCopyPrayer = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    alert('Prayer copied to clipboard!');
  };

  const handleViewPrayer = (prayer: Prayer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPrayer(prayer);
    // Scroll to top when viewing prayer
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryDisplayName = (category: string): string => {
    const names: Record<string, string> = {
      'daily': 'Daily Prayers',
      'morning': 'Morning Prayers',
      'evening': 'Evening Prayers',
      'marian': 'Marian Prayers',
      'rosary': 'Rosary Prayers',
      'creed': 'Creeds',
      'sacraments': 'Sacraments',
      'eucharist': 'Eucharist',
      'saints': 'Saints Prayers',
      'healing': 'Healing Prayers',
      'thanksgiving': 'Thanksgiving',
      'family': 'Family Prayers',
      'latin': 'Latin Prayers'
    };
    return names[category] || category;
  };

  const formatPrayerText = (text: string): string => {
    return text.replace(/\n/g, '<br />');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prayers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-catholic-red-500 to-catholic-red-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📿 Catholic Prayers</h1>
          <p className="text-xl opacity-90 mb-6">Traditional prayers for every occasion and need</p>
          
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalPrayers}</div>
                <div className="text-sm opacity-80">Total Prayers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.favoritePrayers}</div>
                <div className="text-sm opacity-80">Favorites</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalSaints}</div>
                <div className="text-sm opacity-80">Saints</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{filteredPrayers.length}</div>
                <div className="text-sm opacity-80">Showing</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search prayers by title, text, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-catholic-red-500 focus:ring-2 focus:ring-catholic-red-200 outline-none transition-all duration-200"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </div>
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-catholic-red-500 text-white px-4 py-2 rounded-lg hover:bg-catholic-red-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-catholic-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                🟦 Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-catholic-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                📋 List
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-catholic-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Prayers
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-catholic-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {getCategoryDisplayName(category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prayer Display */}
        {selectedPrayer ? (
          /* Prayer Detail View */
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-fade-in">
            <button
              onClick={() => setSelectedPrayer(null)}
              className="mb-6 text-catholic-red-500 hover:text-catholic-red-600 flex items-center gap-2 hover:underline"
            >
              ← Back to Prayers
            </button>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{selectedPrayer.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="badge-category">{getCategoryDisplayName(selectedPrayer.category)}</span>
                  <span className="badge-language">{selectedPrayer.language}</span>
                  <span className="text-gray-500">• {selectedPrayer.length}</span>
                </div>
              </div>
              <button
                onClick={(e) => handleToggleFavorite(selectedPrayer.id, e)}
                className={`text-3xl p-2 rounded-full hover:bg-gray-100 ${selectedPrayer.favorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
              >
                {selectedPrayer.favorite ? '★' : '☆'}
              </button>
            </div>

            {selectedPrayer.description && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
                <p className="text-gray-700">{selectedPrayer.description}</p>
              </div>
            )}

            <div className="mb-8">
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <div 
                  className="prayer-text whitespace-pre-line leading-relaxed text-gray-700 text-lg"
                  dangerouslySetInnerHTML={{ __html: formatPrayerText(selectedPrayer.text) }}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPrayer.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={(e) => handleCopyPrayer(selectedPrayer.text, e)}
                className="btn btn-primary flex items-center gap-2"
              >
                📋 Copy Prayer
              </button>
              <button className="btn btn-outline flex items-center gap-2">
                🔊 Play Audio
              </button>
              <button className="btn btn-outline flex items-center gap-2">
                📤 Share
              </button>
              <button className="btn btn-outline flex items-center gap-2">
                📝 Add Note
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPrayers.map(prayer => (
              <div
                key={prayer.id}
                className="card-prayer group transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => handleViewPrayer(prayer)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-catholic-red-600 transition-colors duration-200 line-clamp-2">
                    {prayer.title}
                  </h3>
                  <button
                    onClick={(e) => handleToggleFavorite(prayer.id, e)}
                    className={`text-xl p-1 rounded-full hover:bg-gray-100 ${prayer.favorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                  >
                    {prayer.favorite ? '★' : '☆'}
                  </button>
                </div>

                {prayer.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {prayer.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-category text-xs">{getCategoryDisplayName(prayer.category)}</span>
                  <span className="badge-language text-xs">{prayer.language}</span>
                  <span className="text-gray-400 text-sm">• {prayer.length}</span>
                </div>

                <p className="text-gray-700 mb-6 line-clamp-3 text-sm">
                  {prayer.text.substring(0, 150)}...
                </p>

                <div className="flex justify-between items-center">
                  <button
                    onClick={(e) => handleViewPrayer(prayer, e)}
                    className="text-sm text-catholic-red-500 hover:text-catholic-red-600 font-medium hover:underline"
                  >
                    View Prayer →
                  </button>
                  <button
                    onClick={(e) => handleCopyPrayer(prayer.text, e)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    title="Copy prayer"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4 mb-12">
            {filteredPrayers.map(prayer => (
              <div
                key={prayer.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-catholic-red-500 cursor-pointer"
                onClick={() => handleViewPrayer(prayer)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{prayer.title}</h3>
                      <span className="badge-category text-xs">{getCategoryDisplayName(prayer.category)}</span>
                    </div>
                    {prayer.description && (
                      <p className="text-gray-600 mb-3 text-sm">{prayer.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{prayer.language}</span>
                      <span>•</span>
                      <span>{prayer.length}</span>
                      <span>•</span>
                      <span>{prayer.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleToggleFavorite(prayer.id, e)}
                      className={`text-xl p-1 rounded-full hover:bg-gray-100 ${prayer.favorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                    >
                      {prayer.favorite ? '★' : '☆'}
                    </button>
                    <button
                      onClick={(e) => handleCopyPrayer(prayer.text, e)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                      title="Copy prayer"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={(e) => handleViewPrayer(prayer, e)}
                    className="text-sm text-catholic-red-500 hover:text-catholic-red-600 font-medium hover:underline"
                  >
                    View Full Prayer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPrayers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No prayers found</h3>
            <p className="text-gray-500 mb-6">Try a different search term or category</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-catholic-red-50 to-red-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => {
                const favorites = prayers.filter(p => p.favorite);
                if (favorites.length > 0) {
                  setSelectedPrayer(favorites[0]);
                } else {
                  alert('No favorite prayers yet!');
                }
              }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center hover:scale-105 transform duration-200"
            >
              <div className="text-3xl mb-3">⭐</div>
              <h4 className="font-bold text-gray-800 mb-2">View Favorites</h4>
              <p className="text-gray-600 text-sm">Your saved prayers</p>
            </button>
            <button 
              onClick={() => {
                const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];
                setSelectedPrayer(randomPrayer);
              }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center hover:scale-105 transform duration-200"
            >
              <div className="text-3xl mb-3">🎲</div>
              <h4 className="font-bold text-gray-800 mb-2">Random Prayer</h4>
              <p className="text-gray-600 text-sm">Discover something new</p>
            </button>
            <button 
              onClick={() => {
                alert('Custom prayer feature coming soon!');
              }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center hover:scale-105 transform duration-200"
            >
              <div className="text-3xl mb-3">📝</div>
              <h4 className="font-bold text-gray-800 mb-2">Add Custom Prayer</h4>
              <p className="text-gray-600 text-sm">Save your own prayers</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayersView;
