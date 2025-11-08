import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ModCard from '../components/mods/ModCard';

const DEFAULT_COLORS = [
  'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 
  'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const DEFAULT_ICONS = [
  '🚜', '🔧', '🚚', '🗺️', '⚙️', '🎨', '📦', '🔥'
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-downloads', label: 'Most Downloaded' },
  { value: '-averageRating', label: 'Highest Rated' },
  { value: 'title', label: 'A-Z' },
  { value: '-title', label: 'Z-A' }
];

const ModsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMods, setTotalMods] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    gameName: searchParams.get('gameName') || 'all',
    type: searchParams.get('type') || 'all',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-createdAt'
  });

  const modsPerPage = 12;

  useEffect(() => {
    fetchCategories();
    fetchGames();
    fetchMods();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const fetchMods = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.gameName !== 'all') params.append('gameName', filters.gameName);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', currentPage);
      params.append('limit', modsPerPage);
      
      const response = await api.get(`/mods?${params}`);
      setMods(response.data.mods || []);
      setTotalMods(response.data.total || 0);
    } catch (error) {
      console.error('Failed to fetch mods:', error);
      setMods([]);
      setTotalMods(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== '') {
        newParams.set(k, v);
      }
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      gameName: 'all',
      type: 'all',
      search: '',
      sort: '-createdAt'
    });
    setCurrentPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalMods / modsPerPage);
  const hasActiveFilters = filters.category !== 'all' || filters.gameName !== 'all' || filters.type !== 'all' || filters.search !== '';

  return (
    <div className="min-h-screen">
      {/* Compact Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                🔍 Browse Mods
              </h1>
              <p className="text-green-100">
                {totalMods.toLocaleString()} amazing mods available
              </p>
            </div>
            
            {/* Quick Search */}
            <div className="lg:w-96 relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search mods..."
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange('category', 'all')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left ${
                      filters.category === 'all'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                    </svg>
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat, index) => (
                    <button
                      key={cat._id}
                      onClick={() => handleFilterChange('category', cat.name)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left ${
                        filters.category === cat.name
                          ? `bg-gradient-to-r from-${DEFAULT_COLORS[index % DEFAULT_COLORS.length].split('-')[1]}-500 to-${DEFAULT_COLORS[index % DEFAULT_COLORS.length].split('-')[1]}-600 text-white shadow-lg`
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{DEFAULT_ICONS[index % DEFAULT_ICONS.length]}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Games */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">🎮</span>
                  Games
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange('gameName', 'all')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left ${
                      filters.gameName === 'all'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                    </svg>
                    <span>All Games</span>
                  </button>
                  {games.map((game) => (
                    <button
                      key={game._id}
                      onClick={() => handleFilterChange('gameName', game.name)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left ${
                        filters.gameName === game.name
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <img src={game.imgUrl} alt={game.name} className="w-6 h-6 rounded object-cover" />
                      <span>{game.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">⚙️</span>
                  Filters
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Types</option>
                      <option value="free">Free Mods</option>
                      <option value="paid">Premium Mods</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-green-500"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-300">
                    <span className="font-semibold">{totalMods.toLocaleString()}</span> mods found
                  </span>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Filters
                  </button>
                </div>
                
                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="free">Free Mods</option>
                      <option value="paid">Premium Mods</option>
                    </select>
                    
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {filters.category !== 'all' ? `${filters.category} Mods` : 'All Mods'}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Mods Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading amazing mods...</p>
          </div>
        ) : mods.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-6 text-green-500 animate-float" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              <path d="M12 2v4a4 4 0 014 4h4a8 8 0 00-8-8z"/>
              <path d="M20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"/>
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No mods found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your filters or search terms to discover more content.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {mods.map((mod, index) => (
                <div
                  key={mod._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ModCard mod={mod} />
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModsPage;