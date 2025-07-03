import React from 'react';
import { Clock, AlertCircle, ArrowLeft } from 'lucide-react';

interface ExpiredMessageProps {
  onBack: () => void;
}

const ExpiredMessage: React.FC<ExpiredMessageProps> = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Мессежийн хугацаа дууссан
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              <span className="font-semibold text-red-800">Хандалт хориглогдсон</span>
            </div>
            
            <p className="text-red-700 mb-4">
              Энэ мэндчилгээний карт хугацаа дууссан эсвэл аль хэдийн үзсэн байна.
            </p>
            
            <div className="text-left">
              <h4 className="font-semibold text-red-800 mb-2">Боломжит шалтгаанууд:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Мессеж 24 цагаас илүү хугацааны өмнө үүсгэгдсэн</li>
                <li>• Энэ QR кодыг аль хэдийн нэг удаа скан хийсэн</li>
                <li>• QR код буруу эсвэл эвдэрсэн</li>
                <li>• Мессежийг гараар устгасан</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Сканнер руу буцах
            </button>
            
            <p className="text-sm text-gray-600">
              Шинэ мэндчилгээний карт үүсгэх хэрэгтэй юу?{' '}
              <button
                onClick={() => window.location.reload()}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Дахин эхлэх
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredMessage;