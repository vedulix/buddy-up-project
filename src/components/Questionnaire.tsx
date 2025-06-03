
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (answers: any) => void;
}

const Questionnaire = ({ onComplete }: QuestionnaireProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    grade: '',
    goal: '',
    subjects: [] as string[],
    level: '',
    egeScore: [70],
    olympiadLevel: ''
  });

  const questions = [
    {
      id: 'grade',
      title: 'В каком ты классе?',
      type: 'radio',
      options: ['9', '10', '11']
    },
    {
      id: 'goal',
      title: 'Какая у тебя цель?',
      type: 'radio',
      options: ['ЕГЭ', 'ОГЭ', 'Олимпиада', 'Проект']
    },
    {
      id: 'subjects',
      title: 'По каким предметам нужна помощь?',
      type: 'checkbox',
      options: ['Русский язык', 'Профильная математика', 'Информатика', 'Физика', 'Химия', 'Биология', 'История', 'Обществознание', 'Другое']
    },
    {
      id: 'level',
      title: 'Какой у тебя текущий уровень?',
      type: 'conditional'
    }
  ];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setAnswers(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const canProceed = () => {
    const current = questions[currentQuestion];
    switch (current.id) {
      case 'grade':
        return answers.grade !== '';
      case 'goal':
        return answers.goal !== '';
      case 'subjects':
        return answers.subjects.length > 0;
      case 'level':
        if (answers.goal === 'ЕГЭ') {
          return answers.egeScore[0] >= 40;
        } else if (answers.goal === 'Олимпиада') {
          return answers.olympiadLevel !== '';
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete questionnaire
      console.log('Final answers:', answers);
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup 
            value={answers[question.id as keyof typeof answers] as string} 
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-4"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-lg cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={option}
                  checked={answers.subjects.includes(option)}
                  onCheckedChange={() => handleSubjectToggle(option)}
                />
                <Label htmlFor={option} className="text-lg cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'conditional':
        if (answers.goal === 'ЕГЭ') {
          return (
            <div className="space-y-6">
              <p className="text-lg text-gray-600">Сколько баллов в последнем пробнике?</p>
              <div className="px-4">
                <Slider
                  value={answers.egeScore}
                  onValueChange={(value) => handleAnswerChange('egeScore', value)}
                  max={100}
                  min={40}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>40</span>
                  <span className="font-semibold text-lg text-purple-600">{answers.egeScore[0]} баллов</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          );
        } else if (answers.goal === 'Олимпиада') {
          return (
            <RadioGroup 
              value={answers.olympiadLevel} 
              onValueChange={(value) => handleAnswerChange('olympiadLevel', value)}
              className="space-y-4"
            >
              {['Школьный уровень', 'Районный уровень', 'Региональный уровень', 'Заключительный этап', 'Призёр/победитель'].map((level) => (
                <div key={level} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={level} id={level} />
                  <Label htmlFor={level} className="text-lg cursor-pointer flex-1">{level}</Label>
                </div>
              ))}
            </RadioGroup>
          );
        }
        return <p className="text-lg text-gray-600">Отлично! Мы учтём твою цель при подборе напарника.</p>;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
            {questions[currentQuestion].title}
          </h2>

          {renderQuestion()}

          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              variant="outline"
              className="px-6 py-3"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
            >
              {currentQuestion === questions.length - 1 ? 'Готово!' : 'Далее'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Questionnaire;
