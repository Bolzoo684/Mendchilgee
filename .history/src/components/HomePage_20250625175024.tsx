import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, QrCode, Send, ArrowRight, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-amber to-pastel-lime">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-pastel-blue sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-pastel-emerald">GreetQR</span>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-2.5 bg-pastel-blue text-white rounded-lg hover:bg-pastel-cyan transition-colors font-medium"
            >
              Эхлэх
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-pastel-sky text-pastel-blue rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Дижитал мэндчилгээний шинэ арга
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-pastel-blue mb-6 leading-tight">
            Сэтгэлийн
            <span className="bg-gradient-to-r from-pastel-blue via-pastel-violet to-pastel-rose bg-clip-text text-transparent"> мэндчилгээ</span>
            <br />
            QR кодоор
          </h1>
          
          <p className="text-xl text-pastel-violet mb-12 max-w-3xl mx-auto leading-relaxed">
            Хайртай хүмүүстдээ дотоод сэтгэлээсээ гарсан мэндчилгээг QR код ашиглан илгээж, 
            тэдний амьдралд жижиг баяр баясгалан авчирцгаая.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={() => navigate('/create')}
              className="group px-8 py-4 bg-pastel-blue text-white rounded-xl hover:bg-pastel-cyan transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Мэндчилгээ үүсгэх
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-pastel-violet rounded-xl hover:bg-pastel-rose transition-colors font-semibold text-lg border border-pastel-amber shadow-sm">
              Жишээ үзэх
            </button>
          </div>

          {/* Demo QR */}
          <div className="relative max-w-sm mx-auto">
            <div className="bg-pastel-rose rounded-2xl p-8 shadow-2xl border border-pastel-amber">
              <div className="w-48 h-48 bg-pastel-lime rounded-xl mx-auto mb-4 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-pastel-orange" />
              </div>
              <p className="text-pastel-violet font-medium">Утсаар уншуулж мэндчилгээг харна уу</p>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-pastel-amber rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-pastel-orange" fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-pastel-blue mb-4">
              Яагаад GreetQR сонгох вэ?
            </h2>
            <p className="text-xl text-pastel-violet max-w-2xl mx-auto">
              Энгийн, хурдан бөгөөд үр дүнтэй арга замаар мэндчилгээгээ хүргээрэй
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-pastel-cyan hover:bg-pastel-rose transition-all duration-300 border border-transparent hover:border-pastel-blue">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pastel-blue mb-3">Бэлэн загварууд</h3>
              <p className="text-pastel-violet leading-relaxed">
                Төрсөн өдөр, баяр наадам, амжилтын мэндчилгээний олон төрлийн бэлэн загвараас сонгоно уу
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-pastel-cyan hover:bg-pastel-rose transition-all duration-300 border border-transparent hover:border-pastel-blue">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pastel-blue mb-3">Хувийн мэндчилгээ</h3>
              <p className="text-pastel-violet leading-relaxed">
                Дотоод сэтгэлээсээ гарсан өөрийн үгээр бичсэн онцгой мэндчилгээг илгээх боломж
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-pastel-cyan hover:bg-pastel-rose transition-all duration-300 border border-transparent hover:border-pastel-blue">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Send className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pastel-blue mb-3">Хялбар хуваалцах</h3>
              <p className="text-pastel-violet leading-relaxed">
                QR код үүсгэж, зураг болгон хадгалж эсвэл шууд хуваалцан илгээх боломжтой
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pastel-sky via-pastel-violet to-pastel-rose">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-pastel-blue mb-6">
            Өнөөдөр л эхлээрэй
          </h2>
          <p className="text-xl text-pastel-violet mb-10 max-w-2xl mx-auto">
            Хэдхэн секундын дотор сайхан мэндчилгээ үүсгэж, хайртай хүмүүстдээ илгээцгээе
          </p>
          <button
            onClick={() => navigate('/create')}
            className="group px-10 py-5 bg-pastel-blue text-white rounded-xl hover:bg-pastel-cyan transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Мэндчилгээ үүсгэх
            <ArrowRight className="w-6 h-6 ml-3 inline group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;