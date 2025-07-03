import React, { useEffect, useRef, useState } from 'react';
import { Camera, Upload, AlertCircle, Sparkles, Heart, QrCode } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { GreetingCard, QRData } from '../types';
import { decryptData } from '../utils/encryption';
import { getGreetingCard, updateCardAccess } from '../utils/storage';

interface QRScannerProps {
  onScanResult: (result: { success: boolean; message?: GreetingCard; error?: string }) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeScanner = async () => {
      if (!videoRef.current) return;

      try {
        const hasPermission = await QrScanner.hasCamera();
        setHasCamera(hasPermission);

        if (hasPermission) {
          const scanner = new QrScanner(
            videoRef.current,
            (result) => {
              if (!isProcessing) {
                handleScanResult(result.data);
              }
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
              preferredCamera: 'environment',
            }
          );

          setQrScanner(scanner);
        }
      } catch (error) {
        console.error('Сканнер эхлүүлэхэд алдаа гарлаа:', error);
        setCameraError('📷 Камерт хандах эрх өгнө үү');
      }
    };

    initializeScanner();

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [isProcessing]);

  const handleScanResult = async (data: string) => {
    setIsProcessing(true);
    
    try {
      // QR кодын өгөгдлийг шалгах
      let qrData: QRData;
      try {
        qrData = JSON.parse(data);
      } catch (parseError) {
        console.error('QR код JSON форматгүй:', parseError);
        onScanResult({ 
          success: false, 
          error: '🔍 Энэ QR код мэндчилгээний карт биш байна' 
        });
        return;
      }
      
      if (!qrData.id || !qrData.encryptedData) {
        onScanResult({ 
          success: false, 
          error: '❌ QR кодын формат буруу байна' 
        });
        return;
      }

      // Мэдээллийг тайлах
      let decryptedData: string;
      try {
        decryptedData = decryptData(qrData.encryptedData);
      } catch (decryptError) {
        console.error('Тайлах алдаа:', decryptError);
        onScanResult({ 
          success: false, 
          error: '🔐 QR код эвдэрсэн эсвэл хуучин хувилбар байна' 
        });
        return;
      }

      let card: GreetingCard;
      try {
        card = JSON.parse(decryptedData);
      } catch (cardParseError) {
        console.error('Карт өгөгдөл алдаатай:', cardParseError);
        onScanResult({ 
          success: false, 
          error: '💔 Мэндчилгээний мэдээлэл алдаатай байна' 
        });
        return;
      }

      // Карт байгаа эсэх болон хүчинтэй эсэхийг шалгах
      const storedCard = getGreetingCard(card.id);
      if (!storedCard) {
        // Дэлгэрэнгүй алдааны мессеж
        onScanResult({ 
          success: false, 
          error: 'expired' // Тусгай төрөл 
        });
        return;
      }

      // Скан амжилттай болсон анимэйшн харуулах
      if (qrScanner) {
        qrScanner.stop();
        setIsScanning(false);
      }

      // Хандалтын тоог шинэчлэх
      updateCardAccess(card.id);

      // Жаахан хүлээгээд дараа нь үр дүнг харуулах
      setTimeout(() => {
        onScanResult({ success: true, message: storedCard });
      }, 500);
      
    } catch (error) {
      console.error('QR скан боловсруулахад алдаа гарлаа:', error);
      onScanResult({ 
        success: false, 
        error: '⚠️ QR код уншихад алдаа гарлаа. Дахин оролдоно уу!' 
      });
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  const startScanning = async () => {
    if (!qrScanner) return;

    try {
      setIsScanning(true);
      setCameraError(null);
      await qrScanner.start();
    } catch (error) {
      console.error('Камер асаахад алдаа гарлаа:', error);
      setCameraError('📷 Камерын зөвшөөрөл хэрэгтэй байна');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScanner) {
      qrScanner.stop();
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    // Файлын төрөл шалгах
    if (!file.type.startsWith('image/')) {
      onScanResult({ 
        success: false, 
        error: '🖼️ Зураг файл сонгоно уу (PNG, JPG, JPEG)' 
      });
      setIsProcessing(false);
      return;
    }

    // Файлын хэмжээ шалгах (10MB хүртэл)
    if (file.size > 10 * 1024 * 1024) {
      onScanResult({ 
        success: false, 
        error: '📏 Файлын хэмжээ хэт том байна (10MB хүртэл)' 
      });
      setIsProcessing(false);
      return;
    }

    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then((result) => {
        handleScanResult(result.data);
      })
      .catch((error) => {
        console.error('Файл скан хийхэд алдаа гарлаа:', error);
        
        // Алдааны төрлөөр ялгаж мессеж өгөх
        let errorMessage = '📸 Зурган дотроос QR код олдсонгүй';
        
        if (error.message?.includes('No QR code found')) {
          errorMessage = '🔍 Энэ зурагт QR код алга байна';
        } else if (error.message?.includes('Invalid')) {
          errorMessage = '❌ Зургийн файл эвдэрсэн байна';
        } else if (error.message?.includes('decode')) {
          errorMessage = '🔄 QR код уншихад алдаа гарлаа';
        }
        
        onScanResult({ 
          success: false, 
          error: errorMessage 
        });
        setIsProcessing(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
            <QrCode className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-slide-up">
            ✨ Мэндчилгээгээ нээцгээе
          </h2>
          <p className="text-gray-600 animate-slide-up-delay">
            QR кодоо уншуулснаар танд зориулсан онцгой мэндчилгээг үзэх боломжтой
          </p>
        </div>

        {/* Камерын сканнер */}
        {hasCamera && !cameraError && (
          <div className="mb-6">
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-80 object-cover"
                style={{ display: isScanning ? 'block' : 'none' }}
              />
              
              {!isScanning && (
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                      <Camera className="h-10 w-10 text-purple-600" />
                    </div>
                    <p className="text-gray-700 mb-4 font-medium">Камераа асааж QR код уншуулна уу</p>
                    <button
                      onClick={startScanning}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Camera className="inline-block h-4 w-4 mr-2" />
                      Камер асаах
                    </button>
                  </div>
                </div>
              )}

              {/* Скан хийж байх үеийн анимэйшн */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 border-4 border-purple-400 rounded-lg animate-scan-line"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Боловсруулж байх үеийн анимэйшн */}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="h-12 w-12 text-pink-600 animate-bounce mx-auto mb-2" />
                    <p className="text-purple-700 font-medium">Танигдаж байна...</p>
                  </div>
                </div>
              )}
            </div>
            
            {isScanning && (
              <div className="text-center mt-4 animate-fade-in">
                <button
                  onClick={stopScanning}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all shadow-md transform hover:scale-105"
                >
                  Зогсоох
                </button>
              </div>
            )}
          </div>
        )}

        {/* Камерын алдаа */}
        {cameraError && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg animate-slide-up">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-purple-600 mr-2" />
              <p className="text-purple-700">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Файл хуулах сонголт */}
        <div className="border-t pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🖼️ Зураг оруулах
            </h3>
            <p className="text-gray-600 mb-4">
              Камер ашиглахгүйгээр QR код бүхий зургаа оруулж болно
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="inline-block h-4 w-4 mr-2" />
              Зураг сонгох
            </button>
          </div>
        </div>

        {/* Заавар */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg animate-slide-up-delay">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            Жижиг зөвлөмж
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-blue-700 mb-2">📱 Камераар скан хийх:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>QR кодыг хүрээнд багтаахад автоматаар танина</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Сайн гэрэлтэй газар скан хийгээрэй</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Камерыг тогтвортой барьж байгаарай</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-700 mb-2">🖼️ Зураг оруулах:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>PNG, JPG, JPEG форматыг дэмждэг</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>QR код тод харагдсан зураг ашиглаарай</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>10MB хүртэлх хэмжээтэй файл</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div className="text-yellow-800">
                <p className="font-medium mb-1">Анхаар:</p>
                <p className="text-sm">Мэндчилгээ нэг л удаа нээгдэх тул анхааралтай байгаарай. 24 цагийн дотор нээгээрэй, эс бөгөөс устана.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;