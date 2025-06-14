
import { useState, useEffect } from 'react';
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
import { useFormProgress } from '@/hooks/useFormProgress';
import ProgressIndicator from '@/components/ProgressIndicator';
import ValidationMessage, { validateEmail, validateTelegram } from '@/components/FormValidation';

const ExtendedQuestionnaire = () => {
  const navigate = useNavigate();
  const { answers, setAnswers, currentStep, setCurrentStep, clearProgress } = useFormProgress();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Track form start only once
    if (currentStep === 0 && !answers.grade) {
      analytics.track('form_start');
    }
  }, []);

  // Dynamic goals based on selected grade
  const getGoalsForGrade = (grade: string) => {
    if (grade === '9' || grade === '10' || grade === '11') {
      return ['ЕГЭ 📚', 'ОГЭ 📝', 'Олимпиады 🏆', 'Проекты 💡', 'Изучение новых навыков 🚀'];
    } else if (grade.includes('Выпускник')) {
      return ['ЕГЭ 📚', 'Олимпиады 🏆', 'Проекты 💡', 'Изучение новых навыков 🚀'];
    } else if (grade.includes('Студент') || grade.includes('Будущий студент')) {
      return ['Проекты 💡', 'Курсовые работы 📄', 'Диплом/ВКР 🎓', 'Стажировки 💼', 'Изучение новых навыков 🚀', 'Совместные проекты 🤝'];
    }
    return ['ЕГЭ 📚', 'ОГЭ 📝', 'Олимпиады 🏆', 'Проекты 💡', 'Курсовые работы 📄', 'Диплом/ВКР 🎓', 'Стажировки 💼', 'Изучение новых навыков 🚀', 'Совместные проекты 🤝'];
  };

  // Dynamic subjects based on selected grade
  const getSubjectsForGrade = (grade: string) => {
    if (grade === '9' || grade === '10' || grade === '11' || grade.includes('Выпускник')) {
      return [
        'Русский язык 📝', 'Математика профильная 🔢', 'Информатика 💻', 'Физика ⚡',
        'Химия 🧪', 'Биология 🧬', 'История 📜', 'Обществознание 🏛️', 'Английский язык 🌍', 'Другое ❓'
      ];
    } else if (grade.includes('Студент') || grade.includes('Будущий студент')) {
      return [
        'Программирование 👨‍💻', 'Дизайн 🎨', 'Экономика 💰', 'Английский язык 🌍', 'Маркетинг 📈',
        'Проектная деятельность 🔧', 'Математика профильная 🔢', 'Информатика 💻', 'Физика ⚡',
        'Химия 🧪', 'Биология 🧬', 'История 📜', 'Обществознание 🏛️', 'Другое ❓'
      ];
    }
    return [
      'Русский язык 📝', 'Математика профильная 🔢', 'Информатика 💻', 'Физика ⚡', 'Химия 🧪',
      'Биология 🧬', 'История 📜', 'Обществознание 🏛️', 'Программирование 👨‍💻', 'Дизайн 🎨',
      'Экономика 💰', 'Английский язык 🌍', 'Маркетинг 📈', 'Проектная деятельность 🔧', 'Другое ❓'
    ];
  };

  const steps = [
    {
      id: 'grade',
      title: '🎓 В каком ты классе или на каком этапе обучения?',
      shortTitle: 'Класс',
      type: 'radio',
      options: ['9', '10', '11', 'Выпускник (поступаю) 🎯', 'Будущий студент (поступил) 🎉', 'Студент 1-2 курс 📚', 'Студент 3-4 курс 🎓', 'Студент магистратуры 🎯']
    },
    {
      id: 'goals',
      title: '🎯 Какие у тебя цели?',
      shortTitle: 'Цели',
      type: 'checkbox',
      options: getGoalsForGrade(answers.grade)
    },
    {
      id: 'subjects',
      title: '📖 Какие предметы/направления хочешь ботать вместе с напарником?',
      shortTitle: 'Предметы',
      type: 'checkbox',
      options: getSubjectsForGrade(answers.grade)
    },
    {
      id: 'level',
      title: '📊 Какой у тебя текущий уровень?',
      shortTitle: 'Уровень',
      type: 'slider'
    },
    {
      id: 'contacts',
      title: '📱 Как с тобой связаться?',
      shortTitle: 'Контакты',
      type: 'contacts'
    }
  ];

  const handleAnswerChange = (stepId: string, value: any) => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [stepId]: value
      };
      
      if (stepId === 'grade') {
        newAnswers.goals = [];
        newAnswers.subjects = [];
      }
      
      return newAnswers;
    });

    // Clear validation errors when user starts typing
    if (validationErrors[stepId]) {
      setValidationErrors(prev => ({
        ...prev,
        [stepId]: ''
      }));
    }
  };

  const handleCheckboxToggle = (stepId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: (prev[stepId as keyof typeof prev] as string[]).includes(option)
        ? (prev[stepId as keyof typeof prev] as string[]).filter(item => item !== option)
        : [...(prev[stepId as keyof typeof prev] as string[]), option]
    }));
  };

  // Auto-advance for radio buttons
  const handleRadioChange = (stepId: string, value: string) => {
    handleAnswerChange(stepId, value);
    
    // Auto-advance after short delay for better UX
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        handleNext();
      }
    }, 300);
  };

  // Validation
  const validateCurrentStep = () => {
    const current = steps[currentStep];
    const errors: Record<string, string> = {};

    switch (current.id) {
      case 'grade':
        if (!answers.grade) errors.grade = 'Выберите ваш класс или этап обучения';
        break;
      case 'goals':
        if (answers.goals.length === 0) errors.goals = 'Выберите хотя бы одну цель';
        break;
      case 'subjects':
        if (answers.subjects.length === 0) errors.subjects = 'Выберите хотя бы один предмет';
        break;
      case 'level':
        // Level is always valid with slider
        break;
      case 'contacts':
        const emailError = validateEmail(answers.email);
        const telegramError = validateTelegram(answers.telegram);
        if (emailError) errors.email = emailError;
        if (telegramError) errors.telegram = telegramError;
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
        return true; // Always valid with slider
      case 'contacts':
        return answers.email !== '' && answers.telegram !== '' && 
               !validateEmail(answers.email) && !validateTelegram(answers.telegram);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    analytics.track('form_step_complete', { 
      step: currentStep + 1,
      stepId: steps[currentStep].id 
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form submitted:', answers);
      
      const cleanAnswers = {
        ...answers,
        goals: answers.goals.map(goal => goal.replace(/\s*[📚📝🏆💡📄🎓💼🚀🤝]\s*$/, '')),
        subjects: answers.subjects.map(subject => subject.replace(/\s*[📝🔢💻⚡🧪🧬📜🏛️👨‍💻🎨💰🌍📈🔧❓]\s*$/, ''))
      };
      
      analytics.submitApplication(cleanAnswers);
      clearProgress();
      navigate('/thanks');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed()) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, canProceed]);

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            <RadioGroup 
              value={answers[step.id as keyof typeof answers] as string} 
              onValueChange={(value) => handleRadioChange(step.id, value)}
              className="space-y-3"
            >
              {step.options?.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-[#FECD02] cursor-pointer">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="text-base cursor-pointer flex-1">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {validationErrors.grade && <ValidationMessage message={validationErrors.grade} />}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {step.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-[#FECD02]">
                <Checkbox
                  id={option}
                  checked={(answers[step.id as keyof typeof answers] as string[]).includes(option)}
                  onCheckedChange={() => handleCheckboxToggle(step.id, option)}
                />
                <Label htmlFor={option} className="text-base cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
            {validationErrors[step.id] && <ValidationMessage message={validationErrors[step.id]} />}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-6">
            <p className="text-base text-gray-600">✨ Оцени свой текущий уровень по шкале от 1 до 10:</p>
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-base mb-2 block">📧 Email:</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={answers.email}
                onChange={(e) => handleAnswerChange('email', e.target.value)}
                className="text-base p-3"
              />
              {validationErrors.email && <ValidationMessage message={validationErrors.email} />}
            </div>
            <div>
              <Label htmlFor="telegram" className="text-base mb-2 block">💬 Telegram username:</Label>
              <Input
                id="telegram"
                placeholder="@username"
                value={answers.telegram}
                onChange={(e) => handleAnswerChange('telegram', e.target.value)}
                className="text-base p-3"
              />
              {validationErrors.telegram && <ValidationMessage message={validationErrors.telegram} />}
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
        <ProgressIndicator 
          currentStep={currentStep}
          totalSteps={steps.length}
          stepTitles={steps.map(step => step.shortTitle)}
        />

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

          {/* Keyboard hint */}
          {canProceed() && (
            <p className="text-center text-sm text-gray-500 mt-4">
              💡 Нажмите Enter для перехода к следующему шагу
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ExtendedQuestionnaire;
