import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [reminders, setReminders] = useState(["08:00", "12:00", "18:00", "21:00"]);
  const [chartFilter, setChartFilter] = useState('7days');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('guest'); // 'guest' or 'supabase'
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setMode('supabase');
      } else {
        const localLogs = localStorage.getItem('glucose_logs');
        if (!localLogs) {
          setAuthModalVisible(true);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setMode('supabase');
        setAuthModalVisible(false);
      } else {
        setUser(null);
        setMode('guest');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('glucose_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('glucose_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <AppContext.Provider value={{
      logs, setLogs,
      reminders, setReminders,
      chartFilter, setChartFilter,
      notificationsEnabled, setNotificationsEnabled,
      user, setUser,
      mode, setMode,
      authModalVisible, setAuthModalVisible,
      theme, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
