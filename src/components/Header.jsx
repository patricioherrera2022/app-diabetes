import React, { useState, useRef, useEffect } from 'react';
import { Moon, Bell, User, Activity, LogOut, LogIn } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export function Header({ toggleRemindersCard }) {
  const { theme, toggleTheme, user, mode, setAuthModalVisible, notificationsEnabled } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleAuthAction = async () => {
    setDropdownOpen(false);
    if (user) {
      await supabase.auth.signOut();
    } else {
      setAuthModalVisible(true);
    }
  };

  return (
    <header>
      <div className="logo-area">
        <div className="logo-icon">
          <Activity size={18} color="#ffffff" />
        </div>
        <h1>GlycoFlow</h1>
      </div>
      
      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Cambiar Tema">
          <Moon size={18} />
        </button>
        
        <button className={`icon-btn ${notificationsEnabled ? 'active' : ''}`} onClick={toggleRemindersCard} title="Recordatorios Diarios">
          <Bell size={18} />
          <span className="badge-dot"></span>
        </button>
        
        <div className="profile-menu-wrapper" ref={dropdownRef}>
          <button className="icon-btn" onClick={() => setDropdownOpen(!dropdownOpen)} title="Mi Cuenta">
            <User size={18} />
          </button>
          
          {dropdownOpen && (
            <div className="profile-dropdown" style={{ display: 'flex' }}>
              <div className="dropdown-header">
                <div className="user-email">{user ? user.email : 'invitado@glycoflow.com'}</div>
                <div className={`sync-status ${mode}`}>
                  <span className="status-dot"></span>
                  <span className="status-text">{mode === 'supabase' ? 'Sincronizado' : 'Modo Invitado'}</span>
                </div>
              </div>
              <button className="btn-dropdown-action" onClick={handleAuthAction}>
                {user ? (
                  <>
                    <LogOut size={14} style={{ marginRight: '6px' }} />
                    Cerrar Sesión
                  </>
                ) : (
                  <>
                    <LogIn size={14} style={{ marginRight: '6px' }} />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
