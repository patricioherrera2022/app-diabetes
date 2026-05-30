import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { DashboardStats } from './DashboardStats';
import { LogForm } from './LogForm';
import { HistoryList } from './HistoryList';
import { GlucoseChart } from './GlucoseChart';
import { RemindersCard } from './RemindersCard';
import { AuthModal } from './AuthModal';
import { AIAnalyzer } from './AIAnalyzer';
import { useAppContext } from '../context/AppContext';

export function Dashboard() {
  const { mode } = useAppContext();
  const [remindersVisible, setRemindersVisible] = useState(false);

  const toggleRemindersCard = () => {
    setRemindersVisible(!remindersVisible);
  };

  return (
    <div className="app-container">
      <Header toggleRemindersCard={toggleRemindersCard} />
      
      <div className="content">
        {mode === 'guest' && (
          <div className="credentials-banner">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            <div>
              <strong>Modo Invitado Activo:</strong> Los datos se guardan solo en este navegador. Inicia sesión para sincronizar en la nube.
            </div>
          </div>
        )}

        <AuthModal />

        <div id="mainContentArea" style={{ display: 'block' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <AIAnalyzer />
            
            <DashboardStats />

            <div className="desktop-layout">
              <div className="desktop-col-left">
                <RemindersCard isVisible={remindersVisible} />
                <LogForm />
              </div>

              <div className="desktop-col-right">
                <GlucoseChart />
                <HistoryList />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
