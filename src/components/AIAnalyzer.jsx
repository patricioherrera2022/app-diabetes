import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateAnalysis } from '../lib/analyzer';

export function AIAnalyzer() {
  const { logs } = useAppContext();
  const [analysisText, setAnalysisText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Generate initial analysis when logs are loaded
    if (logs && logs.length > 0 && !analysisText) {
      handleGenerate();
    }
  }, [logs]);

  const handleGenerate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setAnalysisText(generateAnalysis(logs));
      setIsAnimating(false);
    }, 600); // Pequeño retraso visual para dar sensación de "pensando..."
  };

  if (!logs || logs.length === 0) return null;

  return (
    <div className="card" style={{ 
      background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--primary-light) 100%)',
      border: '1px solid var(--primary-glow)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: 'var(--primary)' }}>
        <Bot size={120} />
      </div>
      
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
          <Sparkles size={18} /> Asistente Inteligente
        </span>
        <button 
          onClick={handleGenerate} 
          disabled={isAnimating}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px'
          }}
        >
          <RefreshCw size={14} className={isAnimating ? "spinner" : ""} style={{ borderColor: 'transparent', borderTopColor: 'transparent', animation: isAnimating ? 'spin 1s linear infinite' : 'none' }} />
          Actualizar
        </button>
      </div>
      
      <div style={{ position: 'relative', zIndex: 1, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
        {isAnimating ? (
          <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Bot size={16} className="spinner" style={{ animation: 'spin 2s linear infinite', border: 'none' }} />
            Analizando tus tendencias...
          </div>
        ) : (
          <div>{analysisText}</div>
        )}
      </div>
    </div>
  );
}
