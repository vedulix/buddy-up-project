
import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Questionnaire from '@/components/Questionnaire';
import FakeDoor from '@/components/FakeDoor';

const Index = () => {
  const [currentStep, setCurrentStep] = useState('landing');
  const [userAnswers, setUserAnswers] = useState({});

  const handleStartQuestionnaire = () => {
    console.log('User started questionnaire');
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (answers: any) => {
    console.log('Questionnaire completed:', answers);
    setUserAnswers(answers);
    setCurrentStep('fake-door');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage onStartQuestionnaire={handleStartQuestionnaire} />;
      case 'questionnaire':
        return <Questionnaire onComplete={handleQuestionnaireComplete} />;
      case 'fake-door':
        return <FakeDoor userAnswers={userAnswers} />;
      default:
        return <LandingPage onStartQuestionnaire={handleStartQuestionnaire} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
    </div>
  );
};

export default Index;
