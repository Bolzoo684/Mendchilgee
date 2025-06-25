import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, Gift, Star, Sun, Sparkles, User, UserCheck, Edit3, Eye, X, Check } from 'lucide-react';

const presetGreetings = [
  {
    id: 'birthday',
    title: 'Төрсөн өдрийн мэндчилгээ',
    icon: Gift,
    message: '🎉 Төрсөн өдрийн баярын мэнд хүргэе! Таны амьдралын энэ онцгой өдрөөр та аз жаргалтай, эрүүл энхтэй байгаасай. Хүссэн бүхэн биелэгтэй! 🎂',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 border-pink-200'
  },
  {
    id: 'success',
    title: 'Амжилтын мэндчилгээ',
    icon: Star,
    message: '⭐ Таны амжилтанд баяр хүргэе! Хичээл зүтгэлийн үр дүн гарч байгаад сэтгэл хангалуун байна. Цаашид ч илүү том амжилт хүснэ! 🏆',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 'holiday',
    title: 'Баярын мэндчилгээ',
    icon: Sun,
    message: '🎊 Баярын өдрөөр сайхан мэндчилгээ хүргэе! Гэр бүлийнхэнтэйгээ хамт аз жаргалтай, амар амгалан өнгөрүүлээрэй! 🌟',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: 'love',
    title: 'Хайрын мэндчилгээ',
    icon: Heart,
    message: '💖 Чамайг хайрлаж байна! Чи миний амьдралд тусгай утга учиртай хүн. Чамтай хамт байх цаг хугацаа бүр үнэтэй! 🌹',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 border-purple-200'
  }
];

const CreateGreeting: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [previewMode, setPreviewMode] = useState<string | null>(null);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState('');

  const handleCreateGreeting = () => {
    const message = selectedPreset 
      ? presetGreetings.find(g => g.id === selectedPreset)?.message || ''
      : customMessage;

    if (!message.trim() || !senderName.trim()) {
      alert('Мэндчилгээ болон илгээгчийн нэрийг бөглөнө үү!');
      return;
    }

    const greetingData = {
      id: Date.now().toString(),
      message,
      senderName,
      recipientName,
      createdAt: new Date().toISOString(),
      type: selectedPreset || 'custom'
    };

    localStorage.setItem(`greeting_${greetingData.id}`, JSON.stringify(greetingData));
    navigate(`/qr/${greetingData.id}`);
  };

  const handlePreviewGreeting = (greetingId: string) => {
    setPreviewMode(greetingId);
  };

  const handleEditPreset = (greetingId: string) => {
    const greeting = presetGreetings.find(g => g.id === greetingId);
    if (greeting) {
      setEditingPreset(greetingId);
      setEditedMessage(greeting.message);
    }
  };

  const handleSaveEdit = () => {
    if (editingPreset) {
      const greetingIndex = presetGreetings.findIndex(g => g.id === editingPreset);
      if (greetingIndex !== -1) {
        presetGreetings[greetingIndex].message = editedMessage;
        setSelectedPreset(editingPreset);
        setCustomMessage('');
      }
    }
    setEditingPreset(null);
    setEditedMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-slate-600 hover:text-slate-800 transition-all duration-300 mr-6 p-2 hover:bg-slate-100 rounded-lg group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Буцах
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Мэндчилгээ үүсгэх</h1>
              <p className="text-slate-600 mt-1">Дотны хүмүүстдээ илгээх сайхан мэндчилгээ бэлтгээрэй</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Greeting Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preset Greetings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-fade-in">
              <div className="flex items-center mb-6">
                <Sparkles className="w-6 h-6 text-indigo-600 mr-3 animate-pulse" />
                <h2 className="text-xl font-bold text-slate-900">Бэлэн мэндчилгээнүүд</h2>
              </div>
              
              <div className="grid gap-4">
                {presetGreetings.map((greeting, index) => {
                  const IconComponent = greeting.icon;
                  return (
                    <div
                      key={greeting.id}
                      className={`group relative p-5 rounded-xl border-2 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] ${
                        selectedPreset === greeting.id
                          ? `border-indigo-300 ${greeting.bgColor} shadow-md animate-pulse-soft`
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${greeting.color} flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">{greeting.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-3">{greeting.message}</p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handlePreviewGreeting(greeting.id)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          title="Урьдчилан харах"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPreset(greeting.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                          title="Засварлах"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Select Button */}
                      <button
                        onClick={() => {
                          setSelectedPreset(greeting.id);
                          setCustomMessage('');
                        }}
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Message */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-slide-up">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 text-purple-600 mr-3 animate-bounce" />
                <h2 className="text-xl font-bold text-slate-900">Өөрийн мэндчилгээ</h2>
              </div>
              
              <textarea
                value={customMessage}
                onChange={(e) => {
                  setCustomMessage(e.target.value);
                  setSelectedPreset(null);
                }}
                placeholder="Дотоод сэтгэлээсээ гарсан мэндчилгээгээ энд бичнэ үү..."
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-300 focus:shadow-lg"
                rows={8}
              />
              <p className="text-sm text-slate-500 mt-2">
                Хувийн мэндчилгээ бичих нь илүү дотно, онцгой мэдрэмж төрүүлдэг
              </p>
            </div>
          </div>

          {/* Right Column - Form & Preview */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-slide-left">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Мэдээлэл</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Таны нэр *
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Өөрийн нэрээ оруулна уу"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 focus:shadow-lg"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Хүлээн авагч (заавал биш)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Хэнд илгээх вэ?"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 focus:shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {(selectedPreset || customMessage) && senderName && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 animate-fade-in-up">
                <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Урьдчилан харах
                </h3>
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  {recipientName && (
                    <p className="text-indigo-700 font-medium mb-3 animate-slide-right">Хүндэт {recipientName},</p>
                  )}
                  <p className="text-slate-700 mb-3 leading-relaxed animate-fade-in">
                    {selectedPreset 
                      ? presetGreetings.find(g => g.id === selectedPreset)?.message 
                      : customMessage}
                  </p>
                  <p className="text-indigo-700 font-medium animate-slide-left">- {senderName}</p>
                </div>
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreateGreeting}
              disabled={!senderName.trim() || (!customMessage.trim() && !selectedPreset)}
              className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5 mr-2 animate-pulse" />
              QR Код үүсгэх
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-4 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Урьдчилан харах</h3>
              <button
                onClick={() => setPreviewMode(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {presetGreetings.find(g => g.id === previewMode)?.message}
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedPreset(previewMode);
                  setCustomMessage('');
                  setPreviewMode(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Сонгох
              </button>
              <button
                onClick={() => handleEditPreset(previewMode)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Засварлах
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPreset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-4 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Мэндчилгээ засварлах</h3>
              <button
                onClick={() => setEditingPreset(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-300"
              rows={8}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Check className="w-4 h-4 mr-2" />
                Хадгалах
              </button>
              <button
                onClick={() => setEditingPreset(null)}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGreeting;