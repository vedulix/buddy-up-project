
import React from 'react';

interface ValidationMessageProps {
  message: string;
  type?: 'error' | 'success' | 'info';
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ 
  message, 
  type = 'error' 
}) => {
  const colors = {
    error: 'text-red-500 bg-red-50 border-red-200',
    success: 'text-green-500 bg-green-50 border-green-200',
    info: 'text-blue-500 bg-blue-50 border-blue-200'
  };

  return (
    <div className={`text-sm p-2 rounded border ${colors[type]} mt-2`}>
      {message}
    </div>
  );
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email обязателен';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Введите корректный email';
  return null;
};

export const validateTelegram = (telegram: string): string | null => {
  if (!telegram) return 'Telegram обязателен';
  if (!telegram.startsWith('@')) return 'Telegram должен начинаться с @';
  if (telegram.length < 4) return 'Слишком короткий username';
  return null;
};

export default ValidationMessage;
