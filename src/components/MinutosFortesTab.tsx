import React from 'react';
import { Clock, Flame, Sparkles } from 'lucide-react';
import { FinalGroup } from '../types/radar';

interface MinutosFortesTabProps {
  hotFinals: FinalGroup[];
  observationFinals: FinalGroup[];
  selectedHour: number;
  onSelectHour: (hour: number) => void;
  currentHour: number;
}

export const MinutosFortesTab: React.FC<MinutosFortesTabProps> = ({
  hotFinals,
  observationFinals,
  selectedHour,
  onSelectHour,
  currentHour,
}) => {
  const pad = (n: number) => n.toString().padStart(2, '0');

  // 24 hours list
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-10">
      {/* Top Filter Strip: Selecionar Horário do Dia */}
      <div className="bg-[#10141e] border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-rose-400">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            SELECIONAR HORÁRIO DO DIA
          </span>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            AGUARDANDO CONFIRMAÇÃO
          </span>
        </div>

        {/* Horizontal scrollable buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {/* Hora Atual quick pill */}
          <button
            onClick={() => onSelectHour(currentHour)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
              selectedHour === currentHour
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Hora Atual ({pad(currentHour)}h)
          </button>

          {hours.map((h) => {
            const isSelected = selectedHour === h;
            return (
              <button
                key={h}
                onClick={() => onSelectHour(h)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 font-mono ${
                  isSelected
                    ? 'bg-rose-600 text-white font-bold shadow-sm shadow-rose-600/30'
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {pad(h)}h
              </button>
            );
          })}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="pt-1 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
            <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-100 uppercase">
              MINUTOS FORTES
            </h2>
            <p className="text-xs text-slate-400">
              Minutos que mais pagam velas rosas na hora selecionada ({pad(selectedHour)}:00h)
            </p>
          </div>
        </div>
      </div>

      {/* Hot Finals Cards (e.g. Final 2, Final 3, Final 8) */}
      <div className="space-y-3.5">
        {hotFinals.map((fg) => (
          <div
            key={fg.finalDigit}
            className="bg-[#121622] border border-rose-500/30 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-400">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                FINAL {fg.finalDigit} • VELA ROSA CHEGANDO
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-500/30">
                {fg.confirmacoesCount}x confirmado
              </span>
            </div>

            {/* Minutes Grid: 6 boxes [02] [12] [22] [32] [42] [52] */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {fg.minutos.map((m) => {
                const isPaid = m.status === 'confirmada';
                const isTarget = m.status === 'alvo';

                return (
                  <div
                    key={m.minutoStr}
                    className={`py-3 sm:py-4 rounded-xl text-center font-mono font-black text-base sm:text-lg tabular-nums border transition-all ${
                      isPaid
                        ? 'bg-rose-950/40 border-rose-500 text-rose-400 shadow-md shadow-rose-500/20 ring-1 ring-rose-500/50'
                        : isTarget
                        ? 'bg-amber-950/30 border-amber-400 text-amber-400 shadow-md shadow-amber-400/20 ring-1 ring-amber-400/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m.minutoStr}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Observation Section (1 Pagamento) */}
      <div className="bg-[#10141e] border border-slate-800/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          EM OBSERVAÇÃO (1 PAGAMENTO)
        </div>

        <div className="space-y-2.5 font-mono text-xs sm:text-sm">
          {observationFinals.slice(0, 4).map((ob) => (
            <div key={ob.finalDigit} className="flex items-center gap-3">
              <span className="text-slate-400 font-bold w-16 shrink-0">
                Final {ob.finalDigit}:
              </span>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {ob.minutos.map((m) => {
                  const isPaid = m.status === 'confirmada';
                  const isTarget = m.status === 'observacao' || m.status === 'alvo';

                  if (isPaid) {
                    return (
                      <span
                        key={m.minutoStr}
                        className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold"
                      >
                        {m.minutoStr}
                      </span>
                    );
                  }
                  if (isTarget) {
                    return (
                      <span
                        key={m.minutoStr}
                        className="px-1.5 py-0.5 rounded border border-emerald-500/60 text-emerald-400 font-bold"
                      >
                        {m.minutoStr}
                      </span>
                    );
                  }
                  return (
                    <span key={m.minutoStr} className="text-slate-500">
                      {m.minutoStr}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend at Bottom */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-rose-500 bg-rose-950" />
            <span>Vela Rosa Confirmada (Já Pagou)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-950" />
            <span>Vela Rosa Chegando (Minuto Alvo)</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 italic">
          Estratégia dos Finais • Repetição de Dígitos por Hora
        </div>
      </div>
    </div>
  );
};
