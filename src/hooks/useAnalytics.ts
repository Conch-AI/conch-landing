import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    mixpanel?: any;
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: any;
    twq?: (...args: any[]) => void;
    rdt?: (...args: any[]) => void;
    uetq?: any[];
    trackFirebaseEvent?: (eventName: string, eventData?: any) => void;
    mixpanelHelpers?: {
      track: (eventName: string, eventProperties?: any) => void;
      trackDelayed: (eventName: string, eventProperties?: any, delay?: number) => Promise<void>;
      trackPageView: (pageName?: string) => Promise<void>;
    };
  }
}

export const useAnalytics = () => {
  // Track page views across all platforms
  const trackPageView = useCallback((pageName?: string) => {
    const pageSlug = pageName || window.location.pathname;
    const pageTitle = document.title;
    
    // Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-JXBPQP10E6', {
        page_title: pageTitle,
        page_location: window.location.href
      });
      window.gtag('config', 'G-N4LCWQSG0F', {
        page_title: pageTitle,
        page_location: window.location.href
      });
    }
    
    // Mixpanel
    if (window.mixpanelHelpers) {
      window.mixpanelHelpers.trackPageView(pageSlug);
    }
    
    // Facebook Pixel
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'PageView');
    }
    
    // TikTok
    if (window.ttq) {
      window.ttq.page();
    }
    
    // Firebase
    if (window.trackFirebaseEvent) {
      window.trackFirebaseEvent('page_view', {
        page_title: pageTitle,
        page_location: window.location.href
      });
    }
  }, []);

  // Track custom events
  const trackEvent = useCallback((eventName: string, eventProperties: any = {}) => {
    // Mixpanel
    if (window.mixpanelHelpers) {
      window.mixpanelHelpers.track(eventName, eventProperties);
    }
    
    // Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, eventProperties);
    }
    
    // Facebook Pixel
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', eventName, eventProperties);
    }
    
    // Firebase
    if (window.trackFirebaseEvent) {
      window.trackFirebaseEvent(eventName, eventProperties);
    }
  }, []);

  // Track conversions (for ads)
  const trackConversion = useCallback((conversionName: string, value?: number) => {
    const conversionData = value ? { value, currency: 'USD' } : {};
    
    // Google Analytics conversion
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        send_to: 'G-JXBPQP10E6/' + conversionName,
        ...conversionData
      });
    }
    
    // Facebook Pixel conversion
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'Purchase', conversionData);
    }
    
    // Microsoft UET
    if (window.uetq) {
      window.uetq.push('event', conversionName, conversionData);
    }
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackConversion
  };
};

// Hook for automatic page view tracking
export const usePageTracking = (pageName?: string) => {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    // Small delay to ensure all analytics scripts are loaded
    const timer = setTimeout(() => {
      trackPageView(pageName);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [trackPageView, pageName]);
};