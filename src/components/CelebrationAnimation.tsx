
import React from 'react';

const CelebrationAnimation: React.FC = () => {
  return (
    <div className="flex justify-center items-center mb-6">
      <div className="relative">
        {/* Main celebration emoji with bounce */}
        <div className="text-6xl animate-bounce">
          🎉
        </div>
        
        {/* Floating emojis around */}
        <div className="absolute -top-2 -left-4 text-2xl animate-pulse animation-delay-200">
          ✨
        </div>
        <div className="absolute -top-2 -right-4 text-2xl animate-pulse animation-delay-500">
          🎊
        </div>
        <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse animation-delay-700">
          🚀
        </div>
        <div className="absolute -bottom-2 -right-2 text-2xl animate-pulse animation-delay-1000">
          🎈
        </div>
        
        {/* Success ring */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-[#FECD02] rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default CelebrationAnimation;
