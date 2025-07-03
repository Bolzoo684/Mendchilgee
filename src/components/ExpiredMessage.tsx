import React from 'react';
import { Clock, AlertCircle, ArrowLeft, Heart, Sparkles } from 'lucide-react';

interface ExpiredMessageProps {
  onBack: () => void;
}

const ExpiredMessage: React.FC<ExpiredMessageProps> = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-slide-up">
            💫 Уучлаарай, энэ мэндчилгээ нээгдэхгүй байна
          </h2>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6 animate-slide-up-delay">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
              <span className="font-semibold text-purple-800">Нууцлалтай мэдэгдэл</span>
            </div>
            
            <p className="text-purple-700 mb-4 leading-relaxed">
              Таны хайртай хүнээс ирсэн энэхүү дурсамж одоо харах боломжгүй байна. 
              Магадгүй энэ нь аль хэдийн нээгдсэн эсвэл хүчинтэй хугацаа нь дууссан байж болзошгүй.
            </p>
            
            <div className="text-left bg-white/70 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Боломжит шалтгаанууд:
              </h4>
              <ul className="text-sm text-purple-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✨</span>
                  <span>Энэ бол нэг удаагийн мэндчилгээ байсан бөгөөд аль хэдийн нээгдсэн</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">⏰</span>
                  <span>24 цагийн дотор нээгдээгүй учир автоматаар устсан</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🔐</span>
                  <span>QR код эвдэрсэн эсвэл буруу уншигдсан</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">💝</span>
                  <span>Илгээгч мэндчилгээгээ буцаан авсан</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4 animate-slide-up-delay-2">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Дахин оролдох
            </button>
            
            <p className="text-sm text-gray-600">
              Танд мэндчилгээ илгээх гэж байна уу?{' '}
              <button
                onClick={() => window.location.reload()}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-medium"
              >
                Шинэ карт үүсгэх ✨
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredMessage;