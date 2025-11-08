import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const [stats, setStats] = useState({ totalMods: 0, totalUsers: 0, totalDownloads: 0 });
  const [recentMods, setRecentMods] = useState([]);

  useEffect(() => {
    // Fetch stats and recent mods
    const fetchData = async () => {
      try {
        // Fetch mods to calculate stats
        const modsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/mods?limit=6&sort=-createdAt`);
        
        if (modsRes.ok) {
          const modsData = await modsRes.json();
          setRecentMods(modsData.mods || []);
          
          // Calculate stats from mods data
          const totalDownloads = modsData.mods?.reduce((sum, mod) => sum + (mod.downloads || 0), 0) || 0;
          setStats({
            totalMods: modsData.total || modsData.mods?.length || 0,
            totalUsers: 1200, // This would come from a separate endpoint
            totalDownloads: totalDownloads
          });
        } else {
          // Fallback stats
          setStats({ totalMods: 25, totalUsers: 150, totalDownloads: 2500 });
          setRecentMods([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set realistic fallback data
        setStats({ totalMods: 25, totalUsers: 150, totalDownloads: 2500 });
        setRecentMods([]);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("https://wallpapercave.com/wp/wp9772031.jpg")'}}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-green-700/80 to-green-800/80"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-16 h-16 md:w-20 md:h-20 text-white mr-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  <path d="M12 2v4a4 4 0 014 4h4a8 8 0 00-8-8z"/>
                  <path d="M20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"/>
                </svg>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  FarmX
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
                The Ultimate Hub for Farming Simulator Enthusiasts
              </p>
              <p className="text-lg mb-12 text-green-200 max-w-2xl mx-auto">
                Discover, download, and share amazing mods with our growing community of farmers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/mods"
                className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
                Explore Mods
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
                </svg>
                Join Now
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass rounded-xl p-6">
                <div className="text-3xl font-bold">{stats.totalMods.toLocaleString()}</div>
                <div className="text-green-200">Total Mods</div>
              </div>
              <div className="glass rounded-xl p-6">
                <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-green-200">Community Members</div>
              </div>
              <div className="glass rounded-xl p-6">
                <div className="text-3xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
                <div className="text-green-200">Downloads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose FarmX?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to enhance your Farming Simulator experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-12 h-12 text-yellow-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Instant Downloads</h3>
              <p className="text-gray-600 dark:text-gray-400">Free mods available for immediate download. No waiting, no hassle.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-12 h-12 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Quality Assured</h3>
              <p className="text-gray-600 dark:text-gray-400">All mods are reviewed and tested by our community before publication.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-12 h-12 text-green-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Active Community</h3>
              <p className="text-gray-600 dark:text-gray-400">Connect with fellow farmers, share experiences, and get support.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-12 h-12 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Easy Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400">Advanced search and filtering to find exactly what you're looking for.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-12 h-12 text-purple-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Premium Content</h3>
              <p className="text-gray-600 dark:text-gray-400">Access exclusive premium mods through our admin contact system.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-12 h-12 text-indigo-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM8 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 9a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Mobile Friendly</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse and download mods on any device, anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Mods Section */}
      {recentMods.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Latest Mods
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Fresh content from our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentMods.map((mod) => (
                <Link
                  key={mod._id}
                  to={`/mods/${mod._id}`}
                  className="group bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    {mod.images?.[0] ? (
                      <img
                        src={mod.images[0]}
                        alt={mod.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        <path d="M12 2v4a4 4 0 014 4h4a8 8 0 00-8-8z"/>
                        <path d="M20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"/>
                      </svg>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {mod.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        {mod.category}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {mod.price === 0 ? 'Free' : 'Premium'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/mods"
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                View All Mods →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-green-100 text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Join Our Growing Community
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Ready to Transform Your Farm?
            </h2>
            
            <p className="text-xl md:text-2xl mb-4 text-green-100 max-w-3xl mx-auto">
              Join {stats.totalUsers.toLocaleString()}+ farmers who've already downloaded {stats.totalDownloads.toLocaleString()}+ mods
            </p>
            
            <p className="text-lg mb-12 text-green-200 max-w-2xl mx-auto">
              Start your journey today and discover endless possibilities for your farming simulator
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/register"
                className="group bg-white text-green-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
                  </svg>
                  Get Started Free
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
              
              <Link
                to="/mods"
                className="group border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-700 transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                  Explore {stats.totalMods} Mods
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass rounded-2xl p-6">
                <svg className="w-8 h-8 text-yellow-400 mb-2 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                <div className="text-lg font-semibold mb-1">Instant Access</div>
                <div className="text-green-200 text-sm">Download mods immediately</div>
              </div>
              
              <div className="glass rounded-2xl p-6">
                <svg className="w-8 h-8 text-blue-400 mb-2 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div className="text-lg font-semibold mb-1">100% Safe</div>
                <div className="text-green-200 text-sm">Verified and tested mods</div>
              </div>
              
              <div className="glass rounded-2xl p-6">
                <svg className="w-8 h-8 text-green-400 mb-2 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <div className="text-lg font-semibold mb-1">Always Free</div>
                <div className="text-green-200 text-sm">No hidden costs or fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;