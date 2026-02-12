import type { Metadata } from "next";
import Script from "next/script";
import "../app/styles/globals.css";
import { ClientProviders } from "./providers";
import { SessionProvider } from "@/context/SessionContext";
import { Analytics } from "@vercel/analytics/next"


export const metadata: Metadata = {
  metadataBase: new URL('https://getconch.ai'),
  title: "Conch AI - Your Undetectable AI Essay Writing and Research Assistant",
  description: "Access every AI school tool in one to enhance your writing and research, without the busywork. Write, cite, and edit research papers, generate mind maps, notes, and flashcards from anything, or check for and bypass AI detection by humanizing your text.",
  icons: {
    icon: "/images/logos/logo_w_background.png",
    shortcut: "/images/logos/logo_w_background.png",
    apple: "/images/logos/logo_w_background.png",
  },
  openGraph: {
    title: "Conch AI - Your Undetectable AI Essay Writing and Research Assistant",
    description: "Access every AI school tool in one to enhance your writing and research, without the busywork. Write, cite, and edit research papers, generate mind maps, notes, and flashcards from anything, or check for and bypass AI detection by humanizing your text.",
    images: [
      {
        url: "/images/og.jpeg",
        width: 1200,
        height: 630,
        alt: "Conch AI Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conch AI - Your Undetectable AI Essay Writing and Research Assistant",
    description: "Access every AI school tool in one to enhance your writing and research, without the busywork. Write, cite, and edit research papers, generate mind maps, notes, and flashcards from anything, or check for and bypass AI detection by humanizing your text.",
    images: ["/images/logos/logo_w_background.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PJGFL7D5');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4213967862143118"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics - Optimized for Next.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JXBPQP10E6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configure both GA4 properties
            gtag('config', 'G-JXBPQP10E6', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false // We'll handle page views manually
            });
            
            gtag('config', 'G-N4LCWQSG0F', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false // We'll handle page views manually
            });
            
            // Make gtag globally available
            window.gtag = gtag;
          `}
        </Script>

        {/* TikTok Analytics */}
        <Script id="tiktok-analytics" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('CKO3HTRC77U3K90HB9B0');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '719668830191155');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Twitter Analytics */}
        <Script id="twitter-analytics" strategy="afterInteractive">
          {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','okq96');
          `}
        </Script>

        {/* Reddit Analytics */}
        <Script id="reddit-analytics" strategy="afterInteractive">
          {`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_dyrzzr505bj1');rdt('track', 'PageVisit');
          `}
        </Script>

        {/* Microsoft UET Tag */}
        <Script id="microsoft-uet" strategy="afterInteractive">
          {`
            (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"343114439", enableAutoSpaTracking: true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");
          `}
        </Script>

        {/* Setup Microsoft UET */}
        <Script id="microsoft-uet-setup" strategy="afterInteractive">
          {`window.uetq = window.uetq || [];`}
        </Script>

        {/* HotJar */}
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3876205,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>

        {/* GCLID Cookie Custom Code */}
        <Script id="gclid-cookie" strategy="afterInteractive">
          {`
            (function() {
                function getQueryParam(param) {
                    var urlParams = new URLSearchParams(window.location.search);
                    return urlParams.get(param);
                }

                var gclid = getQueryParam('gclid');
                if (gclid) {
                  console.log("setted cookie")
                    document.cookie = "FROM_GOOGLE_AD=true; path=/; domain=getconch.ai; SameSite=None; Secure";
                }
            })();
          `}
        </Script>

        {/* PostHog Analytics */}
        <Script id="posthog" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_cSNDcO8FLNy9PtHZFPdnyRsvmSgTTQjsPjsYDtPpQ8N',{api_host:'https://us.i.posthog.com', person_profiles: 'identified_only'});
          `}
        </Script>

        {/* Mixpanel Analytics */}
        <Script id="mixpanel" strategy="afterInteractive">
          {`
            (function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split( " "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for ( var d = {}, e = ["get_group"].concat( Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);

            mixpanel.init('4477213da2d35dcd72db46a7bd7152f9', {debug: false, track_pageview: true,
                ignore_dnt: true,
                api_host: "https://conch-user-inf-a77wo.ondigitalocean.app",
                persistence: "localStorage" } );

            console.log("MIXPANEL DONE!");
          `}
        </Script>

        {/* Firebase Analytics - Optimized for Next.js */}
        <Script
          src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics-compat.js"
          strategy="afterInteractive"
        />
        <Script id="firebase-init" strategy="afterInteractive">
          {`
            // Firebase configuration
            const firebaseConfig = {
              apiKey: "AIzaSyAW6JPcSP8CHgNxS2tZ71kDNM5cG3jKCxw",
              authDomain: "conchai-368ad.firebaseapp.com",
              projectId: "conchai-368ad",
              storageBucket: "conchai-368ad.appspot.com",
              messagingSenderId: "881945530419",
              appId: "1:881945530419:web:0f8aa4db5384d35b229346",
              measurementId: "G-JXBPQP10E6"
            };

            // Initialize Firebase
            if (typeof firebase !== 'undefined' && !firebase.apps.length) {
              firebase.initializeApp(firebaseConfig);
              const analytics = firebase.analytics();
              
              // Global tracking function
              window.trackFirebaseEvent = function(eventName, eventData = {}) {
                if (analytics) {
                  analytics.logEvent(eventName, eventData);
                }
              };
              
              console.log("Firebase Analytics initialized");
            }
          `}
        </Script>

        {/* Facebook Pixel NoScript */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=719668830191155&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PJGFL7D5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Mixpanel Helper Functions - Next.js Optimized */}
        <Script id="mixpanel-helpers" strategy="afterInteractive">
          {`
            // Enhanced Mixpanel tracking with Next.js optimizations
            window.mixpanelHelpers = {
              // Standard tracking
              track: function(eventName, eventProperties = {}) {
                if (typeof mixpanel !== 'undefined' && typeof mixpanel.track === 'function') {
                  const enhancedProps = {
                    ...eventProperties,
                    page_url: window.location.href,
                    page_path: window.location.pathname,
                    timestamp: new Date().toISOString()
                  };
                  return mixpanel.track(eventName, enhancedProps);
                } else {
                  console.warn('Mixpanel track function not available yet');
                }
              },
              
              // Delayed tracking (for page views)
              trackDelayed: async function(eventName, eventProperties = {}, delay = 1000) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.track(eventName, eventProperties);
              },
              
              // Page view tracking
              trackPageView: function(pageName = null) {
                const pageSlug = pageName || window.location.pathname;
                return this.trackDelayed("Page View", {
                  "page_slug": pageSlug,
                  "page_title": document.title,
                  "referrer": document.referrer
                });
              }
            };
            
            // Backward compatibility
            window.mixPanelTrack = window.mixpanelHelpers.track;
            window.waitAndMixPanelTrack = window.mixpanelHelpers.trackDelayed;
          `}
        </Script>

        <ClientProviders>
          <SessionProvider>{children}</SessionProvider>
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
