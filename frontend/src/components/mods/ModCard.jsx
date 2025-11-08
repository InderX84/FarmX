import { Link } from 'react-router-dom';
import { useState } from 'react';

const ModCard = ({ mod }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDownloads = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || '0';
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('⭐');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('🌟');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  return (
    <div className="group glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
      {/* Image Container */}
      <div className="relative aspect-video bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 overflow-hidden">
        {(mod.imgUrl || mod.images?.[0]) && !imageError ? (
          <>
            <img
              src={mod.imgUrl || mod.images[0]}
              alt={mod.name || mod.title}
              className={`w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="spinner"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-600 dark:text-green-400">
            <span className="text-6xl">🚜</span>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            mod.isFree ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {mod.isFree ? 'FREE' : `$${mod.price}`}
          </span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded text-xs bg-black/50 text-white">
            {mod.category}
          </span>
        </div>
        
        {/* Game Badge */}
        {mod.gameName && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 rounded text-xs bg-blue-600/80 text-white flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
              </svg>
              <span>{mod.gameName}</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-3 truncate">
          {mod.name || mod.title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {mod.description}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>v{mod.version}</span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            <span>{formatDownloads(mod.downloads || 0)}</span>
          </div>
        </div>
        
        {/* Creator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {mod.creator?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-300">{mod.creator?.username || 'Unknown'}</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Link
          to={`/mods/${mod._id}`}
          className="w-full btn-primary text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ModCard;