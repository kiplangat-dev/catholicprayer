import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { databaseService } from './services/databaseService';
import './styles/index.css';

// Navigation component
const Navigation = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/readings', label: 'Readings', icon: '📖' },
    { path: '/prayers', label: 'Prayers', icon: '🙏' },
    { path: '/rosary', label: 'Rosary', icon: '📿' },
    { path: '/saints', label: 'Saints', icon: '🧑‍🦳' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="bg-catholic-red-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-2xl">📿</span>
              <h1 className="text-2xl font-bold text-white">Catholic Prayer App</h1>
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex flex-wrap gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-white/20 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Placeholder components
const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 fade-in">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Your Catholic Prayer App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your complete offline companion for prayer and devotion
        </p>
        
        <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 font-medium">Database: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            title: '📖 Daily Readings',
            description: 'Complete liturgical readings for each day',
            link: '/readings',
            color: 'from-blue-500 to-cyan-500',
          },
          {
            title: '🙏 400+ Prayers',
            description: 'Traditional prayers for every occasion',
            link: '/prayers',
            color: 'from-catholic-red-500 to-red-600',
          },
          {
            title: '📿 Holy Rosary',
            description: 'Interactive rosary with all mysteries',
            link: '/rosary',
            color: 'from-purple-500 to-pink-500',
          },
          {
            title: '🧑‍🦳 Saints',
            description: 'Daily saints and their prayers',
            link: '/saints',
            color: 'from-amber-500 to-orange-500',
          },
        ].map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90`}></div>
            <div className="relative p-8 text-white">
              <div className="text-4xl mb-4">{feature.title.split(' ')[0]}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title.split(' ').slice(1).join(' ')}</h3>
              <p className="text-white/80 mb-6">{feature.description}</p>
              <span className="inline-flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform duration-200">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Features at a Glance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Offline Database</h3>
            <p className="text-gray-600">All prayers available without internet</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Search</h3>
            <p className="text-gray-600">Quickly find prayers by category, tag, or keyword</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Favorites</h3>
            <p className="text-gray-600">Save your favorite prayers for easy access</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DailyReadingsView = () => (
  <div className="container-padded">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">📖 Daily Catholic Readings</h1>
        <p className="text-gray-600">Today's liturgical readings and reflections</p>
        <div className="mt-4 inline-block bg-catholic-red-50 text-catholic-red-700 px-4 py-2 rounded-full text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="card-reading">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">First Reading</h2>
          <p className="text-gray-700 mb-2 font-medium">Isaiah 40:1-5, 9-11</p>
          <p className="prayer-text">
            Comfort, give comfort to my people, says your God. Speak tenderly to Jerusalem, and proclaim to her...
          </p>
        </div>
        
        <div className="card-reading">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsorial Psalm</h2>
          <p className="text-gray-700 mb-2 font-medium">Psalm 85:9-10, 11-12, 13-14</p>
          <p className="prayer-text italic text-center text-lg text-gray-600 mb-3">
            "Lord, let us see your kindness, and grant us your salvation."
          </p>
          <p className="prayer-text">
            I will hear what God proclaims; the LORD—for he proclaims peace. Near indeed is his salvation...
          </p>
        </div>
        
        <div className="card-reading">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Gospel</h2>
          <p className="text-gray-700 mb-2 font-medium">John 1:19-28</p>
          <p className="prayer-text">
            This is the testimony of John. When the Jews from Jerusalem sent priests and Levites to ask him, "Who are you?"...
          </p>
        </div>
      </div>
    </div>
  </div>
);

const PrayersView = () => (
  <div className="container-padded">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4"> Catholic Prayers</h1>
        <p className="text-gray-600 mb-6">Traditional prayers for every occasion and need</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['All', 'Daily', 'Morning', 'Evening', 'Rosary', 'Saints', 'Healing', 'Thanksgiving'].map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border-2 border-catholic-red-200 text-catholic-red-700 hover:bg-catholic-red-50 transition-colors duration-200"
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search prayers by title, text, or keyword..."
            className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-catholic-red-500 focus:ring-2 focus:ring-catholic-red-200 outline-none transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Our Father', category: 'Basic', length: 'Short' },
          { title: 'Hail Mary', category: 'Basic', length: 'Short' },
          { title: 'Glory Be', category: 'Basic', length: 'Short' },
          { title: 'St. Michael', category: 'Basic', length: 'Short'},
          { title: 'Apostles\' Creed', category: 'Creed', length: 'Medium' },
          { title: 'Morning Offering', category: 'Morning', length: 'Medium' },
          { title: 'Evening Prayer', category: 'Evening', length: 'Short' },
          { title: 'Memorare', category: 'Marian', length: 'Medium' },
          { title: 'Hail Holy Queen', category: 'Marian', length: 'Medium' },
          { title: 'Act of Contrition', category: 'Sacraments', length: 'Short' },
        ].map((prayer, index) => (
          <div key={index} className="card-prayer group hover:border-catholic-red-600 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-catholic-red-600 transition-colors duration-200">
                {prayer.title}
              </h3>
              <button className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">
                ☆
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="badge-category">{prayer.category}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{prayer.length}</span>
            </div>
            
            <p className="text-gray-600 mb-6 line-clamp-3">
              {prayer.title === 'Our Father' && 'Our Father, who art in heaven, hallowed be thy name...'}
              {prayer.title === 'Hail Mary' && 'Hail Mary, full of grace, the Lord is with thee...'}
              {prayer.title === 'Glory Be' && 'Glory be to the Father, and to the Son, and to the Holy Spirit...'}
              {prayer.title === 'St. Michael' && 'St. Michael the Arch Angel defend us in the day of battle...'}
              {/* Add more prayer previews */}
            </p>
            
            <div className="flex justify-between items-center">
              <button className="btn btn-outline text-sm">
                View Prayer
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                📋
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RosaryView = () => (
  <div className="container-padded">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">📿 Holy Rosary</h1>
      <p className="text-gray-600 mb-8">Meditate on the mysteries of our salvation</p>
      
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Mysteries: Joyful</h2>
        <p className="text-gray-600 mb-6">Monday & Saturday</p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {['Annunciation', 'Visitation', 'Nativity', 'Presentation', 'Finding'].map((mystery, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-2xl mb-2">{index + 1}</div>
              <h3 className="font-bold text-gray-800">{mystery}</h3>
              <p className="text-xs text-gray-500 mt-2">Luke 1:26-38</p>
            </div>
          ))}
        </div>
        
        <button className="btn btn-primary px-8 py-4 text-lg">
          🙏 Start Praying the Rosary
        </button>
      </div>
    </div>
  </div>
);

const SaintsView = () => (
  <div className="container-padded">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🧑‍🦳 Catholic Saints</h1>
        <p className="text-gray-600 mb-6">Learn about the saints and ask for their intercession</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'St. Joseph', feast: 'March 19', patronage: ['Workers', 'Fathers', 'The Church'] },
              { name: 'St. Therese of Lisieux', feast: 'October 1', patronage: ['Missionaries', 'Florists', 'Aviators'] },
              { name: 'St. Francis of Assisi', feast: 'October 4', patronage: ['Animals', 'Ecology', 'Merchants'] },
              { name: 'St. Anthony of Padua', feast: 'June 13', patronage: ['Lost Items', 'Poor', 'Travelers'] },
            ].map((saint, index) => (
              <div key={index} className="card-saint">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{saint.name}</h3>
                <div className="text-catholic-gold-600 font-medium mb-4">Feast: {saint.feast}</div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Patronage</h4>
                  <div className="flex flex-wrap gap-2">
                    {saint.patronage.map((patron, idx) => (
                      <span key={idx} className="badge bg-purple-100 text-purple-800">
                        {patron}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="btn btn-outline w-full text-sm">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Saint of the Day</h3>
            <div className="text-6xl mb-4 text-center">🧑‍🦳</div>
            <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">St. John Neumann</h4>
            <p className="text-gray-600 text-center mb-4">January 5</p>
            <p className="text-gray-700 mb-4">
              Bishop and missionary known for his work with immigrants and establishing the Catholic school system.
            </p>
            <button className="btn btn-primary w-full">
              🙏 Prayer to St. John Neumann
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Facts</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-catholic-red-500 rounded-full mr-3"></span>
                Over 10,000 recognized saints
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-catholic-red-500 rounded-full mr-3"></span>
                Saints come from all walks of life
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-catholic-red-500 rounded-full mr-3"></span>
                Canonization process takes years
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-catholic-red-500 rounded-full mr-3"></span>
                We ask saints to pray for us
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="container-padded">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">⚙️ Settings</h1>
      
      <div className="space-y-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Dark Mode</h3>
                <p className="text-sm text-gray-500">Use dark theme for praying at night</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-catholic-red-500"></div>
              </label>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Font Size</h3>
              <div className="flex gap-2">
                {['Small', 'Medium', 'Large'].map((size) => (
                  <button
                    key={size}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-catholic-red-500 transition-colors duration-200"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Daily Prayer Reminder</h3>
                <p className="text-sm text-gray-500">Get reminded to pray each day</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-catholic-red-500"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-outline py-3">
              📤 Export All Data
            </button>
            <button className="btn btn-outline py-3">
              📥 Import Data
            </button>
            <button className="btn btn-outline py-3">
              🗑️ Clear Cache
            </button>
            <button className="btn bg-red-50 text-red-600 border-red-200 hover:bg-red-100 py-3">
              🔄 Reset App
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        console.log('Initializing database...');
        const success = await databaseService.init();
        setDbInitialized(success);
        console.log('Database initialized:', success);
      } catch (error) {
        console.error('Database init error:', error);
        setDbInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    initDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-catholic-red-500 to-catholic-red-600 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Catholic Prayer App</h2>
          <p className="text-white/80">Initializing prayer database...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/readings" element={<DailyReadingsView />} />
          <Route path="/prayers" element={<PrayersView />} />
          <Route path="/rosary" element={<RosaryView />} />
          <Route path="/saints" element={<SaintsView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
        
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">© {new Date().getFullYear()} Catholic Prayer App. All prayers and readings available offline.</p>
            <p className="text-gray-400 text-sm">
              Version 1.0.0 • Database: {dbInitialized ? 'Active' : 'Basic'}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
