const Maintenance = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center px-4">
        <div className="mb-8">
          <svg className="w-24 h-24 mx-auto text-yellow-500 mb-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
          </svg>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            🚜 2 Fast Ale Market
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-300 mb-6">
            Under Maintenance
          </h2>
        </div>
        
        <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-gray-300 text-lg mb-6">
            We're currently performing scheduled maintenance to improve your experience.
          </p>
          
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Updating database</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span>Optimizing performance</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span>Adding new features</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-sm text-gray-500">
              Expected completion: Soon
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Thank you for your patience!
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            Follow us for updates:
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="https://instagram.com/farmx" className="text-pink-400 hover:text-pink-300">
              Instagram
            </a>
            <a href="https://t.me/farmx" className="text-blue-400 hover:text-blue-300">
              Telegram
            </a>
            <a href="https://discord.gg/zrGtm4BM" className="text-indigo-400 hover:text-indigo-300">
              Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;