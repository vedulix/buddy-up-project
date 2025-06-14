
import { useState, useEffect } from 'react';

interface FormAnswers {
  grade: string;
  goals: string;
  subjects: string[];
  level: string;
  examScore: string;
  selfAssessment: number[];
  email: string;
  telegram: string;
}

const STORAGE_KEY = 'questionnaire-progress';

export const useFormProgress = () => {
  const [answers, setAnswers] = useState<FormAnswers>({
    grade: '',
    goals: '',
    subjects: [],
    level: '',
    examScore: '',
    selfAssessment: [5],
    email: '',
    telegram: ''
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { answers: savedAnswers, step } = JSON.parse(saved);
        setAnswers(savedAnswers);
        setCurrentStep(step);
      } catch (error) {
        console.log('Failed to load saved progress');
      }
    }
  }, []);

  // Save progress whenever answers or step changes
  useEffect(() => {
    const progressData = {
      answers,
      step: currentStep,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
  }, [answers, currentStep]);

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    answers,
    setAnswers,
    currentStep,
    setCurrentStep,
    clearProgress
  };
};
