
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Users, TrendingUp, Timer, HandHeart, BarChart3, BookOpen, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { analytics } from '@/utils/analytics';

const NewLandingPage = () => {
  const navigate = useNavigate();
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    // Track page view
    analytics.track('page_view', { page: 'landing' });
    
    // Get real application count
    const stats = analytics.getStats();
    setApplicationsCount(stats.filledForms);
  }, []);

  const handleCTAClick = () => {
    console.log('CTA clicked - navigating to form');
    analytics.track('cta_click');
    navigate('/form');
  };

  const testimonials = [
    "Стыдно срывать дедлайны, когда напарник ждёт 😅",
    "Вместе решать задачи намного легче и веселее 🎉", 
    "Buddy помог мне не забросить подготовку 💪"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Учись не один: Study Buddy для ЕГЭ и олимпиад 🚀
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Мы подберём тебе напарника, который тянет тебя вверх ⬆️
          </p>
          
          <Button 
            onClick={handleCTAClick}
            className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Подобрать напарника 🤝
          </Button>
        </div>

        {/* Scientific Foundation */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-black mb-4">🧠 Научная обоснованность</h2>
          </div>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-[#FECD02]">
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>Джеймс Клир</strong> в книге <em>«Atomic Habits»</em> выводит концепт 
              <strong> habit contract + accountability partner</strong> — внешнее обязательство перед другим человеком 
              резко повышает вероятность выполнения привычки. 📈
            </p>
            <div className="mt-4 text-sm">
              <a 
                href="https://summit-of-self.com/atomic-habits-17-strengthening-commitments-with-habit-contracts-accountability-partners/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Подробнее о habit contracts →
              </a>
            </div>
          </Card>
        </div>

        {/* Pain + Gain */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center border-2 border-gray-100 hover:border-[#FECD02] transition-colors">
            <div className="bg-[#FECD02] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-black">⏰ Меньше прокрастинации</h3>
            <p className="text-gray-600">Внешний контроль и ответственность перед напарником</p>
          </Card>

          <Card className="p-8 text-center border-2 border-gray-100 hover:border-[#FECD02] transition-colors">
            <div className="bg-[#FECD02] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HandHeart className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-black">🤝 Поддержка</h3>
            <p className="text-gray-600">Взаимная мотивация в трудные моменты подготовки</p>
          </Card>

          <Card className="p-8 text-center border-2 border-gray-100 hover:border-[#FECD02] transition-colors">
            <div className="bg-[#FECD02] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-black">📈 Стабильный прогресс</h3>
            <p className="text-gray-600">Регулярные занятия и достижение поставленных целей</p>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12 text-black">🔄 Как это работает</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">📝 Заполняешь анкету</h3>
              <p className="text-gray-600">Рассказываешь о целях и текущем уровне</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">🤖 Получаешь ссылку на чат-бот</h3>
              <p className="text-gray-600">Персональная ссылка для управления процессом</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">🎯 Мы соединяем тебя с Buddy</h3>
              <p className="text-gray-600">После запуска сервиса находим идеального напарника</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="text-lg font-semibold mb-2">📱 Совместная учеба в @hub_hub_bot</h3>
              <p className="text-gray-600">Дисциплина, обмен знаниями, общие цели и поддержка в чате</p>
              
              {/* Hub Bot Screenshots */}
              <div className="mt-4 grid grid-cols-1 gap-2 max-w-xs">
                <img 
                  src="/lovable-uploads/7499d5c7-f716-4382-9aaf-286fcdde9bd0.png" 
                  alt="Hub bot - обмен голосовыми сообщениями"
                  className="rounded-lg shadow-md w-full h-32 object-cover"
                />
                <img 
                  src="/lovable-uploads/fcb26a98-9055-4ccb-b781-6a87ef72ea03.png" 
                  alt="Hub bot - система отчетности"
                  className="rounded-lg shadow-md w-full h-32 object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">💬 Голосовые отчеты и взаимная поддержка</p>
            </div>
          </div>
        </div>

        {/* Compound Effect Visualization */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-8 text-black">📊 Сила маленьких привычек</h2>
          <Card className="p-8 max-w-4xl mx-auto">
            <img 
              src="/lovable-uploads/c2210bd7-a22f-4c53-8347-317e9b775022.png" 
              alt="График силы маленьких привычек"
              className="rounded-lg mx-auto mb-4 max-w-full h-auto"
            />
            <p className="text-gray-700 text-lg">
              <strong>1% лучше каждый день = 37× результат за год!</strong> 🎯<br/>
              Вместе с напарником проще удерживать этот рост 📈
            </p>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">💬 Что говорят школьники</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-l-4 border-[#FECD02]">
                <p className="text-gray-700 italic">"{testimonial}"</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with counter and creator contact */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Users className="w-6 h-6 text-[#FECD02]" />
              <span className="text-xl text-gray-700">
                Уже подали заявку: <strong className="text-[#FECD02]">{applicationsCount}</strong> школьников 🎓
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
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
    </div>
  );
};

export default NewLandingPage;
