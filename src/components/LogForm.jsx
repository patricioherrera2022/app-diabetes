import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const QUICK_TAGS = [
  'Ayunas', 'Antes del Desayuno', 'Después del Desayuno',
  'Antes del Almuerzo', 'Después del Almuerzo',
  'Antes de la Cena', 'Después de la Cena', 'Antes de dormir'
];

export function LogForm() {
  const { mode, logs, setLogs, user } = useAppContext();
  const [glucoseValue, setGlucoseValue] = useState(100);
  const [logDate, setLogDate] = useState('');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentDateTime();
  }, []);

  const setCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    setLogDate(localISOTime);
  };

  const adjustGlucose = (amount) => {
    setGlucoseValue(prev => Math.min(Math.max(prev + amount, 20), 600));
  };

  const handleTagSelect = (tag) => {
    setNote(tag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const newLog = {
      id: crypto.randomUUID(),
      value: Number(glucoseValue),
      date: logDate,
      note: note,
      created_at: new Date().toISOString()
    };

    if (mode === 'supabase' && user) {
      newLog.user_id = user.id;
      const { error } = await supabase.from('glucose_logs').insert([newLog]);
      if (error) {
        console.error('Error saving to supabase', error);
        alert('Error guardando en la nube. Revisa tu conexión.');
      } else {
        setLogs([newLog, ...logs]);
      }
    } else {
      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      localStorage.setItem('glucose_logs', JSON.stringify(updatedLogs));
    }

    // Reset form partially
    setNote('');
    setIsSaving(false);
  };

  return (
    <div className="card">
      <div className="card-title">Registrar Medición</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="glucoseValue">Nivel de Glucosa</label>
          <div className="glucose-control">
            <button type="button" className="glucose-btn" onClick={() => adjustGlucose(-5)}>-5</button>
            <button type="button" className="glucose-btn" onClick={() => adjustGlucose(-1)}>-</button>
            <div className="glucose-input-wrapper">
              <input 
                type="number" 
                id="glucoseValue" 
                min="20" max="600" required 
                value={glucoseValue}
                onChange={(e) => setGlucoseValue(Number(e.target.value))}
              />
              <span className="unit-tag">mg/dL</span>
            </div>
            <button type="button" className="glucose-btn" onClick={() => adjustGlucose(1)}>+</button>
            <button type="button" className="glucose-btn" onClick={() => adjustGlucose(5)}>+5</button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="logDate">Fecha y Hora</label>
          <div className="datetime-input-group">
            <input 
              type="datetime-local" 
              id="logDate" 
              required 
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
            />
            <button type="button" className="now-btn" onClick={setCurrentDateTime}>Ahora</button>
          </div>
        </div>

        <div className="form-group">
          <label>Etiqueta / Contexto de la Toma</label>
          <div className="tags-container">
            {QUICK_TAGS.map(tag => (
              <span 
                key={tag}
                className={`tag-pill ${note === tag ? 'selected' : ''}`}
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <input 
            type="text" 
            className="custom-note-input" 
            placeholder="Escribe una nota personalizada o selecciona arriba..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isSaving}>
          <Save size={18} style={{ marginRight: '8px' }} />
          {isSaving ? 'Guardando...' : 'Guardar Medición'}
        </button>
      </form>
    </div>
  );
}
