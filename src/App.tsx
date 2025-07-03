import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GreetingCardForm from './components/GreetingCardForm';
import QRCodeDisplay from './components/QRCodeDisplay';
import QRScanner from './components/QRScanner';
import MessageDisplay from './components/MessageDisplay';
import ExpiredMessage from './components/ExpiredMessage';
import { GreetingCard, AppView, ScanResult } from './types';
import { cleanupExpiredCards } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('create');
  const [currentCard, setCurrentCard] = useState<GreetingCard | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    // Апп ачаалагдах үед хугацаа дууссан картуудыг цэвэрлэх
    cleanupExpiredCards();
  }, []);

  const handleCardCreated = (card: GreetingCard, qrUrl: string) => {
    setCurrentCard(card);
    setQrCodeUrl(qrUrl);
    setCurrentView('view');
  };

  const handleScanResult = (result: ScanResult) => {
    setScanResult(result);
    if (result.success && result.message) {
      setCurrentCard(result.message);
      setCurrentView('view');
    } else {
      // expired төрлийн алдааг шалгах
      if (result.error === 'expired') {
        setCurrentView('expired');
      } else {
        // Бусад алдааны хувьд мессеж харуулах
        alert(result.error || 'QR код танигдсангүй');
      }
    }
  };

  const handleNavigation = (view: 'create' | 'scan') => {
    setCurrentView(view);
    setCurrentCard(null);
    setQrCodeUrl(null);
    setScanResult(null);
  };

  const handleBack = () => {
    if (currentView === 'view' && qrCodeUrl) {
      // QR дэлгэцээс ирсэн бол үүсгэх хэсэгт буцах
      setCurrentView('create');
    } else if (currentView === 'view' && scanResult) {
      // Мессеж дэлгэцээс ирсэн бол скан хэсэгт буцах
      setCurrentView('scan');
    } else if (currentView === 'expired') {
      // Хугацаа дууссан мессежээс ирсэн бол скан хэсэгт буцах
      setCurrentView('scan');
    }
    
    setCurrentCard(null);
    setQrCodeUrl(null);
    setScanResult(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return <GreetingCardForm onCardCreated={handleCardCreated} />;
      
      case 'scan':
        return <QRScanner onScanResult={handleScanResult} />;
      
      case 'view':
        if (currentCard && qrCodeUrl) {
          return (
            <QRCodeDisplay
              card={currentCard}
              qrCodeUrl={qrCodeUrl}
              onBack={handleBack}
            />
          );
        } else if (currentCard && scanResult?.success) {
          return (
            <MessageDisplay
              card={currentCard}
              onBack={handleBack}
            />
          );
        }
        break;
      
      case 'expired':
        return <ExpiredMessage onBack={handleBack} />;
      
      default:
        return <GreetingCardForm onCardCreated={handleCardCreated} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <Header onNavigate={handleNavigation} currentView={currentView} />
      
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
      
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            QR Мэндчилгээний Картууд - Хайрыг нэг скан хийж хуваалцаарай
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Аюулгүй • Хувийн • Нэг удаагийн хандалт • 24 цагийн хугацаа
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;