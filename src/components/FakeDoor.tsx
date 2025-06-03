
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Users, Clock, Share2 } from 'lucide-react';

interface FakeDoorProps {
  userAnswers: any;
}

const FakeDoor = ({ userAnswers }: FakeDoorProps) => {
  const [queueCount, setQueueCount] = useState(147);

  useEffect(() => {
    // Simulate queue counter incrementing
    const interval = setInterval(() => {
      setQueueCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Study Buddy - Учись не в одиночку',
        text: 'Нашёл крутой сервис для поиска напарника по учёбе!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <Card className="p-12 text-center bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Flame className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            🔥 Ты в листе ожидания!
          </h1>

          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Мы подбираем тебе идеального напарника для {userAnswers.goal} по предметам: {userAnswers.subjects?.join(', ')}.
            <br /><br />
            Проверь Telegram — письмо придёт в течение 48 часов.
          </p>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <span className="text-2xl font-bold text-purple-600">+{queueCount}</span>
            </div>
            <p className="text-lg text-gray-700">
              человек уже ищет buddy вместе с тобой
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-semibold text-blue-800">Ожидание</p>
                <p className="text-sm text-blue-600">До 48 часов</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 bg-green-50 rounded-xl">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-semibold text-green-800">Матчинг</p>
                <p className="text-sm text-green-600">По целям и уровню</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <p className="text-gray-600 mb-4">Поделись с друзьями — найди Study Buddy ещё быстрее!</p>
            <Button
              onClick={handleShare}
              variant="outline"
              className="mx-auto px-6 py-3 border-2 border-purple-200 hover:bg-purple-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </Button>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Есть вопросы? Напиши нам в{' '}
            <a href="https://t.me/hub_hub_bot" className="text-purple-600 hover:underline">
              @hub_hub_bot
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FakeDoor;
