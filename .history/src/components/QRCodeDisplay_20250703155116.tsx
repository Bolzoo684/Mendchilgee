import React, { useState, useEffect } from 'react';
import { Download, Share2, ArrowLeft, Clock, Sparkles, Gift } from 'lucide-react';
import { GreetingCard } from '../types';
import { downloadQRCode, shareQRCode } from '../utils/qrGenerator';

interface QRCodeDisplayProps {
  card: GreetingCard;
  qrCodeUrl: string;
  onBack: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ card, qrCodeUrl, onBack }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

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
      
      setTimeRemaining(`⏰ ${hours}ц ${minutes}м ${seconds}с үлдсэн`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [card.expiresAt]);

  const handleDownload = () => {
    downloadQRCode(qrCodeUrl, `mendchilgee-${card.recipientName}`);
  };

  const handleShare = async () => {
    const message = `💝 ${card.recipientName} танд ${card.senderName}-ээс онцгой мэндчилгээ ирлээ! QR кодыг уншуулаад үзээрэй ✨`;
    await shareQRCode(qrCodeUrl, message);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
              🎉 Мэндчилгээ бэлэн боллоо!
            </h1>
            <p className="text-white/90 text-lg animate-slide-up-delay">
              {card.recipientName} танд зориулав 💝
            </p>
          </div>
        </div>

        {/* QR код дэлгэц */}
        <div className="p-8">
          <div className="text-center mb-6 animate-slide-up">
            <p className="text-gray-700 mb-4 text-lg">
              Доорх QR кодыг хуваалцаж эсвэл хадгална уу
            </p>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl inline-block shadow-inner">
              <div className="bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform">
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 mx-auto" />
              </div>
            </div>
          </div>

          {/* Үйлдлийн товчлуурууд */}
          <div className="flex justify-center space-x-4 mb-6 animate-slide-up-delay">
            <button
              onClick={handleDownload}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md transform hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Татаж авах
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all shadow-md transform hover:scale-105"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Хуваалцах
            </button>
          </div>

          {/* Заавар */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 animate-slide-up-delay-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3 animate-pulse">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  💫 Хэрхэн ашиглах вэ?
                </h4>
                <ol className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">1.</span>
                    <span>QR кодын зургийг татаж аваад хүссэн хүндээ илгээнэ</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">2.</span>
                    <span>Хүлээн авагч QR кодыг уншуулснаар мэндчилгээг үзэх боломжтой</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">3.</span>
                    <span>Мэндчилгээ нэг л удаа нээгдэх тул онцгой мөч болно</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚡</span>
                    <span className="font-medium">24 цагийн дотор илгээхээ мартуузай!</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;