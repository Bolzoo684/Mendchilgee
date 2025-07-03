import React from 'react';
import { Heart, QrCode } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'create' | 'scan') => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">QR Мэндчилгээний Картууд</h1>
              <p className="text-purple-100 text-sm">Сэтгэлийн мэдээллийг скан хийж хуваалцаарай</p>
            </div>
          </div>
          
          <nav className="flex space-x-2">
            <button
              onClick={() => onNavigate('create')}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                currentView === 'create'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Карт Үүсгэх
            </button>
            <button
              onClick={() => onNavigate('scan')}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                currentView === 'scan'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>QR Скан</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;