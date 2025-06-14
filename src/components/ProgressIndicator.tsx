
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Шаг {currentStep + 1} из {totalSteps}</span>
        <span>{Math.round(progress)}% ✨</span>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mb-2 text-xs">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={`text-center px-1 ${
              index === currentStep 
                ? 'text-[#FECD02] font-semibold' 
                : index < currentStep 
                  ? 'text-green-600' 
                  : 'text-gray-400'
            }`}
          >
            {title}
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[#FECD02] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
