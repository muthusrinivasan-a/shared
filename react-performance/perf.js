const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            const sendToGoogleAnalytics = ({ name, delta, id }) => {
                const thresholds = {
                    CLS: 0.1,
                    FID: 100,
                    LCP: 2500,
                    FCP: 1800,
                    TTFB: 800,
                };

                const value = Math.round(name === 'CLS' ? delta * 1000 : delta);
                const withinThreshold = value <= thresholds[name];

                // Send the metric to Google Analytics
                window.gtag('event', name, {
                    event_category: 'Web Vitals',
                    event_label: id,
                    value: value,
                    non_interaction: true,
                    event_action: withinThreshold ? 'within_threshold' : 'above_threshold',
                });

                // Log a warning in the console if the metric exceeds the threshold
                if (!withinThreshold) {
                    console.warn(`Warning: ${name} exceeded the threshold. Value: ${value}ms, Threshold: ${thresholds[name]}ms`);
                }
            };

            getCLS(sendToGoogleAnalytics);
            getFID(sendToGoogleAnalytics);
            getFCP(sendToGoogleAnalytics);
            getLCP(sendToGoogleAnalytics);
            getTTFB(sendToGoogleAnalytics);
        });
    }
};

export default reportWebVitals;
