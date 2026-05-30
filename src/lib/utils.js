import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function calculateStats(logs) {
  if (!logs || logs.length === 0) {
    return {
      avg: '-',
      max: '-',
      maxDate: '-',
      min: '-',
      minDate: '-',
      total: 0,
      status: '-'
    };
  }

  let totalValue = 0;
  let maxLog = logs[0];
  let minLog = logs[0];

  logs.forEach(log => {
    const val = Number(log.value);
    totalValue += val;
    if (val > Number(maxLog.value)) maxLog = log;
    if (val < Number(minLog.value)) minLog = log;
  });

  const avgValue = Math.round(totalValue / logs.length);
  
  let status = 'normal';
  if (avgValue < 70 || avgValue > 140) status = 'warning';
  if (avgValue > 180) status = 'danger';

  const formatShortDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), "d MMM, HH:mm", { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  return {
    avg: avgValue,
    max: maxLog.value,
    maxDate: formatShortDate(maxLog.date),
    min: minLog.value,
    minDate: formatShortDate(minLog.date),
    total: logs.length,
    status
  };
}

export function getStatusClass(value) {
  if (value < 70) return 'warning'; // Hypoglycemia
  if (value <= 140) return 'normal';
  if (value <= 180) return 'warning';
  return 'danger';
}
