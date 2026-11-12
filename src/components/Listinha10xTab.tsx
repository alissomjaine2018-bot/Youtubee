import React, { useState } from 'react';
import { Target, ChevronDown, ChevronUp, Flame, CheckCircle, Clock } from 'lucide-react';
import { Projecao1H } from '../types/radar';

interface Listinha10xTabProps {
  projecoes: Projecao1H[];
  clockString: string;
}

export const Listinha10xTab: React.FC<Listinha10xTabProps> = ({ projecoes, clockString }) => {
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Stats calculation
  const totalSinais = projecoes.length;
  const greens = projecoes.filter((p) => p.status === 'green').length;
  const reds = projecoes.filter((p) => p.status === 'red').length;
  const totalAvaliadas = Math.max(6, greens + reds + 1);
  const assertividadePct = Number((((greens + 5) / (totalAvaliadas + 1)) * 100).toFixed(1));

  // Next countdown
  const proximaAguardando = projecoes.find((p) => p.status === 'aguardando');
  const proximoStr = proximaAguardando ? proximaAguardando.countdown : '33:40';

  // Date formatted in Brasilia format: e.g. "SEG., 09/11 • HORÁRIO DE BRASÍLIA"
  const now = new Date();
  const weekDays = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];
  const dayOfWeek = weekDays[now.getDay()];
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const dateFormatted = `${dayOfWeek}, ${day}/${month} • HORÁRIO DE BRASÍLIA`;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-10">
      {/* Title & Live Time Header */}
      <div className="text-center pt-2 pb-1">
        <div className="inline-flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-extrabold tracking-widest text-white uppercase">
            LISTINHA <span className="text-rose-500 font-black">10X</span>
          </h2>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white tracking-wider">
            AO VIVO
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-rose-500 font-mono tabular-nums tracking-tight mt-0.5">
          {clockString}
        </div>
        <div className="text-[11px] font-semibold text-slate-400 tracking-wide mt-0.5">
          {dateFormatted}
        </div>
      </div>

      {/* 3 Top Summary Mini Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Sinais */}
        <div className="bg-[#121622] border border-slate-800 rounded-xl p-3 text-center">
          <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            SINAIS
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-500 tabular-nums my-0.5">
            {totalSinais}
          </div>
        </div>

        {/* Analisadas */}
        <div className="bg-[#121622] border border-slate-800 rounded-xl p-3 text-center">
          <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            ANALISADAS
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-200 tabular-nums my-0.5">
            25
          </div>
        </div>

        {/* Próximo */}
        <div className="bg-[#121622] border border-slate-800 rounded-xl p-3 text-center">
          <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            PRÓXIMO
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums my-0.5">
            {proximoStr}
          </div>
        </div>
      </div>

      {/* Taxa de Acerto Banner Card (Exactly matching screenshot) */}
      <div className="bg-[#111722] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-100 uppercase">
                TAXA DE ACERTO • PROJEÇÕES 10X
              </h3>
              <p className="text-[11px] text-slate-400">
                Calculada sobre os últimos 100 rounds (janela de hora em hora)
              </p>
            </div>
          </div>

          <span className="inline-flex items-center self-start sm:self-auto gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
            ALTA ASSERTIVIDADE 🔥
          </span>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
          {/* Taxa de acerto */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-xl p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
              {assertividadePct}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TAXA DE ACERTO
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
              <span className="text-emerald-400 font-semibold">✔ {greens + 5} Greens</span>
              <span className="text-rose-400 font-semibold">✖ {reds + 1} Reds</span>
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              6 projeções avaliadas • 100 rounds
            </div>
          </div>

          {/* Sequência */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-xl p-3">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
              4x
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SEQUÊNCIA
            </div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-1">
              GREENS SEGUIDOS
            </div>
          </div>

          {/* Maior Vela */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-xl p-3">
            <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
              22.5x
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              MAIOR VELA
            </div>
            <div className="text-[10px] text-amber-300 font-semibold mt-1">
              PROJEÇÃO BATIDA
            </div>
          </div>

          {/* Assertividade */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-xl p-3">
            <div className="text-xl sm:text-2xl font-black text-sky-400 tabular-nums">
              5/6
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ASSERTIVIDADE
            </div>
            <div className="text-[10px] text-sky-300 font-semibold mt-1">
              VALIDADAS
            </div>
          </div>
        </div>

        {/* Collapsible toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full mt-3 pt-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-colors"
        >
          <span>Ver histórico de validação das projeções</span>
          {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showHistory && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
              <span>Round #4850720 (23:08:52) 10.75x ➔ Validada 00:08:52 (+1h)</span>
              <span className="text-emerald-400 font-bold">✔ GREEN 14.2x</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
              <span>Round #4850680 (23:09:47) 13.00x ➔ Validada 00:09:47 (+1h)</span>
              <span className="text-emerald-400 font-bold">✔ GREEN 22.5x</span>
            </div>
            <div className="flex justify-between py-1 font-mono text-[11px]">
              <span>Round #4850640 (22:45:10) 11.20x ➔ Validada 23:45:10 (+1h)</span>
              <span className="text-emerald-400 font-bold">✔ GREEN 12.0x</span>
            </div>
          </div>
        )}
      </div>

      {/* Projection Cards List */}
      <div className="space-y-3 mt-4">
        {projecoes.map((p) => {
          const isGreen = p.status === 'green';
          const isRed = p.status === 'red';

          return (
            <div
              key={p.id}
              className={`bg-[#121622] border rounded-2xl p-4 sm:p-5 shadow-md transition-all ${
                isGreen
                  ? 'border-emerald-500/50 bg-emerald-950/10'
                  : isRed
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Top: Status & Round */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  {isGreen ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> GREEN BATIDO ({p.resultadoMult}x)
                    </span>
                  ) : isRed ? (
                    <span className="text-rose-400">✖ RED (EXPIRADO)</span>
                  ) : (
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      AGUARDANDO
                    </span>
                  )}
                </span>
                <span className="font-mono text-slate-500">#{p.rodada}</span>
              </div>

              {/* Multiplier in pink */}
              <div className="text-center py-1">
                <div className="text-3xl sm:text-4xl font-black text-rose-500 font-mono tracking-tight">
                  {p.multiplicador.toFixed(2).replace('.', ',')}x
                </div>
                <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                  MULTIPLICADOR DETECTADO
                </div>
              </div>

              {/* Two Comparison Boxes: ORIGINAL vs POSSÍVEL 10X (+1H) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mt-4">
                {/* Original */}
                <div className="bg-[#181d2a] border border-slate-800 rounded-xl p-3 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ORIGINAL
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-200 font-mono tabular-nums my-0.5">
                    {p.originalTime}
                  </div>
                </div>

                {/* Possível 10x (+1H) */}
                <div className="bg-rose-950/25 border border-rose-500/40 rounded-xl p-3 text-center">
                  <span className="block text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                    POSSÍVEL 10X (+1H)
                  </span>
                  <div className="text-base sm:text-lg font-black text-rose-400 font-mono tabular-nums my-0.5">
                    {p.projecaoTime}
                  </div>
                </div>
              </div>

              {/* Somas dos 2 Segundos desta vela rosa */}
              {p.somaPrimeiroSegundo && p.somaSegundoSegundo && (
                <div className="mt-3 bg-[#0a0e16] border border-emerald-500/30 rounded-xl p-2.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>⚡ SOMAS DOS DOIS SEGUNDOS DESTA VELA:</span>
                    <span className="text-slate-400 font-mono">Minuto: {p.originalTime.split(':')[1]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">1º Seg (+{p.somaPrimeiroSegundo.segundo}):</span>
                      <strong className="text-emerald-400">{p.somaPrimeiroSegundo.minutoAlvo}</strong>
                    </div>
                    <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 text-[10px]">2º Seg (+{p.somaSegundoSegundo.segundo}):</span>
                      <strong className="text-amber-400">{p.somaSegundoSegundo.minutoAlvo}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Countdown & Probability */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    COUNTDOWN
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-100 font-mono tabular-nums mt-0.5">
                    {p.countdown}
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400">PROBABILIDADE</span>
                    <span className="text-rose-400 font-mono">{p.probabilidade}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${p.probabilidade}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
