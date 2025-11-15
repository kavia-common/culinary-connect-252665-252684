import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Log Supabase env presence for diagnostics without exposing secrets
  // Only logs whether variables are set; does not print values.
  useEffect(() => {
    const hasUrl = !!process.env.REACT_APP_SUPABASE_URL;
    const hasKey = !!process.env.REACT_APP_SUPABASE_KEY;
    // eslint-disable-next-line no-console
    console.info(
      `[Env Check] REACT_APP_SUPABASE_URL set: ${hasUrl}; REACT_APP_SUPABASE_KEY set: ${hasKey}`
    );
  }, []);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <p>
          App running on port: <strong>{process.env.REACT_APP_PORT || '3000'}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
