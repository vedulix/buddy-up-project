
import { parseUTMFromURL, UTMData } from './utm';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  session_id: string;
  route?: string;
  data?: any;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface ApplicationData {
  session_id: string;
  grade: string;
  goals: string[];
  subjects: string[];
  level: string;
  exam_score?: string;
  email: string;
  telegram: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

class AnalyticsService {
  private sessionId: string;
  private utm: UTMData = {};

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadOrExtractUTM();
    console.log('🔧 Analytics service initialized with session:', this.sessionId);
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

  private getUserAgent(): string {
    return navigator.userAgent || '';
  }

  updateUTM(newUtm: UTMData) {
    // Allow updating UTM if needed (used from landing)
    this.utm = newUtm;
    localStorage.setItem('studybuddy_utm', JSON.stringify(newUtm));
  }

  async track(event: string, data?: any, utmOverride?: UTMData) {
    const eventUTM = utmOverride || this.utm;
    const analyticsEvent: AnalyticsEvent = {
      event_type: event,
      session_id: this.sessionId,
      route: window.location.pathname,
      data: data ? JSON.stringify(data) : null,
      utm_source: eventUTM.utm_source,
      utm_medium: eventUTM.utm_medium,
      utm_campaign: eventUTM.utm_campaign,
      utm_term: eventUTM.utm_term,
      utm_content: eventUTM.utm_content
    };

    console.log('📊 Tracking event:', event, analyticsEvent);

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(analyticsEvent);
      
      if (error) {
        console.error('❌ Error tracking event:', error);
      } else {
        console.log('✅ Analytics event tracked successfully:', event);
      }
    } catch (error) {
      console.error('❌ Error tracking event:', error);
    }
  }

  async submitApplication(applicationData: Omit<ApplicationData, 'session_id'>) {
    const application: ApplicationData = {
      ...applicationData,
      session_id: this.sessionId,
      utm_source: this.utm.utm_source,
      utm_medium: this.utm.utm_medium,
      utm_campaign: this.utm.utm_campaign,
      utm_term: this.utm.utm_term,
      utm_content: this.utm.utm_content
    };

    console.log('📝 Submitting application:', application);

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert(application)
        .select()
        .single();

      if (error) {
        console.error('❌ Error submitting application:', error);
        return null;
      }

      console.log('✅ Application submitted successfully:', data);
      this.track('form_submit', { applicationId: data.id });
      return data;
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      return null;
    }
  }

  async getStats() {
    console.log('📈 Getting stats from Supabase...');
    try {
      // Get total visits (page_view events)
      const { count: totalVisits } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view');

      console.log('👀 Total visits:', totalVisits);

      // Get unique visitors (unique session_ids)
      const { data: uniqueSessionsData } = await supabase
        .from('analytics_events')
        .select('session_id')
        .eq('event_type', 'page_view');

      const uniqueVisitors = new Set(uniqueSessionsData?.map(e => e.session_id) || []).size;
      console.log('👥 Unique visitors:', uniqueVisitors);

      // Get CTA clicks
      const { count: ctaClicks } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'cta_click');

      console.log('🖱️ CTA clicks:', ctaClicks);

      // Get form starts
      const { count: formStarts } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'form_start');

      console.log('📋 Form starts:', formStarts);

      // Get form submits
      const { count: formSubmits } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'form_submit');

      console.log('✅ Form submits:', formSubmits);

      // Get applications count
      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      console.log('📝 Applications count:', applicationsCount);

      const conversionRate = uniqueVisitors > 0 ? (applicationsCount || 0) / uniqueVisitors * 100 : 0;

      const stats = {
        totalVisits: totalVisits || 0,
        uniqueVisitors,
        ctaClicks: ctaClicks || 0,
        formStarts: formStarts || 0,
        filledForms: applicationsCount || 0,
        conversionRate: Math.round(conversionRate * 10) / 10
      };

      console.log('📊 Final stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return {
        totalVisits: 0,
        uniqueVisitors: 0,
        ctaClicks: 0,
        formStarts: 0,
        filledForms: 0,
        conversionRate: 0
      };
    }
  }

  async getFunnelData() {
    const stats = await this.getStats();
    const steps = [
      { step: 'Landing View', count: stats.uniqueVisitors, dropRate: 0 },
      { step: 'CTA Click', count: stats.ctaClicks, dropRate: stats.uniqueVisitors > 0 ? Math.round((1 - stats.ctaClicks / stats.uniqueVisitors) * 100) : 0 },
      { step: 'Form Start', count: stats.formStarts, dropRate: stats.ctaClicks > 0 ? Math.round((1 - stats.formStarts / stats.ctaClicks) * 100) : 0 },
      { step: 'Form Submit', count: stats.filledForms, dropRate: stats.formStarts > 0 ? Math.round((1 - stats.filledForms / stats.formStarts) * 100) : 0 }
    ];

    return steps;
  }

  async getRecentApplications(limit: number = 10) {
    console.log('📋 Getting recent applications from Supabase...');
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error getting recent applications:', error);
        return [];
      }

      console.log('📝 Raw applications data:', data);

      const formattedApps = data?.map(app => ({
        id: app.id,
        grade: app.grade,
        goals: Array.isArray(app.goals) ? app.goals.join(', ') : app.goals,
        subjects: Array.isArray(app.subjects) ? app.subjects.join(', ') : app.subjects,
        level: app.level || app.exam_score,
        date: new Date(app.timestamp).toLocaleString("ru-RU")
      })) || [];

      console.log('📊 Formatted applications:', formattedApps);
      return formattedApps;
    } catch (error) {
      console.error('❌ Error getting recent applications:', error);
      return [];
    }
  }

  async getUTMStats() {
    try {
      // Get page views with UTM data
      const { data: pageViews } = await supabase
        .from('analytics_events')
        .select('utm_source, utm_campaign, utm_medium, utm_term, utm_content')
        .eq('event_type', 'page_view')
        .not('utm_source', 'is', null);

      // Get applications with UTM data
      const { data: applications } = await supabase
        .from('applications')
        .select('utm_source, utm_campaign, utm_medium, utm_term, utm_content')
        .not('utm_source', 'is', null);

      const statsMap = new Map<string, {
        utm_source: string;
        utm_campaign: string;
        utm_medium?: string;
        utm_term?: string;
        utm_content?: string;
        clicks: number;
        submissions: number;
      }>();

      // Process page views
      pageViews?.forEach(event => {
        const source = event.utm_source || 'direct';
        const campaign = event.utm_campaign || '';
        const key = `${source}::${campaign}`;
        
        if (!statsMap.has(key)) {
          statsMap.set(key, {
            utm_source: source,
            utm_campaign: campaign,
            utm_medium: event.utm_medium,
            utm_term: event.utm_term,
            utm_content: event.utm_content,
            clicks: 0,
            submissions: 0
          });
        }
        statsMap.get(key)!.clicks += 1;
      });

      // Process applications
      applications?.forEach(app => {
        const source = app.utm_source || 'direct';
        const campaign = app.utm_campaign || '';
        const key = `${source}::${campaign}`;
        
        if (!statsMap.has(key)) {
          statsMap.set(key, {
            utm_source: source,
            utm_campaign: campaign,
            utm_medium: app.utm_medium,
            utm_term: app.utm_term,
            utm_content: app.utm_content,
            clicks: 0,
            submissions: 0
          });
        }
        statsMap.get(key)!.submissions += 1;
      });

      return Array.from(statsMap.values())
        .map(stat => ({
          ...stat,
          conversion: stat.clicks === 0 ? 0 : Math.round((stat.submissions / stat.clicks) * 1000) / 10
        }))
        .sort((a, b) => b.clicks - a.clicks);
    } catch (error) {
      console.error('Error getting UTM stats:', error);
      return [];
    }
  }
}

export const analytics = new AnalyticsService();
