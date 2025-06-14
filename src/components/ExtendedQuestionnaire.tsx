import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

const ExtendedQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    grade: '',
    goals: [] as string[],
    subjects: [] as string[],
    level: '',
    examScore: '',
    selfAssessment: [5],
    email: '',
    telegram: ''
  });

  useState(() => {
    // Track form start
    analytics.track('form_start');
  });

  const steps = [
    {
      id: 'grade',
      title: '🎓 В каком ты классе?',
      type: 'radio',
      options: ['9', '10', '11', 'Выпускник', 'Студент']
    },
    {
      id: 'goals',
      title: '🎯 Какие у тебя цели?',
      type: 'checkbox',
      options: ['ЕГЭ 📚', 'ОГЭ 📝', 'Олимпиады 🏆', 'Проекты 💡']
    },
    {
      id: 'subjects',
      title: '📖 Какие предметы хочешь ботать вместе с напарником?',
      type: 'checkbox',
      options: [
        'Русский язык 📝',
        'Математика профильная 🔢',
        'Информатика 💻',
        'Физика ⚡',
        'Химия 🧪',
        'Биология 🧬',
        'История 📜',
        'Обществознание 🏛️',
        'Другое ❓'
      ]
    },
    {
      id: 'level',
      title: '📊 Какой у тебя текущий уровень?',
      type: 'conditional'
    },
    {
      id: 'contacts',
      title: '📱 Как с тобой связаться?',
      type: 'contacts'
    }
  ];

  const handleAnswerChange = (stepId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: value
    }));
  };

  const handleCheckboxToggle = (stepId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: (prev[stepId as keyof typeof prev] as string[]).includes(option)
        ? (prev[stepId as keyof typeof prev] as string[]).filter(item => item !== option)
        : [...(prev[stepId as keyof typeof prev] as string[]), option]
    }));
  };

  const canProceed = () => {
    const current = steps[currentStep];
    switch (current.id) {
      case 'grade':
        return answers.grade !== '';
      case 'goals':
        return answers.goals.length > 0;
      case 'subjects':
        return answers.subjects.length > 0;
      case 'level':
        return answers.level !== '' || answers.examScore !== '' || answers.selfAssessment[0] >= 1;
      case 'contacts':
        return answers.email !== '' && answers.telegram !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    // Track step completion
    analytics.track('form_step_complete', { 
      step: currentStep + 1,
      stepId: steps[currentStep].id 
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form with real analytics
      console.log('Form submitted:', answers);
      
      // Clean up emoji from answers for storage
      const cleanAnswers = {
        ...answers,
        goals: answers.goals.map(goal => goal.replace(/\s*[📚📝🏆💡]\s*$/, '')),
        subjects: answers.subjects.map(subject => subject.replace(/\s*[📝🔢💻⚡🧪🧬📜🏛️❓]\s*$/, ''))
      };
      
      analytics.submitApplication(cleanAnswers);
      navigate('/thanks');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'radio':
        return (
          <RadioGroup 
            value={answers[step.id as keyof typeof answers] as string} 
            onValueChange={(value) => handleAnswerChange(step.id, value)}
            className="space-y-4"
          >
            {step.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-lg cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-4">
            {step.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                <Checkbox
                  id={option}
                  checked={(answers[step.id as keyof typeof answers] as string[]).includes(option)}
                  onCheckedChange={() => handleCheckboxToggle(step.id, option)}
                />
                <Label htmlFor={option} className="text-lg cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'conditional':
        if (answers.goals.some(goal => goal.includes('ЕГЭ') || goal.includes('ОГЭ'))) {
          return (
            <div className="space-y-6">
              <div>
                <Label htmlFor="examScore" className="text-lg block mb-4">📊 Баллы последнего пробника (если сдавал):</Label>
                <Input
                  id="examScore"
                  type="number"
                  placeholder="Введи количество баллов или оставь пустым"
                  value={answers.examScore}
                  onChange={(e) => handleAnswerChange('examScore', e.target.value)}
                  className="text-lg p-4 mb-6"
                />
              </div>
              
              <div className="border-t pt-6">
                <Label className="text-lg block mb-4">🎯 Если не сдавал пробник, оцени свой уровень по шкале от 1 до 10:</Label>
                <div className="px-4">
                  <Slider
                    value={answers.selfAssessment}
                    onValueChange={(value) => handleAnswerChange('selfAssessment', value)}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>1 (начинаю с нуля)</span>
                    <span className="font-semibold text-lg text-[#FECD02]">{answers.selfAssessment[0]}/10</span>
                    <span>10 (готов на 100%)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (answers.goals.some(goal => goal.includes('Олимпиады'))) {
          return (
            <RadioGroup 
              value={answers.level} 
              onValueChange={(value) => handleAnswerChange('level', value)}
              className="space-y-4"
            >
              {['🏫 Школьный уровень', '🏘️ Муниципальный уровень', '🏛️ Региональный уровень', '🎯 Заключительный тур', '🏆 Призёр/победитель'].map((level) => (
                <div key={level} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <RadioGroupItem value={level} id={level} />
                  <Label htmlFor={level} className="text-lg cursor-pointer flex-1">{level}</Label>
                </div>
              ))}
            </RadioGroup>
          );
        }
        return (
          <div className="space-y-6">
            <p className="text-lg text-gray-600">✨ Отлично! Оцени свой текущий уровень по шкале от 1 до 10:</p>
            <div className="px-4">
              <Slider
                value={answers.selfAssessment}
                onValueChange={(value) => handleAnswerChange('selfAssessment', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>1 (начинаю с нуля)</span>
                <span className="font-semibold text-lg text-[#FECD02]">{answers.selfAssessment[0]}/10</span>
                <span>10 (эксперт в области)</span>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg mb-2 block">📧 Email:</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={answers.email}
                onChange={(e) => handleAnswerChange('email', e.target.value)}
                className="text-lg p-4"
              />
            </div>
            <div>
              <Label htmlFor="telegram" className="text-lg mb-2 block">💬 Telegram username:</Label>
              <Input
                id="telegram"
                placeholder="@username"
                value={answers.telegram}
                onChange={(e) => handleAnswerChange('telegram', e.target.value)}
                className="text-lg p-4"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Шаг {currentStep + 1} из {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% ✨</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#FECD02] h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="p-8 border-2 border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-black">
            {steps[currentStep].title}
          </h2>

          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="px-6 py-3 border-2"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              ⬅️ Назад
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-6 py-3 font-semibold"
            >
              {currentStep === steps.length - 1 ? '🚀 Отправить заявку' : '➡️ Далее'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExtendedQuestionnaire;
