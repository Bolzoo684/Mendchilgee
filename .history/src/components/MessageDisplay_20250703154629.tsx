import React, { useState, useEffect } from 'react';
import { Heart, Clock, ArrowLeft, Share2, Sparkles, Gift } from 'lucide-react';
import { GreetingCard } from '../types';

interface MessageDisplayProps {
  card: GreetingCard;
  onBack: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ card, onBack }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Анимэйшны төлөв
    setTimeout(() => setIsRevealed(true), 100);
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = card.expiresAt - now;
      
      if (remaining <= 0) {
        setTimeRemaining('✨ Хугацаа дууссан');
        return;
      }
      
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      
      setTimeRemaining(`⏰ ${hours}ц ${minutes}м ${seconds}с`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [card.expiresAt]);

  const handleShare = async () => {
    try {
      const text = `💝 "${card.message}" \n\n💌 ${card.senderName} танд илгээв`;
      
      if (navigator.share) {
        await navigator.share({
          title: '✨ Онцгой мэндчилгээ',
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
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-1000 transform ${
        isRevealed ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Толгой хэсэг */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-white/80 hover:text-white transition-colors transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Буцах
            </button>
            
            <div className="flex items-center text-sm text-white/90 bg-white/20 px-3 py-1 rounded-full">
              {timeRemaining}
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <Gift className="h-10 w-10 text-white animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold mb-2 animate-slide-up">
              🎁 Танд зориулсан бэлэг
            </h1>
            <p className="text-white/90 text-lg animate-slide-up-delay">
              {card.recipientName} 💝
            </p>
          </div>
        </div>

        {/* Мессежийн агуулга */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-6 mb-6 animate-slide-up">
            <div className="bg-white rounded-lg p-6 shadow-sm relative overflow-hidden">
              {/* Арын дизайн */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/30 to-purple-100/30 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2 animate-spin-slow" />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {card.recipientName} таньд,
                  </h2>
                </div>
                
                <div className="text-gray-700 leading-relaxed mb-6 text-center text-lg px-4 animate-fade-in-delay">
                  {card.message}
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-600 mb-2">
                    Хайр дүүрэн мэндчилгээг,
                  </p>
                  <p className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    💌 {card.senderName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Картын дэлгэрэнгүй */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm animate-slide-up-delay">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 transform hover:scale-105 transition-transform">
              <span className="text-purple-600 flex items-center mb-1">
                <Heart className="h-4 w-4 mr-1" />
                Төрөл:
              </span>
              <div className="font-medium text-gray-800">{card.category}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 transform hover:scale-105 transition-transform">
              <span className="text-pink-600 flex items-center mb-1">
                <Clock className="h-4 w-4 mr-1" />
                Илгээсэн:
              </span>
              <div className="font-medium text-gray-800">{formatDate(card.createdAt)}</div>
            </div>
          </div>

          {/* Үйлдлүүд */}
          <div className="flex justify-center animate-slide-up-delay-2">
            <button
              onClick={handleShare}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105 hover:shadow-xl"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Найзуудтайгаа хуваалцах
            </button>
          </div>
        </div>

        {/* Аюулгүй байдлын мэдэгдэл */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3 animate-pulse">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                Онцгой мэндчилгээ
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Энэ бол танд л зориулагдсан онцгой мэндчилгээ юм. 
                Аюулгүй байдлын үүднээс нэг л удаа нээгдэх боломжтой бөгөөд 
                24 цагийн дараа өөрөө устах болно. 💫
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Хуваалцлагын амжилтын мессеж */}
      {showShareSuccess && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce-in">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Амжилттай хуулагдлаа! ✨
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;