import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚜</span>
              </div>
              <span className="text-xl font-bold">2 Fast Ale</span>
            </div>
            <p className="text-gray-400 mb-4">
              The Ultimate Hub for Farming Simulator Mods.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mods" className="text-gray-400 hover:text-white transition-colors">
                  Browse Mods
                </Link>
              </li>
              <li>
                <Link to="/request-mod" className="text-gray-400 hover:text-white transition-colors">
                  Request Mod
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Join Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 2 Fast Ale. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://instagram.com/farmx" className="text-gray-400 hover:text-pink-400 transition-colors">
                Instagram
              </a>
              <a href="https://t.me/farmx" className="text-gray-400 hover:text-blue-400 transition-colors">
                Telegram
              </a>
              <a href="https://discord.gg/zrGtm4BM" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;