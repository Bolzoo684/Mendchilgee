import QRCode from 'qrcode';
import { GreetingCard, QRData } from '../types';
import { encryptData, generateSecureId } from './encryption';

export const generateQRCode = async (card: GreetingCard): Promise<string> => {
  try {
    const qrData: QRData = {
      id: card.id,
      encryptedData: encryptData(JSON.stringify(card)),
      timestamp: Date.now()
    };

    const qrContent = JSON.stringify(qrData);
    const qrCodeUrl = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'Q',
      width: 300,
      margin: 1,
      color: {
        dark: '#1F2937',
        light: '#FFFFFF'
      }
    });

    return qrCodeUrl;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const downloadQRCode = (qrCodeUrl: string, filename: string, format: 'png' | 'jpg' | 'svg' = 'png') => {
  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = qrCodeUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const shareQRCode = async (qrCodeUrl: string, message: string) => {
  if (navigator.share) {
    try {
      // Convert data URL to blob for sharing
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], 'greeting-card-qr.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'QR Greeting Card',
        text: message,
        files: [file]
      });
    } catch (error) {
      console.error('Sharing failed:', error);
      // Fallback to clipboard
      await navigator.clipboard.writeText(qrCodeUrl);
    }
  } else {
    // Fallback for browsers without Web Share API
    await navigator.clipboard.writeText(qrCodeUrl);
  }
};