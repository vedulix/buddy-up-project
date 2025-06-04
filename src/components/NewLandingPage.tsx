
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Users, TrendingUp, Timer, HandHeart, BarChart3, BookOpen, Target, Star, Zap, Calendar } from 'lucide-react';
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
      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button 
          onClick={handleCTAClick}
          className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-6 py-3 text-lg font-bold rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          🤝 Найти Buddy
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Учись не один: Study Buddy для ЕГЭ и олимпиад 🚀
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Мы подберём тебе напарника, который тянет тебя вверх ⬆️
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleCTAClick}
              className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Подобрать напарника 🤝
            </Button>
            <Button 
              onClick={handleCTAClick}
              variant="outline"
              className="border-2 border-[#FECD02] text-[#FECD02] hover:bg-[#FECD02] hover:text-black px-12 py-4 text-xl font-semibold rounded-lg transition-all duration-300"
            >
              Начать бесплатно 🎯
            </Button>
          </div>
        </div>

        {/* Enhanced Offer with Job-specific Goals */}
        <div className="mb-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-[#FECD02]/20">
          <div className="text-center mb-8">
            <Star className="w-12 h-12 mx-auto mb-4 text-[#FECD02]" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Полный комплекс для успеха</h2>
            <p className="text-lg text-gray-700">Не просто напарник — целая система достижения целей</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-[#FECD02] hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-[#FECD02] mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Идеальный напарник</h3>
              </div>
              <p className="text-gray-700">Подбираем по уровню, целям и характеру</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-[#FECD02] hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <Target className="w-6 h-6 text-[#FECD02] mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Постановка целей</h3>
              </div>
              <p className="text-gray-700">Помогаем определить реальные цели и план их достижения</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-[#FECD02] hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <Calendar className="w-6 h-6 text-[#FECD02] mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Дисциплина и контроль</h3>
              </div>
              <p className="text-gray-700">Ежедневная отчетность и поддержка через @hub_hub_bot</p>
            </Card>
          </div>

          {/* Job-specific Goals */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Реальные результаты наших участников:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/60 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#FECD02]">ЕГЭ 90+</div>
                <div className="text-sm text-gray-700">Успешная сдача экзаменов</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#FECD02]">Призер олимпиад</div>
                <div className="text-sm text-gray-700">Региональный и всероссийский уровень</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#FECD02]">Гранты</div>
                <div className="text-sm text-gray-700">Выигрыш проектных конкурсов</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#FECD02]">Топ-ВУЗы</div>
                <div className="text-sm text-gray-700">Поступление на бюджет</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pain + Gain */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center border-2 border-gray-200 hover:border-[#FECD02] transition-all duration-300 hover:shadow-lg">
            <div className="bg-[#FECD02] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Меньше прокрастинации</h3>
            <p className="text-gray-700">Внешний контроль и ответственность перед напарником</p>
          </Card>

          <Card className="p-8 text-center border-2 border-gray-200 hover:border-[#FECD02] transition-all duration-300 hover:shadow-lg">
            <div className="bg-[#FECD02] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HandHeart className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Поддержка</h3>
            <p className="text-gray-700">Взаимная мотивация в трудные моменты подготовки</p>
          </Card>

          <Card className="p-8 text-center border-2 border-gray-200 hover:border-[#FECD02] transition-all duration-300 hover:shadow-lg">
            <div className="bg-[#FECD02] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Стабильный прогресс</h3>
            <p className="text-gray-700">Регулярные занятия и достижение поставленных целей</p>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">🔄 Как это работает</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">📝 Заполняешь анкету</h3>
              <p className="text-gray-700">Рассказываешь о целях и текущем уровне</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">🤖 Получаешь ссылку на чат-бот</h3>
              <p className="text-gray-700">Персональная ссылка для управления процессом</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">🎯 Мы соединяем тебя с Buddy</h3>
              <p className="text-gray-700">После запуска сервиса находим идеального напарника</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#FECD02] text-black rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">📱 Совместная учеба в @hub_hub_bot</h3>
              <p className="text-gray-700">Дисциплина, обмен знаниями, общие цели и поддержка в чате</p>
              
              {/* Hub Bot Screenshots */}
              <div className="mt-4 grid grid-cols-1 gap-2 max-w-xs">
                <img 
                  src="/lovable-uploads/7499d5c7-f716-4382-9aaf-286fcdde9bd0.png" 
                  alt="Hub bot - обмен голосовыми сообщениями"
                  className="rounded-lg shadow-md w-full h-24 object-cover"
                />
                <img 
                  src="/lovable-uploads/fcb26a98-9055-4ccb-b781-6a87ef72ea03.png" 
                  alt="Hub bot - система отчетности"
                  className="rounded-lg shadow-md w-full h-24 object-cover"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">💬 Голосовые отчеты и взаимная поддержка</p>
            </div>
          </div>
        </div>

        {/* Compound Effect Visualization */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">📊 Экспоненциальный рост</h2>
          <Card className="p-8 max-w-4xl mx-auto">
            <img 
              src="/lovable-uploads/c2210bd7-a22f-4c53-8347-317e9b775022.png" 
              alt="График экспоненциального роста"
              className="rounded-lg mx-auto mb-4 max-w-full h-64 object-contain"
            />
            <p className="text-gray-800 text-lg font-medium">
              <strong>1% лучше каждый день = 37× результат за год!</strong> 🎯<br/>
              Вместе с напарником проще удерживать этот рост 📈
            </p>
          </Card>
        </div>

        {/* Scientific Foundation - Simplified and Moved Lower */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="text-center mb-4">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">🧠 Почему это работает</h2>
          </div>
          <Card className="p-4 bg-white/90 backdrop-blur-sm border-l-4 border-[#FECD02]">
            <p className="text-gray-800 text-base leading-relaxed">
              <strong>Джеймс Клир</strong> в книге <em>«Atomic Habits»</em> доказал: когда ты даёшь обещание другому человеку — 
              вероятность выполнить задачу <strong>увеличивается в разы</strong>. 📈 
              Это работает, потому что мы не хотим подводить тех, кто на нас рассчитывает.
            </p>
            <div className="mt-3 text-xs">
              <a 
                href="https://summit-of-self.com/atomic-habits-17-strengthening-commitments-with-habit-contracts-accountability-partners/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Подробнее о научных исследованиях →
              </a>
            </div>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">💬 Что говорят школьники</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-l-4 border-[#FECD02] bg-gray-50/50 hover:shadow-lg transition-shadow">
                <p className="text-gray-800 italic text-lg">"{testimonial}"</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mb-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleCTAClick}
              className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Начать учиться вместе
            </Button>
            <Button 
              onClick={handleCTAClick}
              variant="outline"
              className="border-2 border-[#FECD02] text-[#FECD02] hover:bg-[#FECD02] hover:text-black px-12 py-4 text-xl font-semibold rounded-lg transition-all duration-300"
            >
              📝 Подать заявку сейчас
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with counter and creator contact */}
      <div className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Users className="w-6 h-6 text-[#FECD02]" />
              <span className="text-xl text-gray-800">
                Уже подали заявку: <strong className="text-[#FECD02] text-2xl">{applicationsCount}</strong> школьников 🎓
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
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
