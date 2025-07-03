import React, { useState, useEffect } from 'react';
import { Download, Share2, ArrowLeft, Clock } from 'lucide-react';
import { GreetingCard } from '../types';
import { downloadQRCode, shareQRCode } from '../utils/qrGenerator';

interface QRCodeDisplayProps {
  card: GreetingCard;
  qrCodeUrl: string;
  onBack: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ card, qrCodeUrl, onBack }) => {
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

  const handleDownload = (format: 'png' | 'jpg' | 'svg' = 'png') => {
    const filename = `мэндчилгээний-карт-${card.recipientName.replace(/\s+/g, '-').toLowerCase()}`;
    downloadQRCode(qrCodeUrl, filename, format);
  };

  const handleShare = async () => {
    try {
      const message = `${card.recipientName}-д зориулсан ${card.senderName}-ийн онцгой мэндчилгээний карт! Мессежийг харахын тулд QR кодыг скан хийнэ үү.`;
      await shareQRCode(qrCodeUrl, message);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 3000);
    } catch (error) {
      console.error('Хуваалцахад алдаа гарлаа:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Толгой хэсэг */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Үүсгэх хэсэгт буцах
          </button>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Хугацаа дуусах: {timeRemaining}
          </div>
        </div>

        {/* Амжилтын мессеж */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            QR Мэндчилгээний карт үүслээ!
          </h2>
          <p className="text-gray-600">
            <span className="font-semibold">{card.recipientName}</span>-д зориулсан таны мэндчилгээний карт хуваалцахад бэлэн боллоо
          </p>
        </div>

        {/* QR код харуулах */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <img
              src={qrCodeUrl}
              alt="Мэндчилгээний картын QR код"
              className="mx-auto mb-4 rounded-lg"
              style={{ width: '300px', height: '300px' }}
            />
            <p className="text-sm text-gray-600 mb-4">
              Энэ QR кодыг {card.recipientName}-тай хуваалцаж мессежээ хүргээрэй
            </p>
            
            {/* Үйлдлийн товчнууд */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload('png')}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PNG
                </button>
                <button
                  onClick={() => handleDownload('jpg')}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  JPG
                </button>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Хуваалцах
              </button>
            </div>
          </div>
        </div>

        {/* Картын дэлгэрэнгүй */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Картын дэлгэрэнгүй</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Илгээгч:</span>
              <div className="font-medium">{card.senderName}</div>
            </div>
            <div>
              <span className="text-gray-600">Хүлээн авагч:</span>
              <div className="font-medium">{card.recipientName}</div>
            </div>
            <div>
              <span className="text-gray-600">Ангилал:</span>
              <div className="font-medium">{card.category}</div>
            </div>
            <div>
              <span className="text-gray-600">Хандалт:</span>
              <div className="font-medium">Нэг удаагийн үзэх</div>
            </div>
          </div>
        </div>

        {/* Аюулгүй байдлын мэдэгдэл */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Аюулгүй байдал ба нууцлал</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Энэ QR код 24 цагийн дараа хүчингүй болно</li>
            <li>• Мессежийг зөвхөн нэг удаа харж болно</li>
            <li>• Бүх өгөгдөл аюулгүй байдлын үүднээс шифрлэгдсэн</li>
            <li>• Хувийн мэдээлэл гадны серверт хадгалагдахгүй</li>
          </ul>
        </div>

        {/* Хуваалцлагын амжилтын мессеж */}
        {showShareSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            Амжилттай хуваалцлаа! (эсвэл clipboard-д хуулагдлаа)
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeDisplay;