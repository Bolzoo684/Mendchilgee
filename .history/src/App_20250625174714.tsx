import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateGreeting from './components/CreateGreeting';
import ViewGreeting from './components/ViewGreeting';
import QRDisplay from './components/QRDisplay';

const THEME_KEY = 'theme';
const COLOR_KEY = 'primaryColor';
const COLOR_OPTIONS = [
  { name: 'Indigo', value: 'indigo', class: 'from-indigo-500 to-purple-500' },
  { name: 'Emerald', value: 'emerald', class: 'from-emerald-500 to-teal-500' },
  { name: 'Rose', value: 'rose', class: 'from-rose-500 to-pink-500' },
  { name: 'Orange', value: 'orange', class: 'from-orange-500 to-yellow-500' },
  { name: 'Blue', value: 'blue', class: 'from-blue-500 to-cyan-500' },
];

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
}

function getInitialColor() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(COLOR_KEY);
    if (stored) return stored;
  }
  return 'indigo';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme());
  const [primaryColor, setPrimaryColor] = useState(getInitialColor());

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-primary', primaryColor);
    localStorage.setItem(COLOR_KEY, primaryColor);
  }, [primaryColor]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2 items-center">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-4 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <select
          value={primaryColor}
          onChange={e => setPrimaryColor(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          {COLOR_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.name}</option>
          ))}
        </select>
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