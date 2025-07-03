import { GreetingCard } from '../types';
import { generateSecureId } from './encryption';

const STORAGE_KEY = 'qr_greeting_cards';
const RATE_LIMIT_KEY = 'qr_rate_limit';

export const saveGreetingCard = (card: GreetingCard): void => {
  try {
    const existingCards = getStoredCards();
    const updatedCards = [...existingCards, card];
    
    // Keep only last 100 cards for performance
    const cardsToKeep = updatedCards.slice(-100);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsToKeep));
  } catch (error) {
    console.error('Failed to save greeting card:', error);
  }
};

export const getGreetingCard = (id: string): GreetingCard | null => {
  try {
    const cards = getStoredCards();
    const card = cards.find(c => c.id === id);
    
    if (!card) return null;
    
    // Check if card has expired
    if (Date.now() > card.expiresAt) {
      removeGreetingCard(id);
      return null;
    }
    
    // Check access count
    if (card.accessCount >= card.maxAccess) {
      removeGreetingCard(id);
      return null;
    }
    
    return card;
  } catch (error) {
    console.error('Failed to retrieve greeting card:', error);
    return null;
  }
};

export const updateCardAccess = (id: string): void => {
  try {
    const cards = getStoredCards();
    const cardIndex = cards.findIndex(c => c.id === id);
    
    if (cardIndex !== -1) {
      cards[cardIndex].accessCount += 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  } catch (error) {
    console.error('Failed to update card access:', error);
  }
};

export const removeGreetingCard = (id: string): void => {
  try {
    const cards = getStoredCards();
    const filteredCards = cards.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards));
  } catch (error) {
    console.error('Failed to remove greeting card:', error);
  }
};

export const getStoredCards = (): GreetingCard[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to retrieve stored cards:', error);
    return [];
  }
};

export const cleanupExpiredCards = (): void => {
  try {
    const cards = getStoredCards();
    const now = Date.now();
    const validCards = cards.filter(card => now <= card.expiresAt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validCards));
  } catch (error) {
    console.error('Failed to cleanup expired cards:', error);
  }
};

// Rate limiting functionality
export const checkRateLimit = (): boolean => {
  try {
    const rateLimitData = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (!rateLimitData) {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    
    const { count, timestamp } = JSON.parse(rateLimitData);
    const hourInMs = 60 * 60 * 1000;
    
    // Reset counter if more than an hour has passed
    if (now - timestamp > hourInMs) {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    
    // Allow up to 10 cards per hour
    if (count >= 10) {
      return false;
    }
    
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: count + 1, timestamp }));
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow on error
  }
};

export const createGreetingCard = (
  senderName: string,
  recipientName: string,
  message: string,
  category: string,
  isCustomMessage: boolean = false
): GreetingCard => {
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours
  
  return {
    id: generateSecureId(),
    senderName: sanitizeInput(senderName),
    recipientName: sanitizeInput(recipientName),
    message: sanitizeInput(message),
    category: sanitizeInput(category),
    createdAt: now,
    expiresAt,
    isCustomMessage,
    accessCount: 0,
    maxAccess: 1 // One-time access
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .trim()
    .substring(0, 500); // Limit length
};