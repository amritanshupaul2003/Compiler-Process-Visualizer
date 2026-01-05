'use client';

import { useEffect } from 'react';

export default function Watermark() {
  useEffect(() => {
    // Add invisible watermark to DOM
    const watermark = document.createElement('div');
    watermark.id = 'app-watermark';
    watermark.style.position = 'fixed';
    watermark.style.bottom = '10px';
    watermark.style.right = '10px';
    watermark.style.color = 'rgba(255,255,255,0.1)';
    watermark.style.fontSize = '8px';
    watermark.style.zIndex = '9999';
    watermark.style.userSelect = 'none';
    watermark.style.pointerEvents = 'none';
    watermark.textContent = `© ${new Date().getFullYear()} Compiler Visualizer - amritanshu_paul: ${process.env.NEXT_PUBLIC_APP_SECRET?.slice(0, 8)}`;
    document.body.appendChild(watermark);

    // Prevent right-click and F12
    const disableDevTools = (e: KeyboardEvent | MouseEvent) => {
      // Disable F12
      if (e instanceof KeyboardEvent && e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e instanceof KeyboardEvent && e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      
      // Disable right-click
      if (e instanceof MouseEvent && e.button === 2) {
        e.preventDefault();
        alert('Right-click is disabled');
        return false;
      }
    };

    document.addEventListener('keydown', disableDevTools);
    document.addEventListener('contextmenu', disableDevTools);

    // Detect DevTools opening (basic detection)
    const devToolsDetection = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        document.body.innerHTML = '<h1 style="text-align:center;padding:50px;">Developer Tools Detected</h1>';
      }
    };
    
    setInterval(devToolsDetection, 1000);

    return () => {
      document.removeEventListener('keydown', disableDevTools);
      document.removeEventListener('contextmenu', disableDevTools);
      if (document.getElementById('app-watermark')) {
        document.body.removeChild(watermark);
      }
    };
  }, []);

  return null;
}