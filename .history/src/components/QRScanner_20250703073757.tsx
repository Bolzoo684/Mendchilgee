import React, { useEffect, useRef, useState } from 'react';
import { Camera, Upload, AlertCircle } from 'lucide-react';
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
              handleScanResult(result.data);
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
        setCameraError('Камерт хандах эрх хүссэнгүй эсвэл боломжгүй');
      }
    };

    initializeScanner();

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, []);

  const handleScanResult = (data: string) => {
    try {
      const qrData: QRData = JSON.parse(data);
      
      if (!qrData.id || !qrData.encryptedData) {
        throw new Error('Буруу QR кодын формат');
      }

      const decryptedData = decryptData(qrData.encryptedData);
      const card: GreetingCard = JSON.parse(decryptedData);

      // Карт байгаа эсэх болон хүчинтэй эсэхийг шалгах
      const storedCard = getGreetingCard(card.id);
      if (!storedCard) {
        onScanResult({ success: false, error: 'Энэ мэндчилгээний карт хугацаа дууссан эсвэл аль хэдийн үзсэн байна.' });
        return;
      }

      // Хандалтын тоог шинэчлэх
      updateCardAccess(card.id);

      onScanResult({ success: true, message: storedCard });
    } catch (error) {
      console.error('QR скан боловсруулахад алдаа гарлаа:', error);
      onScanResult({ success: false, error: 'Буруу QR код эсвэл мэндчилгээний карт хугацаа дууссан байна.' });
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
      setCameraError('Камер асаахад алдаа гарлаа. Зөвшөөрлийг шалгана уу.');
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

    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then((result) => {
        handleScanResult(result.data);
      })
      .catch((error) => {
        console.error('Файл скан хийхэд алдаа гарлаа:', error);
        onScanResult({ success: false, error: 'Хуулсан зурагт QR код олдсонгүй.' });
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            QR Мэндчилгээний карт скан хийх
          </h2>
          <p className="text-gray-600">
            Камераа ашиглан QR код скан хийх эсвэл зураг хуулах
          </p>
        </div>

        {/* Камерын сканнер */}
        {hasCamera && !cameraError && (
          <div className="mb-6">
            <div className="relative bg-gray-100 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-80 object-cover"
                style={{ display: isScanning ? 'block' : 'none' }}
              />
              
              {!isScanning && (
                <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">QR код скан хийхэд бэлэн</p>
                    <button
                      onClick={startScanning}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Камер асаах
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {isScanning && (
              <div className="text-center mt-4">
                <button
                  onClick={stopScanning}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Камер унтраах
                </button>
              </div>
            )}
          </div>
        )}

        {/* Камерын алдаа */}
        {cameraError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Файл хуулах сонголт */}
        <div className="border-t pt-6">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              QR кодын зураг хуулах
            </h3>
            <p className="text-gray-600 mb-4">
              Камер байхгүй юу? Оронд нь QR код бүхий зураг хуулна уу
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Зураг сонгох
            </button>
          </div>
        </div>

        {/* Заавар */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Скан хийх заавар</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Төхөөрөмжөө тогтвортой барьж, сайн гэрэлтэй байлгана уу</li>
            <li>• QR кодыг камерын хүрээнд байрлуулна уу</li>
            <li>• Илрүүлэх үед скан автоматаар хийгдэнэ</li>
            <li>• QR код бүрийг зөвхөн нэг удаа скан хийж болно</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;