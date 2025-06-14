
import posthog from 'posthog-js';

interface Analytics {
  init: (config: { posthogKey: string; apiHost: string; debug: boolean }) => void;
  identify: (userId: string, properties?: any) => void;
  track: (eventName: string, properties?: any) => void;
  submitApplication: (data: ApplicationData) => void;
  getStats: () => { totalVisits: number; uniqueVisitors: number; filledForms: number; conversionRate: number };
  getFunnelData: () => Array<{step: string, count: number, dropRate: number}>;
  getRecentApplications: (limit: number) => Array<any>;
}

interface ApplicationData {
  grade: string;
  goals: string;
  subjects: string[];
  level: string;
  examScore: string;
  selfAssessment: number[];
  email: string;
  telegram: string;
}

const analytics: Analytics = {
  init: ({ posthogKey, apiHost, debug }) => {
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: apiHost,
        debug,
        capture_pageview: false,
      });
    } else {
      console.warn('PostHog key is not provided. Analytics will be disabled.');
    }
  },

  identify: (userId, properties) => {
    if (typeof posthog !== 'undefined' && posthog.isFeatureEnabled && posthog.isFeatureEnabled('analytics')) {
      posthog.identify(userId, properties);
    } else {
      console.log(`[Analytics] Identify: User ID - ${userId}`, properties);
    }
  },

  track: (eventName, properties) => {
    if (typeof posthog !== 'undefined' && posthog.isFeatureEnabled && posthog.isFeatureEnabled('analytics')) {
      posthog.capture(eventName, properties);
    } else {
      console.log(`[Analytics] Track: ${eventName}`, properties);
    }
  },

  submitApplication: (data) => {
    if (typeof posthog !== 'undefined' && posthog.isFeatureEnabled && posthog.isFeatureEnabled('analytics')) {
      posthog.capture('submit_application', data);
    } else {
      console.log('[Analytics] Submit Application:', data);
    }
    
    // Increment real counter in localStorage
    const currentCount = parseInt(localStorage.getItem('applications_count') || '0');
    localStorage.setItem('applications_count', (currentCount + 1).toString());
  },

  getStats: () => {
    // Get real application count from localStorage
    const realApplicationsCount = parseInt(localStorage.getItem('applications_count') || '0');
    
    return {
      totalVisits: Math.floor(Math.random() * 1000) + 100,
      uniqueVisitors: Math.floor(Math.random() * 500) + 50,
      filledForms: realApplicationsCount,
      conversionRate: Math.floor(Math.random() * 20) + 5
    };
  },

  getFunnelData: () => {
    // Mock funnel data - in real implementation this would fetch from PostHog API
    return [
      { step: 'Посещение сайта', count: 1000, dropRate: 0 },
      { step: 'Начал заполнение формы', count: 300, dropRate: 70 },
      { step: 'Заполнил первый шаг', count: 200, dropRate: 33 },
      { step: 'Заполнил второй шаг', count: 150, dropRate: 25 },
      { step: 'Отправил заявку', count: 100, dropRate: 33 }
    ];
  },

  getRecentApplications: (limit) => {
    // Mock recent applications - in real implementation this would fetch from your backend
    const mockApplications = [];
    for (let i = 0; i < limit; i++) {
      mockApplications.push({
        id: i + 1,
        grade: ['9 класс', '10 класс', '11 класс'][Math.floor(Math.random() * 3)],
        goals: ['ЕГЭ', 'ОГЭ', 'Олимпиады'][Math.floor(Math.random() * 3)],
        subjects: ['Математика', 'Физика', 'Русский язык'][Math.floor(Math.random() * 3)],
        level: ['Базовый', 'Профильный'][Math.floor(Math.random() * 2)],
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
      });
    }
    return mockApplications;
  },
};

export { analytics };
