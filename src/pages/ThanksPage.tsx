
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/utils/analytics';
import { useEffect, useState } from 'react';
import { Fireworks } from '@/components/Fireworks';

const ThanksPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    analytics.track('thanks_page_view');
  }, []);

  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFireworks(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    const shareText = 'Нашёл крутой сервис для поиска напарника по учёбе! Study Buddy поможет найти того, кто тянет тебя вверх 🚀';
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'Study Buddy - Учись не один 🎓',
        text: shareText,
        url: shareUrl
      }).then(() => {
        analytics.track('share_success', { method: 'native' });
      }).catch((error) => {
        console.log('Native share failed, falling back to Telegram:', error);
        openTelegramShare();
      });
    } else {
      openTelegramShare();
    }
  };

  const openTelegramShare = () => {
    const shareText = 'Нашёл крутой сервис для поиска напарника по учёбе! Study Buddy поможет найти того, кто тянет тебя вверх 🚀';
    const shareUrl = window.location.origin;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    
    analytics.track('share_success', { method: 'telegram' });
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white py-16 relative overflow-x-hidden">
      {showFireworks && <Fireworks />}
      <div className="container mx-auto px-6 max-w-2xl relative z-10">
        <Card className="p-12 text-center border-2 border-[#FECD02] animate-fade-in">
          <div className="bg-[#FECD02] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-black" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-black">
            🎊 Заявка отправлена! <span className="inline-block animate-wiggle text-[#FECD02] ml-1">Ура!</span>
          </h1>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Сейчас мы собираем заявки. 📝</strong><br/>
              Как только запустим подбор напарников, пришлём ссылку на <strong>@hub_hub_bot</strong>. 🤖
            </p>
          </div>

          <div className="mb-10">
            <div className="bg-[#fef2c0] border border-[#ffe492] rounded-xl p-4 shadow-lg flex flex-col items-center gap-3 animate-fade-in">
              <span className="text-lg font-semibold text-[#FECD02] flex items-center gap-1">
                📢 Спец. рекомендация:
              </span>
              <span className="text-gray-800 text-base">
                Чтобы не пропустить новые фишки и анонсы, <br />
                <a href="https://t.me/pioblog" target="_blank" rel="noopener noreferrer" className="text-[#229ED9] underline font-bold hover:text-[#1576a9] transition">
                  подпишись на Telegram-канал автора — @pioblog
                </a>
              </span>
              <span className="text-xs text-gray-500 pt-1">Будь в курсе: разработки, советы по учёбе, инсайды!</span>
            </div>
          </div>

          <div className="border-t pt-8">
            <p className="text-gray-600 mb-6">Поделись с друзьями — помоги им найти Study Buddy тоже! 🤝</p>
            
            <div className="space-y-4">
              <Button
                onClick={handleShare}
                className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-8 py-3 font-semibold w-full sm:w-auto animate-fade-in"
              >
                <Share2 className="w-4 h-4 mr-2" />
                📱 Поделиться в Telegram
              </Button>
              
              <div className="pt-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-2"
                >
                  🏠 Вернуться на главную
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8 animate-fade-in">
          <p className="text-sm text-gray-500">
            Есть вопросы? Напиши нам в{' '}
            <a href="https://t.me/hub_hub_bot" className="text-[#FECD02] hover:underline font-semibold">
              @hub_hub_bot
            </a> 💬
          </p>
          <p className="text-sm text-gray-500 mt-2">
            создатель: {' '}
            <a 
              href="https://t.me/piofant" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FECD02] hover:underline font-semibold"
            >
              @piofant
            </a>
          </p>
        </div>
      </div>
      <style>
        {`
        .animate-wiggle {
          animation: wiggle 0.8s infinite alternate;
        }
        @keyframes wiggle {
          0% { transform: rotate(-7deg) scale(1.1);}
          100% { transform: rotate(12deg) scale(1.07);}
        }
        `}
      </style>
    </div>
  );
};

export default ThanksPage;

