import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Sparkles, Eye, Download, Share2 } from 'lucide-react';
import { GreetingCard } from '../types';
import { messageTemplates, getAllCategories, getTemplatesByCategory } from '../utils/messageTemplates';
import { createGreetingCard, checkRateLimit, saveGreetingCard } from '../utils/storage';
import { generateQRCode, downloadQRCode, shareQRCode } from '../utils/qrGenerator';

interface GreetingCardFormProps {
  onCardCreated: (card: GreetingCard, qrCodeUrl: string) => void;
}

const GreetingCardForm: React.FC<GreetingCardFormProps> = ({ onCardCreated }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    recipientName: '',
    selectedTemplate: '',
    customMessage: '',
    category: 'Төрсөн өдөр'
  });
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [characterCount, setCharacterCount] = useState(0);

  const categories = getAllCategories();
  const templates = getTemplatesByCategory(formData.category);

  useEffect(() => {
    const message = isCustomMessage ? formData.customMessage : 
      templates.find(t => t.id === formData.selectedTemplate)?.content || '';
    setCharacterCount(message.length);
  }, [formData.customMessage, formData.selectedTemplate, isCustomMessage, templates]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.senderName.trim()) {
      newErrors.senderName = '✍️ Таны нэрээ оруулна уу';
    } else if (formData.senderName.length < 2) {
      newErrors.senderName = '✍️ Таны нэрээ оруулна уу';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = '💝 Хүлээн авагчийн нэрийг оруулна уу';
    } else if (formData.recipientName.length < 2) {
      newErrors.recipientName = '💝 Хүлээн авагчийн нэрийг оруулна уу';
    }

    if (isCustomMessage) {
      if (!formData.customMessage.trim()) {
        newErrors.message = '💌 Мэндчилгээний агуулга хамгийн багадаа 10 тэмдэгттэй байх ёстой';
      } else if (formData.customMessage.length > 500) {
        newErrors.message = '📝 Мэндчилгээ хэт урт байна (500 тэмдэгт хүртэл)';
      }
    } else {
      if (!formData.selectedTemplate) {
        newErrors.template = 'Мессежийн загвар сонгоно уу';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!checkRateLimit()) {
      setErrors({ general: '⏰ Түр хүлээнэ үү! Дараа дахин оролдоно уу.' });
      return;
    }

    setIsGenerating(true);
    
    try {
      const message = isCustomMessage ? formData.customMessage : 
        templates.find(t => t.id === formData.selectedTemplate)?.content || '';

      const card = createGreetingCard(
        formData.senderName,
        formData.recipientName,
        message,
        formData.category,
        isCustomMessage
      );

      const qrCodeUrl = await generateQRCode(card);
      saveGreetingCard(card);
      onCardCreated(card, qrCodeUrl);
    } catch (error) {
      setErrors({ general: '🔧 Мэндчилгээ үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const getCurrentMessage = () => {
    return isCustomMessage ? formData.customMessage : 
      templates.find(t => t.id === formData.selectedTemplate)?.content || '';
  };

  const renderPreview = () => {
    const message = getCurrentMessage();
    if (!message || !formData.senderName || !formData.recipientName) return null;

    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          Таны мэндчилгээ ✨
        </h3>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Хэнд:</span> {formData.recipientName || '___'} 💝
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Хэнээс:</span> {formData.senderName || '___'} 💌
          </p>
          <div className="border-t pt-2 mt-2">
            <p className="text-gray-700 italic">"{getCurrentMessage() || 'Мэндчилгээний текст энд харагдана...'}"</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Илгээгч болон хүлээн авагчийн мэдээлэл */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Хэн хэнд зориулсан бэ?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-2">
                Илгээгчийн нэр 💌
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.senderName ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Таны нэр"
                maxLength={50}
              />
              {errors.senderName && (
                <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                Хүлээн авагчийн нэр 🎁
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.recipientName ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Хэнд илгээх вэ?"
                maxLength={50}
              />
              {errors.recipientName && (
                <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Мессеж сонгох */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Ямар мэндчилгээ илгээх вэ?
          </h2>

          {/* Мессежийн төрөл сонгох */}
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setIsCustomMessage(false)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                !isCustomMessage
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="h-4 w-4 inline mr-2" />
              Бэлэн загварууд
            </button>
            <button
              type="button"
              onClick={() => setIsCustomMessage(true)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isCustomMessage
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Хувийн мессеж
            </button>
          </div>

          {!isCustomMessage ? (
            <div className="space-y-4">
              {/* Ангилал сонгох */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ангилал
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, selectedTemplate: '' })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Загвар сонгох */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Загвар сонгох *
                </label>
                <div className="grid gap-3">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, selectedTemplate: template.id })}
                    >
                      <h4 className="font-medium text-gray-800 mb-2">{template.title}</h4>
                      <p className="text-sm text-gray-600">{template.preview}</p>
                    </div>
                  ))}
                </div>
                {errors.template && (
                  <p className="text-red-500 text-sm mt-1">{errors.template}</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Таны хувийн мессеж *
              </label>
              <textarea
                value={formData.customMessage}
                onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.message ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Сэтгэлийн мэдээллээ энд бичнэ үү..."
                rows={6}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message}</p>
                )}
                <p className={`text-sm ml-auto ${characterCount > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                  {characterCount}/500 тэмдэгт
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Урьдчилан харах хэсэг */}
        {(formData.senderName && formData.recipientName && getCurrentMessage()) && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Урьдчилан харах
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {showPreview ? 'Нуух' : 'Харуулах'}
              </button>
            </div>
            
            {showPreview && renderPreview()}
          </div>
        )}

        {/* Алдааны мессеж */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{errors.general}</p>
          </div>
        )}

        {/* Илгээх товч */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isGenerating ? 'Бэлдэж байна... ✨' : 'QR код үүсгэх 🎉'}
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mb-6">
          QR код үүсгэснээр таны мэндчилгээ 24 цагийн турш идэвхтэй байх болно 🕐
        </p>
      </form>
    </div>
  );
};

export default GreetingCardForm;