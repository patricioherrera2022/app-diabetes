import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export function AuthModal() {
  const { authModalVisible, setAuthModalVisible } = useAppContext();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (tab === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registro exitoso. Revisa tu correo electrónico para confirmar la cuenta si es necesario, o inicia sesión.');
        setTab('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Auth state change listener in context will handle the rest
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error en la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    setAuthModalVisible(false);
  };

  return (
    <div className="auth-modal-overlay visible">
      <div className="auth-modal-box">
        <div className="auth-modal-header">
          <div className="auth-modal-logo">
            <Activity size={20} color="#ffffff" />
          </div>
          <div className="auth-modal-title">GlycoFlow</div>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`} 
            onClick={() => { setTab('login'); setErrorMsg(''); }}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`} 
            onClick={() => { setTab('register'); setErrorMsg(''); }}
          >
            Registrarse
          </button>
        </div>

        {errorMsg && <div className="auth-error-msg" style={{ display: 'block' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              className="custom-note-input" 
              placeholder="ejemplo@correo.com" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              className="custom-note-input" 
              placeholder="Mínimo 6 caracteres" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <div className="spinner"></div> : (tab === 'login' ? 'Ingresar' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="auth-divider">o</div>
        <button className="now-btn" style={{ width: '100%', height: '44px', fontWeight: '700', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)' }} onClick={continueAsGuest}>
          Continuar sin cuenta (datos locales)
        </button>
      </div>
    </div>
  );
}
