
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Share2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/utils/analytics';
import { useEffect } from 'react';
import Confetti from '@/components/Confetti';
import CelebrationAnimation from '@/components/CelebrationAnimation';

const ThanksPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    analytics.track('thanks_page_view');
  }, []);

  const handleShare = () => {
    console.log('Share button clicked'); // Добавим логирование для отладки
    const shareText = 'Нашёл крутой сервис для поиска напарника по учёбе! Study Buddy поможет найти того, кто тянет тебя вверх 🚀';
    const shareUrl = window.location.origin;
    
    // Try Web Share API first
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

  const handleChannelSubscribe = () => {
    console.log('Channel subscribe clicked'); // Добавим логирование для отладки
    analytics.track('channel_subscribe_click');
    window.open('https://t.me/pioblog', '_blank', 'noopener,noreferrer');
  };

  const handleReturnHome = () => {
    console.log('Return home clicked'); // Добавим логирование для отладки
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white py-16 relative">
      <Confetti />
      
      <div className="container mx-auto px-6 max-w-2xl">
        <Card className="p-12 text-center border-2 border-[#FECD02] relative overflow-hidden z-10">
          {/* Background celebration pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-gradient-to-br from-[#FECD02] to-transparent pointer-events-none"></div>
          
          <CelebrationAnimation />

          <div className="bg-[#FECD02] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
            <CheckCircle className="w-10 h-10 text-black" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-black relative z-10">
            🎉 Спасибо за заявку!
          </h1>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 relative z-10">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Сейчас мы собираем заявки. 📝</strong><br/>
              Как только запустим подбор напарников, пришлём ссылку на <strong>@hub_hub_bot</strong>. 🤖
            </p>
          </div>

          {/* Telegram channel promotion */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200 relative z-10">
            <div className="flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-800">Следи за обновлениями! 📱</h3>
            </div>
            <p className="text-blue-700 mb-4 text-sm">
              Подпишись на телеграм канал автора, чтобы быть в курсе всех новостей и обновлений сервиса:
            </p>
            <Button
              onClick={handleChannelSubscribe}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 font-semibold w-full sm:w-auto relative z-20 cursor-pointer"
              type="button"
            >
              📺 Подписаться на @pioblog
            </Button>
          </div>

          <div className="border-t pt-8 relative z-10">
            <p className="text-gray-600 mb-6">Поделись с друзьями — помоги им найти Study Buddy тоже! 🤝</p>
            
            <div className="space-y-4">
              <Button
                onClick={handleShare}
                className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-8 py-3 font-semibold w-full sm:w-auto relative z-20 cursor-pointer"
                type="button"
              >
                <Share2 className="w-4 h-4 mr-2" />
                📱 Поделиться в Telegram
              </Button>
              
              <div className="pt-4">
                <Button
                  onClick={handleReturnHome}
                  variant="outline"
                  className="border-2 relative z-20 cursor-pointer"
                  type="button"
                >
                  🏠 Вернуться на главную
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8 relative z-10">
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
    </div>
  );
};

export default ThanksPage;
