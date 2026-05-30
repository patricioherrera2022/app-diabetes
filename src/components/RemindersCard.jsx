import React, { useState } from 'react';
import { Clock, Trash2, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function RemindersCard({ isVisible }) {
  const { reminders, setReminders, notificationsEnabled, setNotificationsEnabled } = useAppContext();
  const [newTime, setNewTime] = useState('08:00');

  if (!isVisible) return null;

  const handleToggleNotifications = (e) => {
    const isEnabled = e.target.checked;
    setNotificationsEnabled(isEnabled);
    localStorage.setItem('glucose_reminders_enabled', isEnabled);
    if (isEnabled && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const handleAdd = () => {
    if (!newTime || reminders.includes(newTime)) return;
    const updated = [...reminders, newTime].sort();
    setReminders(updated);
    localStorage.setItem('glucose_reminders', JSON.stringify(updated));
  };

  const handleDelete = (time) => {
    const updated = reminders.filter(r => r !== time);
    setReminders(updated);
    localStorage.setItem('glucose_reminders', JSON.stringify(updated));
  };

  return (
    <div className="card" id="remindersCard">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} /> Recordatorios Diarios
        </span>
      </div>
      <div className="reminder-intro" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Programa alertas para medir tu glucosa. Para recibirlas, debes permitir notificaciones.
      </div>
      <div className="reminder-switch-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
        <span className="switch-label" style={{ fontSize: '13px', fontWeight: '600' }}>Activar Alertas</span>
        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
          <input 
            type="checkbox" 
            checked={notificationsEnabled} 
            onChange={handleToggleNotifications}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span className={`slider ${notificationsEnabled ? 'active' : ''}`} style={{
            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: notificationsEnabled ? 'var(--primary)' : '#ccc',
            transition: '.4s', borderRadius: '24px'
          }}>
            <span style={{
              position: 'absolute', content: '""', height: '18px', width: '18px',
              left: notificationsEnabled ? '22px' : '3px', bottom: '3px', backgroundColor: 'white',
              transition: '.4s', borderRadius: '50%'
            }}></span>
          </span>
        </label>
      </div>
      <div className="add-reminder-form" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input 
          type="time" 
          value={newTime} 
          onChange={e => setNewTime(e.target.value)}
          style={{ flexGrow: 1, height: '36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', padding: '0 10px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        />
        <button 
          onClick={handleAdd}
          className="btn-primary" 
          style={{ width: 'auto', height: '36px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Agregar
        </button>
      </div>
      <div className="reminders-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {reminders.map(time => (
          <div key={time} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <Clock size={16} color="var(--primary)" /> {time}
            </div>
            <button onClick={() => handleDelete(time)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
