export function generateAnalysis(logs) {
  if (!logs || logs.length === 0) {
    return "Aún no hay suficientes datos para realizar un análisis. Comienza a registrar tus mediciones para ver tus tendencias.";
  }

  if (logs.length < 3) {
    return "Tengo pocos datos por ahora. Sin embargo, tu última medición fue de " + logs[0].value + " mg/dL. Sigue registrando para darte un análisis más detallado.";
  }

  // Ordenar de más reciente a más antiguo (asumiendo que ya vienen ordenados, pero por seguridad)
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestLog = sortedLogs[0];

  // Cálculos básicos
  const total = sortedLogs.reduce((acc, log) => acc + Number(log.value), 0);
  const avg = Math.round(total / sortedLogs.length);
  
  // Promedio reciente (últimas 3 mediciones)
  const recentLogs = sortedLogs.slice(0, 3);
  const recentAvg = Math.round(recentLogs.reduce((acc, log) => acc + Number(log.value), 0) / recentLogs.length);

  // Análisis por etiquetas
  const tagStats = {};
  sortedLogs.forEach(log => {
    if (log.note) {
      if (!tagStats[log.note]) tagStats[log.note] = { count: 0, sum: 0 };
      tagStats[log.note].count += 1;
      tagStats[log.note].sum += Number(log.value);
    }
  });

  let worstTag = null;
  let worstAvg = 0;
  let bestTag = null;
  let bestAvg = 999;

  for (const tag in tagStats) {
    if (tagStats[tag].count >= 2) { // Solo consideramos si hay al menos 2 medidas
      const tagAvg = tagStats[tag].sum / tagStats[tag].count;
      if (tagAvg > worstAvg) {
        worstAvg = tagAvg;
        worstTag = tag;
      }
      if (tagAvg < bestAvg) {
        bestAvg = tagAvg;
        bestTag = tag;
      }
    }
  }

  // Generación dinámica de frases
  let analysis = "";
  
  // 1. Saludo y contexto reciente
  const greetings = [
    `¡Hola! Analizando tu historial, veo que tu promedio general es de ${avg} mg/dL. `,
    `He revisado tus ${sortedLogs.length} mediciones. Tu glucosa promedio se mantiene en ${avg} mg/dL. `,
    `Aquí tienes tu reporte: en general promedias ${avg} mg/dL. `
  ];
  analysis += greetings[Math.floor(Math.random() * greetings.length)];

  // 2. Comparación de tendencia (últimos 3 vs promedio global)
  if (recentAvg > avg + 15) {
    const alerts = [
      `Sin embargo, ¡cuidado! Tus últimas mediciones promedian ${recentAvg} mg/dL, lo que indica una tendencia al alza recientemente. `,
      `He notado que últimamente tus niveles han subido a un promedio de ${recentAvg} mg/dL, por encima de tu rango habitual. `,
    ];
    analysis += alerts[Math.floor(Math.random() * alerts.length)];
  } else if (recentAvg < avg - 15) {
    const goods = [
      `¡Excelentes noticias! Tus valores recientes promedian ${recentAvg} mg/dL, mostrando que estás logrando bajar tu glucosa general. `,
      `Vas por muy buen camino. Últimamente tus niveles bajaron a ${recentAvg} mg/dL, mucho mejor que tu histórico. `
    ];
    analysis += goods[Math.floor(Math.random() * goods.length)];
  } else {
    const stables = [
      `Tus mediciones más recientes (promedio de ${recentAvg} mg/dL) demuestran que estás bastante estable frente a tu historial. `,
      `Últimamente te mantienes consistente, sin picos alarmantes en comparación con tu promedio histórico. `
    ];
    analysis += stables[Math.floor(Math.random() * stables.length)];
  }

  // 3. Insight de la última medición específica
  if (Number(latestLog.value) > 180) {
    analysis += `🚨 Tu última lectura fue muy alta (${latestLog.value} mg/dL). Intenta tomar agua y revisar si hubo algún exceso de carbohidratos. `;
  } else if (Number(latestLog.value) < 70) {
    analysis += `⚠️ Cuidado, tu última lectura indicó hipoglucemia (${latestLog.value} mg/dL). Asegúrate de tener azúcar a mano. `;
  }

  // 4. Insight por etiquetas/contexto (patrones recurrentes)
  if (worstTag && worstAvg > 140) {
    const tagAlerts = [
      `Presta atención a los momentos etiquetados como "${worstTag}": ahí es donde tu glucosa suele ser más alta (promedio ${Math.round(worstAvg)} mg/dL). `,
      `Un patrón que detecté: tu punto débil parece ser "${worstTag}", promediando ${Math.round(worstAvg)} mg/dL. `
    ];
    analysis += tagAlerts[Math.floor(Math.random() * tagAlerts.length)];
  }

  if (bestTag && bestAvg >= 70 && bestAvg <= 110) {
    const tagGoods = [
      `Por el contrario, tus valores en "${bestTag}" son ideales (${Math.round(bestAvg)} mg/dL). ¡Sigue así en esos momentos! `,
      `Y destaco que en los momentos de "${bestTag}" tienes un excelente control (${Math.round(bestAvg)} mg/dL de promedio). `
    ];
    analysis += tagGoods[Math.floor(Math.random() * tagGoods.length)];
  }

  return analysis;
}
