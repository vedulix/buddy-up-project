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

  const steps = [
    {
      id: 'grade',
      title: '🎓 Кто ты?',
      shortTitle: 'Статус',
      type: 'radio',
      options: [
        'Школьник 📚',
        'Выпускник 🎯', 
        'Студент 📖'
      ]
    },
    {
      id: 'goals',
      title: '🎯 Что хочешь достичь?',
      shortTitle: 'Цель',
      type: 'radio',
      options: [
        'Подготовиться к экзаменам 📝',
        'Изучить новые навыки 🚀',
        'Сделать проект 💡'
      ]
    },
    {
      id: 'subjects',
      title: '📖 По какому предмету ищешь напарника?',
      shortTitle: 'Предмет',
      type: 'checkbox',
      options: [
        'Математика 🔢',
        'Информатика 💻',
        'Физика ⚡',
        'Русский язык 📝',
        'Английский язык 🌍',
        'Обществознание 🏛️',
        'Другой предмет ❓'
      ]
    },
    {
      id: 'level',
      title: '📊 Какой у тебя уровень?',
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
    setAnswers(prev => ({
      ...prev,
      [stepId]: value
    }));

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

  // Auto-advance for radio buttons (except subjects which are checkboxes)
  const handleRadioChange = (stepId: string, value: string) => {
    handleAnswerChange(stepId, value);
    
    // Auto-advance after short delay for better UX
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        handleNext();
      }
    }, 500);
  };

  // Validation
  const validateCurrentStep = () => {
    const current = steps[currentStep];
    const errors: Record<string, string> = {};

    switch (current.id) {
      case 'grade':
        if (!answers.grade) errors.grade = 'Выберите ваш статус';
        break;
      case 'goals':
        if (!answers.goals) {
          errors.goals = 'Выберите вашу цель';
        }
        break;
      case 'subjects':
        if (!answers.subjects || answers.subjects.length === 0) errors.subjects = 'Выберите хотя бы один предмет';
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
        return !!answers.grade;
      case 'goals':
        return !!answers.goals;
      case 'subjects':
        return answers.subjects && answers.subjects.length > 0;
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
        goals: answers.goals.replace(/\s*[📝🚀💡🏆]\s*$/, ''),
        subjects: answers.subjects.map(subject => subject.replace(/\s*[🔢💻⚡📝🌍🏛️❓]\s*$/, ''))
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
          <div className="space-y-4">
            <RadioGroup 
              value={answers[step.id as keyof typeof answers] as string} 
              onValueChange={(value) => handleRadioChange(step.id, value)}
              className="space-y-4"
            >
              {step.options?.map((option) => (
                <div key={option} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-100 hover:border-[#FECD02] cursor-pointer">
                  <RadioGroupItem value={option} id={option} className="text-[#FECD02]" />
                  <Label htmlFor={option} className="text-lg cursor-pointer flex-1 font-medium">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {validationErrors[step.id] && <ValidationMessage message={validationErrors[step.id]} />}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">✨ Можешь выбрать несколько предметов</p>
            {step.options?.map((option) => (
              <div key={option} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-100 hover:border-[#FECD02]">
                <Checkbox
                  id={option}
                  checked={(answers[step.id as keyof typeof answers] as string[])?.includes(option) || false}
                  onCheckedChange={() => handleCheckboxToggle(step.id, option)}
                  className="border-[#FECD02] text-[#FECD02]"
                />
                <Label htmlFor={option} className="text-lg cursor-pointer flex-1 font-medium">{option}</Label>
              </div>
            ))}
            {validationErrors[step.id] && <ValidationMessage message={validationErrors[step.id]} />}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <p className="text-lg text-gray-600">✨ Оцени свой текущий уровень:</p>
              <p className="text-sm text-gray-500">От новичка до эксперта</p>
            </div>
            <div className="px-6">
              <Slider
                value={answers.selfAssessment}
                onValueChange={(value) => handleAnswerChange('selfAssessment', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-4">
                <span>1 (новичок)</span>
                <span className="font-bold text-2xl text-[#FECD02]">{answers.selfAssessment[0]}/10</span>
                <span>10 (эксперт)</span>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-center">🤝 Почти готово! Как с тобой связаться?</p>
            <div>
              <Label htmlFor="email" className="text-lg mb-3 block font-medium">📧 Email:</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={answers.email}
                onChange={(e) => handleAnswerChange('email', e.target.value)}
                className="text-lg p-4 border-2 border-gray-200 focus:border-[#FECD02] rounded-xl"
              />
              {validationErrors.email && <ValidationMessage message={validationErrors.email} />}
            </div>
            <div>
              <Label htmlFor="telegram" className="text-lg mb-3 block font-medium">💬 Telegram:</Label>
              <Input
                id="telegram"
                placeholder="@username"
                value={answers.telegram}
                onChange={(e) => handleAnswerChange('telegram', e.target.value)}
                className="text-lg p-4 border-2 border-gray-200 focus:border-[#FECD02] rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-2xl">
        <ProgressIndicator 
          currentStep={currentStep}
          totalSteps={steps.length}
          stepTitles={steps.map(step => step.shortTitle)}
        />

        <Card className="p-8 border-2 border-gray-100 shadow-lg rounded-2xl bg-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black text-center">
            {steps[currentStep].title}
          </h2>

          {renderStep()}

          <div className="flex justify-between mt-10">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="px-8 py-4 border-2 text-lg rounded-xl"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Назад
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#FECD02] hover:bg-[#FECD02]/90 text-black px-8 py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {currentStep === steps.length - 1 ? '🚀 Найти напарника!' : 'Далее'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Progress hint */}
          {canProceed() && currentStep < steps.length - 1 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              💡 Нажми Enter или кнопку "Далее"
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ExtendedQuestionnaire;
