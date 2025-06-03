
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Target, Clock, Trophy } from 'lucide-react';

interface LandingPageProps {
  onStartQuestionnaire: () => void;
}

const LandingPage = ({ onStartQuestionnaire }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-pulse">
            Учись не в одиночку
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Найди идеального напарника для подготовки к ЕГЭ, ОГЭ или олимпиаде. 
            Вместе мотивация сильнее, а результаты лучше!
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Buddy с той же целью</h3>
            <p className="text-gray-600">ЕГЭ 90+ / олимпиада регион / поступление в топ-вуз</p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Жёсткие дедлайны</h3>
            <p className="text-gray-600">Автоматические напоминания и контроль через hub_hub_bot</p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Взаимная мотивация</h3>
            <p className="text-gray-600">Отчёты о прогрессе и поддержка в трудные моменты</p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
            <Target className="w-16 h-16 mx-auto mb-6 text-purple-600" />
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Готов найти своего Study Buddy?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Ответь на несколько вопросов, и мы подберём тебе идеального напарника для учёбы
            </p>
            <Button 
              onClick={onStartQuestionnaire}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Подобрать партнёра
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
