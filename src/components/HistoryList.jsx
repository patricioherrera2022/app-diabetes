import React, { useState } from 'react';
import { Search, Download, Trash2, Droplet } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { getStatusClass } from '../lib/utils';
import * as XLSX from 'xlsx';

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

  const exportToExcel = () => {
    if (logs.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const dataToExport = logs.map(log => {
      let dateStr = log.date;
      let timeStr = "";
      try {
        const d = parseISO(log.date);
        dateStr = format(d, 'yyyy-MM-dd');
        timeStr = format(d, 'HH:mm');
      } catch (e) {
        // Fallback if date is malformed
      }

      return {
        "Fecha": dateStr,
        "Hora": timeStr,
        "Glucosa (mg/dL)": log.value,
        "Nota/Etiqueta": log.note || ""
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Styling the headers (bold) - sheetjs free version support is limited but we can auto-size cols
    const wscols = [
      {wch: 12}, // Fecha
      {wch: 10}, // Hora
      {wch: 18}, // Glucosa
      {wch: 30}  // Nota
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial Glucosa");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `glycoflow_export_${format(new Date(), 'yyyyMMdd')}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <div className="history-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="card-title" style={{ marginBottom: 0 }}>Historial de Medidas</div>
        <button className="btn-export" onClick={exportToExcel} title="Exportar Excel" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          <Download size={16} /> Exportar Excel
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
