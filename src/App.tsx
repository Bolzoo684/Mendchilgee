import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateGreeting from './components/CreateGreeting';
import ViewGreeting from './components/ViewGreeting';
import QRDisplay from './components/QRDisplay';

const THEME_KEY = 'theme';

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-4 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateGreeting />} />
          <Route path="/qr/:id" element={<QRDisplay />} />
          <Route path="/greeting/:id" element={<ViewGreeting />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;