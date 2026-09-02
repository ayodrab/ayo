/**
 * Google Analytics 4 (GA4) helper module
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-CB92PD9NE2';

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
}

export function trackProjectView(projectId: string, projectTitle: string) {
  trackEvent('view_project', {
    project_id: projectId,
    project_title: projectTitle,
  });
}

export function trackFilterChange(filter: string) {
  trackEvent('select_filter', {
    filter_name: filter,
  });
}

export function trackAboutOpen() {
  trackEvent('open_about_modal');
}

export function trackContactClick(method: string = 'email') {
  trackEvent('contact_click', {
    contact_method: method,
  });
}
