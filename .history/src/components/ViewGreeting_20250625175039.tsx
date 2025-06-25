import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Gift, Star, Sun, Home, Sparkles, ArrowDown } from 'lucide-react';

interface GreetingData {
  id: string;
  message: string;
  senderName: string;
  recipientName: string;
  createdAt: string;
  type: string;
}

const getGreetingIcon = (type: string) => {
  switch (type) {
    case 'birthday': return Gift;
    case 'success': return Star;
    case 'holiday': return Sun;
    case 'love': return Heart;
    default: return Heart;
  }
};

const getGreetingColors = (type: string) => {
  switch (type) {
    case 'birthday': return {
      gradient: 'from-pink-500 to-rose-500',
      bg: 'from-pink-50 via-rose-50 to-pink-100',
      accent: 'text-pink-600',
      particles: 'text-pink-400'
    };
    case 'success': return {
      gradient: 'from-yellow-500 to-orange-500',
      bg: 'from-yellow-50 via-orange-50 to-yellow-100',
      accent: 'text-yellow-600',
      particles: 'text-yellow-400'
    };
    case 'holiday': return {
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'from-emerald-50 via-teal-50 to-emerald-100',
      accent: 'text-emerald-600',
      particles: 'text-emerald-400'
    };
    case 'love': return {
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-50 via-pink-50 to-purple-100',
      accent: 'text-purple-600',
      particles: 'text-purple-400'
    };
    default: return {
      gradient: 'from-indigo-500 to-purple-500',
      bg: 'from-indigo-50 via-purple-50 to-indigo-100',
      accent: 'text-indigo-600',
      particles: 'text-indigo-400'
    };
  }
};

const ViewGreeting: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [greetingData, setGreetingData] = useState<GreetingData | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem(`greeting_${id}`);
    if (stored) {
      const data = JSON.parse(stored) as GreetingData;
      setGreetingData(data);
      
      setTimeout(() => setShowAnimation(true), 500);
      setTimeout(() => setShowContent(true), 1500);
    }
  }, [id]);

  if (!greetingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-sky to-pastel-violet flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-200 border-b-purple-600 mx-auto animate-spin-reverse"></div>
          </div>
          <p className="text-pastel-violet text-lg font-medium animate-pulse">Мэндчилгээ ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  const IconComponent = getGreetingIcon(greetingData.type);
  const colors = getGreetingColors(greetingData.type);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pastel-sky to-pastel-violet relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        {showAnimation && Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-30 ${colors.particles}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Welcome Animation */}
      {!showContent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-indigo-600 to-purple-600">
          <div className="text-center text-white">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-bounce-slow`}>
              <IconComponent className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">Мэндчилгээ ирлээ!</h1>
            <div className="flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <ArrowDown className="w-6 h-6 animate-bounce mr-2" />
              <p className="text-xl">Доош гүйлгэнэ үү</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center p-6 transition-all duration-1000 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}>
        <div className="max-w-3xl mx-auto">
          {/* Main Greeting Card */}
          <div className="bg-pastel-rose/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-pastel-amber/30 p-8 md:p-12 text-center relative overflow-hidden">
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pastel-blue via-pastel-violet to-pastel-rose"></div>
            
            {/* Header Icon */}
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-2xl mb-8 shadow-xl transform transition-all duration-1000 animate-scale-bounce`}>
              <IconComponent className="w-12 h-12 text-white" />
            </div>

            {/* Recipient Greeting */}
            {greetingData.recipientName && (
              <div className="mb-8 animate-slide-down" style={{ animationDelay: '0.3s' }}>
                <h1 className="text-4xl md:text-5xl font-bold text-pastel-blue mb-4">
                  Сайн байна уу,
                </h1>
                <h2 className={`text-3xl md:text-4xl font-bold ${colors.accent} mb-4`}>
                  {greetingData.recipientName}!
                </h2>
                <div className={`w-32 h-1 bg-gradient-to-r ${colors.gradient} rounded-full mx-auto animate-expand`}></div>
              </div>
            )}

            {/* Main Message */}
            <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pastel-sky to-pastel-violet rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                <p className="text-lg md:text-xl leading-relaxed text-pastel-violet whitespace-pre-line font-medium relative z-10 animate-typewriter">
                  {greetingData.message}
                </p>
              </div>
            </div>

            {/* Sender Info */}
            <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <div className="text-right">
                <p className="text-2xl font-bold text-pastel-blue mb-2">
                  — {greetingData.senderName}
                </p>
                <p className="text-sm text-pastel-violet flex items-center justify-end">
                  <Heart className="w-4 h-4 mr-2 text-red-400 animate-pulse" />
                  {new Date(greetingData.createdAt).toLocaleDateString('mn-MN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="relative mb-8">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-4">
                  <Heart className={`w-6 h-6 ${colors.accent} animate-pulse`} fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              <p className="text-pastel-violet mb-6 text-lg">
                Та ч дотны хүмүүстдээ мэндчилгээ илгээж баярлуулаарай!
              </p>
              <a
                href="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 text-lg group"
              >
                <Home className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Мэндчилгээ үүсгэх
              </a>
            </div>
          </div>

          {/* Floating Hearts Animation */}
          {showContent && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float-heart opacity-60"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  <Heart 
                    className={`w-6 h-6 ${colors.accent} animate-pulse`}
                    fill="currentColor"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
        }
        
        @keyframes float-heart {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scale-bounce {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes slide-down {
          0% { transform: translateY(-50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes expand {
          0% { width: 0; }
          100% { width: 8rem; }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-heart { animation: float-heart 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-scale-bounce { animation: scale-bounce 1s ease-out; }
        .animate-slide-down { animation: slide-down 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-expand { animation: expand 1s ease-out; }
        .animate-spin-reverse { animation: spin-reverse 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ViewGreeting;