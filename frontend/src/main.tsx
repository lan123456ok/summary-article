import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/globals.css';
import {ThemeProvider} from "@/context/ThemeContext.tsx";
import App from './App';

const reportWebVitals = () => {
    if ('performance' in window && 'getEntriesType' in performance) {
        const navEntry =
            performance.getEntriesType('navigation')[0] as PerformanceNavigationTiming;

        if (navEntry) {
            console.log(`Time to first byte: ${navEntry.responseStart}ms`);
            console.log(`DOM Content Loaded: ${navEntry.domContentLoadedEventEnd}ms`);
            console.log(`Load Event: ${navEntry.loadEventEnd}ms`);
        }
    }
};

const Root = () => (
    <StrictMode>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </StrictMode>
)

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<Root />)
} else {
    console.error('Failed to find the root element');
}

window.addEventListener('load', reportWebVitals);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(error => {
      console.log('SW registration failed: ', error);
    });
  });
}


