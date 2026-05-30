import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';

export function GlucoseChart() {
  const { logs, chartFilter, setChartFilter, theme } = useAppContext();

  const chartData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    
    let filtered = [...logs];
    const now = new Date();

    if (chartFilter === '7days') {
      const cutoff = subDays(now, 7);
      filtered = filtered.filter(l => parseISO(l.date) >= cutoff);
    } else if (chartFilter === '30days') {
      const cutoff = subDays(now, 30);
      filtered = filtered.filter(l => parseISO(l.date) >= cutoff);
    }

    // Sort ascending for chart
    filtered.sort((a, b) => parseISO(a.date) - parseISO(b.date));

    return filtered.map(l => ({
      ...l,
      displayDate: format(parseISO(l.date), "d MMM", { locale: es }),
      displayTime: format(parseISO(l.date), "HH:mm")
    }));
  }, [logs, chartFilter]);

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>{data.displayDate} {data.displayTime}</p>
          <p style={{ margin: 0, color: 'var(--primary)', fontSize: '18px', fontWeight: 'bold' }}>{data.value} mg/dL</p>
          {data.note && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{data.note}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="card-title" style={{ marginBottom: 0 }}>Tendencias de Glucosa</div>
        <div className="filter-group" style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          <button className={`filter-btn ${chartFilter === '7days' ? 'active' : ''}`} onClick={() => setChartFilter('7days')} style={{ padding: '4px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: chartFilter === '7days' ? 'var(--bg-card)' : 'transparent', color: chartFilter === '7days' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: chartFilter === '7days' ? 'bold' : 'normal', boxShadow: chartFilter === '7days' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>7 Días</button>
          <button className={`filter-btn ${chartFilter === '30days' ? 'active' : ''}`} onClick={() => setChartFilter('30days')} style={{ padding: '4px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: chartFilter === '30days' ? 'var(--bg-card)' : 'transparent', color: chartFilter === '30days' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: chartFilter === '30days' ? 'bold' : 'normal', boxShadow: chartFilter === '30days' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>30 Días</button>
          <button className={`filter-btn ${chartFilter === 'all' ? 'active' : ''}`} onClick={() => setChartFilter('all')} style={{ padding: '4px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: chartFilter === 'all' ? 'var(--bg-card)' : 'transparent', color: chartFilter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: chartFilter === 'all' ? 'bold' : 'normal', boxShadow: chartFilter === 'all' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>Todo</button>
        </div>
      </div>
      
      <div className="chart-target-indicator" style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--normal)' }}></span> Normal (70 - 140)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span> Elevado (141 - 180)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span> Peligroso
        </div>
      </div>

      <div className="chart-container" style={{ height: '300px', width: '100%' }}>
        {chartData.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Insuficientes datos para graficar.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: textColor }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={140} stroke="var(--warning)" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={70} stroke="var(--warning)" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={180} stroke="var(--danger)" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
