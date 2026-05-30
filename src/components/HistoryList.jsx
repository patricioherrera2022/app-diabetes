import React, { useState } from 'react';
import { Search, Download, Trash2, Droplet } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { getStatusClass } from '../lib/utils';

export function HistoryList() {
  const { logs, setLogs, mode } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    const noteMatch = log.note ? log.note.toLowerCase().includes(term) : false;
    const valueMatch = log.value.toString().includes(term);
    return noteMatch || valueMatch;
  });

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta medición?')) return;

    if (mode === 'supabase') {
      const { error } = await supabase.from('glucose_logs').delete().eq('id', id);
      if (!error) {
        setLogs(logs.filter(log => log.id !== id));
      } else {
        alert('Error eliminando el registro en la nube.');
      }
    } else {
      const updatedLogs = logs.filter(log => log.id !== id);
      setLogs(updatedLogs);
      localStorage.setItem('glucose_logs', JSON.stringify(updatedLogs));
    }
  };

  const exportToCSV = () => {
    if (logs.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Fecha,Hora,Glucosa (mg/dL),Nota/Etiqueta\n";

    logs.forEach(log => {
      try {
        const d = parseISO(log.date);
        const dateStr = format(d, 'yyyy-MM-dd');
        const timeStr = format(d, 'HH:mm');
        const noteStr = log.note ? `"${log.note.replace(/"/g, '""')}"` : "";
        csvContent += `${dateStr},${timeStr},${log.value},${noteStr}\n`;
      } catch (e) {
        // Fallback
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `glycoflow_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <div className="history-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="card-title" style={{ marginBottom: 0 }}>Historial de Medidas</div>
        <button className="btn-export" onClick={exportToCSV} title="Exportar CSV" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className="search-wrapper" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0 12px', marginBottom: '16px' }}>
        <Search size={16} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Buscar por nota o valor..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', flexGrow: 1, height: '40px', padding: '0 10px', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      <div className="history-list">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            <Droplet size={48} />
            <p>No hay mediciones registradas aún.<br/>Agrega una nueva arriba.</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const status = getStatusClass(log.value);
            return (
              <div key={log.id} className="history-item">
                <div className={`glucose-badge ${status}`}>
                  <span>{log.value}</span>
                  <span className="unit">mg/dL</span>
                </div>
                <div className="history-details">
                  <div className="history-meta">
                    <span className="history-date">
                      {format(parseISO(log.date), "d MMM, HH:mm", { locale: es })}
                    </span>
                    <span className={`history-tag tag-${status}`}>
                      {status === 'normal' ? 'Normal' : status === 'warning' ? 'Precaución' : 'Peligro'}
                    </span>
                  </div>
                  {log.note && <div className="history-note">{log.note}</div>}
                </div>
                <div className="history-actions">
                  <button className="btn-delete-log" onClick={() => handleDelete(log.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
