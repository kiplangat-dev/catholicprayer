import React, { useState, useEffect } from 'react';
import { EnhancedDbService } from '../services/enhancedDbService';

interface Reading {
  date: string;
  weekday: string;
  season: string;
  firstReading: {
    citation: string;
    text: string;
  };
  psalm: {
    citation: string;
    text: string;
    antiphon: string;
  };
  gospel: {
    citation: string;
    text: string;
  };
  saint?: any;
}

const DailyReadingsView: React.FC = () => {
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    loadTodayReading();
    generateDates();
  }, []);

  const generateDates = () => {
    const today = new Date();
    const datesArray: string[] = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      datesArray.push(date.toISOString().split('T')[0]);
    }
    setDates(datesArray);
  };

  const loadTodayReading = async () => {
    try {
      setLoading(true);
      const data = await EnhancedDbService.getDailyReading();
      setReading(data);
      setSelectedDate(data.date);
    } catch (error) {
      console.error('Error loading reading:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReadingByDate = async (date: string) => {
    try {
      setLoading(true);
      // For now, use today's reading with different date
      const data = await EnhancedDbService.getDailyReading();
      setReading({
        ...data,
        date: date,
        weekday: new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
      });
      setSelectedDate(date);
      setShowCalendar(false);
    } catch (error) {
      console.error('Error loading reading by date:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExplanation = async (citation: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // This would normally call an API
    setExplanation(`This reading from ${citation} reminds us of God's eternal love and guidance. It calls us to reflect on our relationship with God and others.`);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeasonColor = (season: string): string => {
    const colors: Record<string, string> = {
      'Advent': 'bg-purple-500 text-white',
      'Christmas': 'bg-white text-gray-800 border',
      'Lent': 'bg-purple-500 text-white',
      'Easter': 'bg-white text-gray-800 border',
      'Ordinary Time': 'bg-green-500 text-white'
    };
    return colors[season] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading daily readings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-catholic-purple-500 to-catholic-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">📖 Daily Catholic Readings</h1>
          <p className="text-xl opacity-90 mb-6">Today's liturgical readings and reflections</p>
          
          {reading && (
            <div className="flex flex-wrap items-center gap-4">
              <div className={`px-4 py-2 rounded-full ${getSeasonColor(reading.season)} font-semibold`}>
                {reading.season}
              </div>
              <div className="text-lg">
                {formatDate(reading.date)}
              </div>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors active:scale-95"
              >
                📅 Change Date
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date Picker */}
      {showCalendar && (
        <div className="container mx-auto px-4 -mt-4 mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Date</h3>
            <div className="grid grid-cols-7 gap-2">
              {dates.map(date => (
                <button
                  key={date}
                  onClick={() => loadReadingByDate(date)}
                  className={`p-3 rounded-lg text-center transition-all ${selectedDate === date ? 'bg-catholic-purple-500 text-white scale-105' : 'bg-gray-100 hover:bg-gray-200 active:scale-95'}`}
                >
                  <div className="font-semibold">{new Date(date).getDate()}</div>
                  <div className="text-xs opacity-75">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {reading && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Saint of the Day */}
            {reading.saint && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-500 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🧑‍🦳</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Saint of the Day</h2>
                    <p className="text-amber-700 font-medium">{reading.saint.name}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{reading.saint.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {reading.saint.patronage?.map((patron: string, idx: number) => (
                    <span key={idx} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                      {patron}
                    </span>
                  ))}
                </div>
                <button className="text-amber-600 hover:text-amber-700 font-medium hover:underline">
                  🙏 Prayer to St. {reading.saint.name.split(' ').pop()} →
                </button>
              </div>
            )}

            {/* First Reading */}
            <div className="card-reading animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">First Reading</h2>
                  <p className="text-catholic-purple-600 font-semibold mt-1">{reading.firstReading.citation}</p>
                </div>
                <button
                  onClick={(e) => getExplanation(reading.firstReading.citation, e)}
                  className="btn btn-outline text-sm active:scale-95"
                >
                  💭 Reflection
                </button>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="prayer-text leading-relaxed">{reading.firstReading.text}</p>
              </div>
            </div>

            {/* Responsorial Psalm */}
            <div className="card-reading animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Responsorial Psalm</h2>
                  <p className="text-catholic-purple-600 font-semibold mt-1">{reading.psalm.citation}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-4">
                <p className="text-center text-lg italic text-blue-600 font-serif">
                  "{reading.psalm.antiphon}"
                </p>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="prayer-text leading-relaxed">{reading.psalm.text}</p>
              </div>
            </div>

            {/* Gospel */}
            <div className="card-reading border-2 border-catholic-red-200 bg-gradient-to-r from-red-50 to-pink-50 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✝️</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gospel</h2>
                    <p className="text-catholic-red-600 font-semibold mt-1">{reading.gospel.citation}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => getExplanation(reading.gospel.citation, e)}
                  className="btn btn-primary text-sm active:scale-95"
                >
                  📖 Gospel Reflection
                </button>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="prayer-text leading-relaxed">{reading.gospel.text}</p>
              </div>
            </div>

            {/* Explanation */}
            {explanation && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-3">📚 Reflection</h3>
                <p className="text-gray-700">{explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Prayer Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn btn-primary py-3 active:scale-95">
                  🔊 Listen to Readings
                </button>
                <button 
                  onClick={() => {
                    const fullText = `${reading.firstReading.text}\n\n${reading.psalm.text}\n\n${reading.gospel.text}`;
                    navigator.clipboard.writeText(fullText);
                    alert('Readings copied to clipboard!');
                  }}
                  className="btn btn-outline py-3 active:scale-95"
                >
                  📋 Copy Readings
                </button>
                <button className="btn btn-outline py-3 active:scale-95">
                  📤 Share Readings
                </button>
                <button className="btn btn-outline py-3 active:scale-95">
                  💾 Save for Later
                </button>
                <button className="btn btn-outline py-3 active:scale-95">
                  📝 Add Reflection
                </button>
                <button onClick={loadTodayReading} className="btn btn-outline py-3 active:scale-95">
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Liturgical Notes */}
            <div className="bg-gray-50 rounded-2xl p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Liturgical Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Season: {reading.season}</h4>
                  <p className="text-gray-600 text-sm">
                    {reading.season === 'Advent' && 'A time of preparation for Christmas, marked by hope and expectation.'}
                    {reading.season === 'Christmas' && 'Celebration of the birth of Jesus Christ, God made man.'}
                    {reading.season === 'Lent' && 'A period of penance, fasting, and preparation for Easter.'}
                    {reading.season === 'Easter' && 'Celebration of Christ\'s resurrection and victory over death.'}
                    {reading.season === 'Ordinary Time' && 'Time for growth and living out our Christian faith.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Liturgical Color</h4>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${getSeasonColor(reading.season).split(' ')[0]}`}></div>
                    <span className="text-gray-600">
                      {reading.season === 'Advent' && 'Purple (Penance & Preparation)'}
                      {reading.season === 'Christmas' && 'White (Joy & Purity)'}
                      {reading.season === 'Lent' && 'Purple (Penance & Preparation)'}
                      {reading.season === 'Easter' && 'White (Joy & Purity)'}
                      {reading.season === 'Ordinary Time' && 'Green (Hope & Growth)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReadingsView;
