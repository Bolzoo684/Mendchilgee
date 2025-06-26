import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Copy, CheckCircle, Plus, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface GreetingData {
  id: string;
  message: string;
  senderName: string;
  recipientName: string;
  createdAt: string;
  type: string;
}

const QRDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [greetingData, setGreetingData] = useState<GreetingData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/greeting/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(data => {
        setGreetingData(data);
        const greetingUrl = `${window.location.origin}/greeting/${id}`;
        QRCode.toDataURL(greetingUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          }
        }).then(url => {
          setQrCodeUrl(url);
        });
      })
      .catch(() => {
        navigate('/');
      });
  }, [id, navigate]);

  const handleCopyLink = () => {
    const greetingUrl = `${window.location.origin}/greeting/${id}`;
    navigator.clipboard.writeText(greetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `greeting-qr-${id}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleShare = async () => {
    const greetingUrl = `${window.location.origin}/greeting/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Мэндчилгээ',
          text: `${greetingData?.senderName}-с мэндчилгээ ирлээ!`,
          url: greetingUrl,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (!greetingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/create')}
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mr-6 p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Буцах
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Таны QR код бэлэн боллоо!</h1>
              <p className="text-slate-600 mt-1">Доорх кодыг хуваалцан мэндчилгээгээ хүргээрэй</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Амжилттай үүслээ!</h2>
              <p className="text-slate-600">QR кодыг уншуулж мэндчилгээг харна уу</p>
            </div>

            {qrCodeUrl && (
              <div className="mb-8">
                <div className="inline-block p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 mx-auto" />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleDownloadQR}
                className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                QR код татаж авах
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Хуваалцах
              </button>

              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center px-4 py-3 rounded-xl transition-colors font-medium ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                <Copy className="w-5 h-5 mr-2" />
                {copied ? 'Хуулагдлаа!' : 'Линк хуулах'}
              </button>
            </div>
          </div>

          {/* Greeting Info */}
          <div className="space-y-6">
            {/* Greeting Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Мэндчилгээний мэдээлэл</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Илгээгч:</span>
                  <span className="font-medium text-slate-900">{greetingData.senderName}</span>
                </div>
                {greetingData.recipientName && (
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Хүлээн авагч:</span>
                    <span className="font-medium text-slate-900">{greetingData.recipientName}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Үүссэн:</span>
                  <span className="font-medium text-slate-900">
                    {new Date(greetingData.createdAt).toLocaleDateString('mn-MN')}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Төрөл:</span>
                  <span className="font-medium text-slate-900">
                    {greetingData.type === 'custom' ? 'Хувийн' : 'Бэлэн загвар'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Link */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Мэндчилгээг урьдчилан харах</h3>
              <p className="text-slate-600 mb-4">
                Хүлээн авагч ямар мэндчилгээ харахыг урьдчилан шалгаж болно
              </p>
              <a
                href={`/greeting/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium border border-indigo-200"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Харах
              </a>
            </div>

            {/* Create Another */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Өөр мэндчилгээ үүсгэх үү?</h3>
              <p className="text-slate-600 mb-4">
                Илүү олон хүнд мэндчилгээ илгээж баяр баясгалан тараацгаая
              </p>
              <button
                onClick={() => navigate('/create')}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Шинэ мэндчилгээ үүсгэх
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRDisplay;