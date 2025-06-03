
interface AnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  route?: string;
  data?: any;
}

interface ApplicationData {
  id: string;
  grade: string;
  goals: string[];
  subjects: string[];
  level: string;
  examScore: string;
  email: string;
  telegram: string;
  timestamp: number;
  sessionId: string;
}

class AnalyticsService {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private applications: ApplicationData[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromLocalStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromLocalStorage() {
    try {
      const storedEvents = localStorage.getItem('studybuddy_events');
      const storedApplications = localStorage.getItem('studybuddy_applications');
      
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      }
      
      if (storedApplications) {
        this.applications = JSON.parse(storedApplications);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('studybuddy_events', JSON.stringify(this.events));
      localStorage.setItem('studybuddy_applications', JSON.stringify(this.applications));
    } catch (error) {
      console.error('Error saving analytics data:', error);
    }
  }

  track(event: string, data?: any) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      route: window.location.pathname,
      data
    };

    this.events.push(analyticsEvent);
    this.saveToLocalStorage();
    
    console.log('Analytics event:', analyticsEvent);
  }

  submitApplication(applicationData: Omit<ApplicationData, 'id' | 'timestamp' | 'sessionId'>) {
    const application: ApplicationData = {
      ...applicationData,
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.applications.push(application);
    this.saveToLocalStorage();
    this.track('form_submit', { applicationId: application.id });
    
    return application;
  }

  getStats() {
    const uniqueSessions = new Set(this.events.map(e => e.sessionId)).size;
    const totalVisits = this.events.filter(e => e.event === 'page_view').length;
    const ctaClicks = this.events.filter(e => e.event === 'cta_click').length;
    const formStarts = this.events.filter(e => e.event === 'form_start').length;
    const formSubmits = this.events.filter(e => e.event === 'form_submit').length;
    
    const conversionRate = uniqueSessions > 0 ? (formSubmits / uniqueSessions * 100) : 0;

    return {
      totalVisits,
      uniqueVisitors: uniqueSessions,
      ctaClicks,
      formStarts,
      filledForms: formSubmits,
      conversionRate: Math.round(conversionRate * 10) / 10,
      applications: this.applications
    };
  }

  getFunnelData() {
    const stats = this.getStats();
    const steps = [
      { step: 'Landing View', count: stats.uniqueVisitors, dropRate: 0 },
      { step: 'CTA Click', count: stats.ctaClicks, dropRate: stats.uniqueVisitors > 0 ? Math.round((1 - stats.ctaClicks / stats.uniqueVisitors) * 100) : 0 },
      { step: 'Form Start', count: stats.formStarts, dropRate: stats.ctaClicks > 0 ? Math.round((1 - stats.formStarts / stats.ctaClicks) * 100) : 0 },
      { step: 'Form Submit', count: stats.filledForms, dropRate: stats.formStarts > 0 ? Math.round((1 - stats.filledForms / stats.formStarts) * 100) : 0 }
    ];

    return steps;
  }

  getRecentApplications(limit: number = 10) {
    return this.applications
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(app => ({
        id: app.id,
        grade: app.grade,
        goals: app.goals.join(', '),
        subjects: app.subjects.join(', '),
        level: app.level || app.examScore,
        date: new Date(app.timestamp).toLocaleString('ru-RU')
      }));
  }
}

export const analytics = new AnalyticsService();
