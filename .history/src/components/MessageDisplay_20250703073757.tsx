import React, { useState, useEffect } from 'react';
import { Heart, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { GreetingCard } from '../types';

interface MessageDisplayProps {
  card: GreetingCard;
  onBack: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ card, onBack }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = card.expiresAt - now;
      
      if (remaining <= 0) {
        setTimeRemaining('Хугацаа дууссан');
        return;
      }
      
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours}ц ${minutes}м ${seconds}с`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [card.expiresAt]);

  const handleShare = async () => {
    try {
      const text = `"${card.message}" - ${card.senderName}-ээс`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Мэндчилгээний картын мессеж',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Хуваалцахад алдаа гарлаа:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('mn-MN');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Толгой хэсэг */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Сканнер руу буцах
            </button>
            
            <div className="flex items-center text-sm text-white/80">
              <Clock className="h-4 w-4 mr-1" />
              {timeRemaining}
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Танд зориулсан онцгой мессеж
            </h1>
            <p className="text-white/90">
              {card.recipientName}
            </p>
          </div>
        </div>

        {/* Мессежийн агуулга */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Эрхэм {card.recipientName},
                </h2>
              </div>
              
              <div className="text-gray-700 leading-relaxed mb-6 text-center">
                {card.message}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Хайраар,
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {card.senderName}
                </p>
              </div>
            </div>
          </div>

          {/* Картын дэлгэрэнгүй */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-gray-600">Ангилал:</span>
              <div className="font-medium text-gray-800">{card.category}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-gray-600">Үүсгэсэн:</span>
              <div className="font-medium text-gray-800">{formatDate(card.createdAt)}</div>
            </div>
          </div>

          {/* Үйлдлүүд */}
          <div className="flex justify-center">
            <button
              onClick={handleShare}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Мессеж хуваалцах
            </button>
          </div>
        </div>

        {/* Аюулгүй байдлын мэдэгдэл */}
        <div className="bg-blue-50 border-t p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Нэг удаагийн мессеж</h4>
              <p className="text-sm text-blue-700">
                Энэ мессеж зөвхөн танд зориулагдсан бөгөөд аюулгүй байдлын үүднээс зөвхөн нэг удаа харж болно. 
                QR код 24 цагийн дараа автоматаар хүчингүй болно.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Хуваалцлагын амжилтын мессеж */}
      {showShareSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Мессеж clipboard-д хуулагдлаа!
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;