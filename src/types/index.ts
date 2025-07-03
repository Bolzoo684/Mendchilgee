export interface GreetingCard {
  id: string;
  senderName: string;
  recipientName: string;
  message: string;
  category: string;
  createdAt: number;
  expiresAt: number;
  isCustomMessage: boolean;
  accessCount: number;
  maxAccess: number;
}

export interface QRData {
  id: string;
  encryptedData: string;
  timestamp: number;
}

export interface MessageTemplate {
  id: string;
  category: string;
  title: string;
  content: string;
  preview: string;
}

export interface ScanResult {
  success: boolean;
  message?: GreetingCard;
  error?: string;
}

export type AppView = 'create' | 'scan' | 'view' | 'expired';

export interface AppState {
  currentView: AppView;
  currentCard: GreetingCard | null;
  qrCodeUrl: string | null;
  scanResult: ScanResult | null;
  isLoading: boolean;
  error: string | null;
}