import posthog from 'posthog-js';

interface Analytics {
  init: (config: { posthogKey: string; apiHost: string; debug: boolean }) => void;
  identify: (userId: string, properties?: any) => void;
  track: (eventName: string, properties?: any) => void;
  submitApplication: (data: ApplicationData) => void;
}

interface ApplicationData {
  grade: string;
  goals: string; // Changed from string[] to string
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
        capture_pageview: false, // Disable automatic page view capture,
      });
    } else {
      console.warn('PostHog key is not provided. Analytics will be disabled.');
    }
  },

  identify: (userId, properties) => {
    if (posthog.isFeatureEnabled('analytics')) {
      posthog.identify(userId, properties);
    } else {
      console.log(`[Analytics] Identify: User ID - ${userId}`, properties);
    }
  },

  track: (eventName, properties) => {
    if (posthog.isFeatureEnabled('analytics')) {
      posthog.capture(eventName, properties);
    } else {
      console.log(`[Analytics] Track: ${eventName}`, properties);
    }
  },

  submitApplication: (data) => {
    if (posthog.isFeatureEnabled('analytics')) {
      posthog.capture('submit_application', data);
    } else {
      console.log('[Analytics] Submit Application:', data);
    }
  },
};

export { analytics };
