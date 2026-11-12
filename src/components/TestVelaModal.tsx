import React, { useState } from 'react';
import { X, Sparkles, Flame, Zap, Clock, ArrowRight, Play, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestVelaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVela: (mult: number, customTime?: string) => void;
  autoSimulate: boolean;
  onToggleSimulate: () => void;
}

export const TestVelaModal: React.FC<TestVelaModalProps> = ({
  isOpen,
  onClose,
  onAddVela,
  autoSimulate,
  onToggleSimulate,
}) => {
  const [multInput, setMultInput] = useState<string>('124.52');
  const [timeInput, setTimeInput] = useState<string>('12:32:25');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const multVal = parseFloat(multInput) || 1.0;

  // Real-time calculation preview based on current input
  const match = timeInput.match(/(\d{2}):(\d{2}):(\d{2})/);
  let previewFormula: string | null = null;
  let target1 = '';
  let target2 = '';
  let proj1h = '';
  let target100x = '';

  if (match) {
    const hh = parseInt(match[1], 10);
    const mm = parseInt(match[2], 10);
    const ss = match[3];
    const d1 = parseInt(ss[0], 10);
    const d2 = parseInt(ss[1], 10);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const t1 = (mm + d1) % 60;
    const h1 = (hh + Math.floor((mm + d1) / 60)) % 24;
    const t2 = (mm + d2) % 60;
    const h2 = (hh + Math.floor((mm + d2) / 60)) % 24;

    target1 = `${pad(h1)}:${pad(t1)}`;
    target2 = `${pad(h2)}:${pad(t2)}`;
    proj1h = `${pad((hh + 1) % 24)}:${pad(mm)}:${ss}`;

    if (multVal >= 100.0) {
      const t100 = (mm + 30) % 60;
      const h100 = (hh + Math.floor((mm + 30) / 60)) % 24;
      target100x = `${pad(h100)}:${pad(t100)}`;

      previewFormula = `👑 ALVO 100X+: Minuto ${mm} + 30 min = ${pad(t100)} (Alvo ${target100x})`;
    } else if (multVal >= 10.0 || Math.abs(multVal - 1.0) < 0.01) {
      previewFormula = `${mm} + ${d1} = ${pad(t1)} (Alvo ${target1}) e ${mm} + ${d2} = ${pad(t2)} (Alvo ${target2})`;
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onAddVela(multVal, timeInput);

    if (multVal >= 10.0) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff2a85', '#f59e0b', '#10b981'],
      });
    }

    setFeedback(`Vela ${multVal.toFixed(2)}x adicionada com sucesso! Somas e projeções recalculadas.`);
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1200);
  };

  const setScenario = (mult: string, time: string) => {
    setMultInput(mult);
    setTimeInput(time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#10141e] border border-slate-700/80 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
                TESTAR VELA & FÓRMULAS AO VIVO
              </h3>
              <p className="text-[11px] text-slate-400">
                Simule qualquer vela para verificar as somas e projeções
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="mt-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Cenários Rápidos do Usuário:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setScenario('10.75', '00:40:27')}
              className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/40 text-left hover:bg-rose-950/50 transition-colors"
            >
              <div className="font-bold text-rose-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Prompt: 10.75x às 00:40:27
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                40+2=42 e 40+7=47 (Gera :42 e :47)
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScenario('1.00', '00:40:27')}
              className="p-2 rounded-lg bg-sky-950/30 border border-sky-500/40 text-left hover:bg-sky-950/50 transition-colors"
            >
              <div className="font-bold text-sky-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                Crash 1.00x às 00:40:27
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Soma minuto com segundos de 1.00x
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScenario('13.00', '22:00:15')}
              className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/40 text-left hover:bg-amber-950/50 transition-colors"
            >
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Projeção +1h: 13.00x às 22:00
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Gera projeção exata para as 23:00
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScenario('65.20', '00:35:10')}
              className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/40 text-left hover:bg-purple-950/50 transition-colors"
            >
              <div className="font-bold text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Mega Vela 65.20x (≥50x)
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Dispara termômetro 50x e zera gap
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScenario('125.00', '10:25:12')}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-950/80 to-amber-950/80 border border-amber-400/80 text-left hover:border-yellow-300 transition-colors shadow-sm"
            >
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                <span>👑 Exemplo Oficial: 125x às 10:25:12</span>
              </div>
              <div className="text-[10px] text-amber-200/90 mt-0.5">
                25+1+2+5 = :33 e 25+30 = :55
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScenario('124.52', '12:32:25')}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-950/70 to-pink-950/70 border border-purple-400/60 text-left hover:border-amber-400 transition-colors"
            >
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                <span>👑 Vela Acima de 100X (124.52x)</span>
              </div>
              <div className="text-[10px] text-purple-200 mt-0.5">
                Testa destaque 100x+ nos gráficos
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScenario('1250.00', '12:35:10')}
              className="p-2 rounded-lg bg-gradient-to-r from-amber-950/80 via-rose-950/80 to-purple-950/80 border border-yellow-400/80 text-left hover:border-yellow-300 transition-colors shadow-sm"
            >
              <div className="font-bold text-yellow-300 flex items-center gap-1.5">
                <span>💎</span>
                <span>Vela Mítica Acima de 1000X (1250x)</span>
              </div>
              <div className="text-[10px] text-yellow-200 mt-0.5">
                Testa destaque diferenciado lendário
              </div>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Multiplicador (x)
              </label>
              <input
                type="text"
                value={multInput}
                onChange={(e) => setMultInput(e.target.value)}
                placeholder="Ex: 10.75 ou 1.00"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Horário (HH:MM:SS)
              </label>
              <input
                type="text"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                placeholder="00:40:27"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Mathematical Preview Box */}
          {match && (multVal >= 10.0 || Math.abs(multVal - 1.0) < 0.01) && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs">
              <div className="font-bold text-emerald-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Somas dos DOIS Segundos (10x+ e 1.00x):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Minuto: {match[2]} | Seg: {match[3]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/40">
                  <span className="text-emerald-400 font-bold block text-[10px]">1ª SOMA (1º SEG: {match[3][0]})</span>
                  <div className="text-white text-xs font-bold mt-0.5">{match[2]} + {match[3][0]} = {target1.split(':')[1]}</div>
                  <div className="text-emerald-300 text-[10px]">Alvo: {target1}</div>
                </div>

                <div className="bg-amber-950/40 p-2 rounded border border-amber-500/40">
                  <span className="text-amber-400 font-bold block text-[10px]">2ª SOMA (2º SEG: {match[3][1]})</span>
                  <div className="text-white text-xs font-bold mt-0.5">{match[2]} + {match[3][1]} = {target2.split(':')[1]}</div>
                  <div className="text-amber-300 text-[10px]">Alvo: {target2}</div>
                </div>
              </div>

              {multVal >= 10.0 && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                  <span>Projeção +1h:</span>
                  <strong className="text-rose-400">{timeInput} ➔ {proj1h}</strong>
                </div>
              )}
            </div>
          )}

          {feedback && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs text-center font-bold">
              {feedback}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Inserir Vela no Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Simulator Toggle Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-sky-400" />
            <span>Simulador Contínuo Automático:</span>
          </span>
          <button
            type="button"
            onClick={onToggleSimulate}
            className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors ${
              autoSimulate
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {autoSimulate ? 'LIGADO (A cada 12s)' : 'DESLIGADO'}
          </button>
        </div>
      </div>
    </div>
  );
};
