import { parseUTMFromURL, UTMData } from './utm';

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  route?: string;
  data?: any;
  utm?: UTMData;
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
  private utm: UTMData = {};

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromLocalStorage();
    this.loadOrExtractUTM();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadOrExtractUTM() {
    // Try to read from localStorage first (persist UTM for session)
    const savedUTM = localStorage.getItem('studybuddy_utm');
    if (savedUTM) {
      this.utm = JSON.parse(savedUTM);
    } else {
      // Parse from current URL
      const utmFromUrl = parseUTMFromURL();
      // Save only if at least one UTM is present
      if (Object.values(utmFromUrl).some(Boolean)) {
        this.utm = utmFromUrl;
        localStorage.setItem('studybuddy_utm', JSON.stringify(utmFromUrl));
      }
    }
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

  updateUTM(newUtm: UTMData) {
    // Allow updating UTM if needed (used from landing)
    this.utm = newUtm;
    localStorage.setItem('studybuddy_utm', JSON.stringify(newUtm));
  }

  track(event: string, data?: any, utmOverride?: UTMData) {
    const eventUTM = utmOverride || this.utm;
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      route: window.location.pathname,
      data,
      utm: eventUTM
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
      .map(app => {
        // Defensive conversion for goals and subjects
        const goalsArr =
          Array.isArray(app.goals)
            ? app.goals
            : typeof app.goals === "string"
              ? [app.goals]
              : [];
        const subjectsArr =
          Array.isArray(app.subjects)
            ? app.subjects
            : typeof app.subjects === "string"
              ? [app.subjects]
              : [];
        return {
          id: app.id,
          grade: app.grade,
          goals: goalsArr.join(", "),
          subjects: subjectsArr.join(", "),
          level: app.level || app.examScore,
          date: new Date(app.timestamp).toLocaleString("ru-RU")
        };
      });
  }

  getUTMStats() {
    // Returns stats grouped by utm_source + utm_campaign
    const events = this.events.filter(event => event.utm && event.event === 'page_view');
    const submits = this.events.filter(event => event.utm && event.event === 'form_submit');
    const statsMap = new Map<string, {
      utm_source: string, utm_campaign: string, utm_medium?: string, utm_term?: string, utm_content?: string,
      clicks: number, submissions: number
    }>();

    for (const event of events) {
      const source = event.utm?.utm_source || 'direct';
      const campaign = event.utm?.utm_campaign || '';
      const key = `${source}::${campaign}`;
      if (!statsMap.has(key)) {
        statsMap.set(key, {
          utm_source: source,
          utm_campaign: campaign,
          utm_medium: event.utm?.utm_medium,
          utm_term: event.utm?.utm_term,
          utm_content: event.utm?.utm_content,
          clicks: 0,
          submissions: 0
        });
      }
      statsMap.get(key)!.clicks += 1;
    }

    for (const submit of submits) {
      const source = submit.utm?.utm_source || 'direct';
      const campaign = submit.utm?.utm_campaign || '';
      const key = `${source}::${campaign}`;
      if (!statsMap.has(key)) {
        // If someone managed to submit not from a click, create entry
        statsMap.set(key, {
          utm_source: source,
          utm_campaign: campaign,
          utm_medium: submit.utm?.utm_medium,
          utm_term: submit.utm?.utm_term,
          utm_content: submit.utm?.utm_content,
          clicks: 0,
          submissions: 0
        });
      }
      statsMap.get(key)!.submissions += 1;
    }

    return Array.from(statsMap.values())
      .map(stat => ({
        ...stat,
        conversion: stat.clicks === 0 ? 0 : Math.round((stat.submissions / stat.clicks) * 1000) / 10 // %
      }))
      .sort((a, b) => b.clicks - a.clicks);
  }
}

export const analytics = new AnalyticsService();
