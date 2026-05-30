import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateStats } from '../lib/utils';

export function DashboardStats() {
  const { logs } = useAppContext();
  
  const stats = useMemo(() => calculateStats(logs), [logs]);

  return (
    <div className="summary-grid">
      <div className="stat-card stat-avg">
        <div className="stat-label">Promedio</div>
        <div className="stat-val">{stats.avg} <span className="unit">mg/dL</span></div>
        <span className={`avg-status ${stats.status}`}>
          {stats.status === 'normal' ? 'Normal' : stats.status === 'warning' ? 'Precaución' : 'Peligro'}
        </span>
      </div>
      <div className="stat-card stat-max">
        <div className="stat-label">Más Alto</div>
        <div className="stat-val">{stats.max} <span className="unit">mg/dL</span></div>
        <div className="stat-sub">{stats.maxDate}</div>
      </div>
      <div className="stat-card stat-min">
        <div className="stat-label">Más Bajo</div>
        <div className="stat-val">{stats.min} <span className="unit">mg/dL</span></div>
        <div className="stat-sub">{stats.minDate}</div>
      </div>
      <div className="stat-card stat-tot">
        <div className="stat-label">Registros</div>
        <div className="stat-val">{stats.total} <span className="unit">logs</span></div>
        <div className="stat-sub">Historial guardado</div>
      </div>
    </div>
  );
}
