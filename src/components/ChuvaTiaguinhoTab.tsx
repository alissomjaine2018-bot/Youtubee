import React from 'react';
import { RotateCw, Check, Zap, Flame, Brain, Shield, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { ChuvaMetrics } from '../types/radar';

interface ChuvaTiaguinhoTabProps {
  metrics: ChuvaMetrics;
  clockString: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ChuvaTiaguinhoTab: React.FC<ChuvaTiaguinhoTabProps> = ({
  metrics,
  clockString,
  onRefresh,
  isRefreshing,
}) => {
  const totalCriterios = metrics.criterios.length;
  const atingidosCount = metrics.criterios.filter((c) => c.atingido).length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-10">
      {/* Main Analysis Card */}
      <div className="bg-[#10141e] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-amber-500/20 shrink-0 bg-[#0d111a]">
              <img
                src="/assets/aistudio/Tiaguinho__o_terror_do_Aviator__2___1__5caaaf07.png"
                alt="TiaguinhoO Terror do Aviator"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wider text-amber-400 uppercase">
                CHUVA DO TIAGUINHOO
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>⏱ {clockString}</span>
                <span>•</span>
                <span>🧠 IA analisando 200 rodadas</span>
              </div>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Circular Donut Gauge */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#chuvaGradient)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - metrics.probabilidade / 100)}`}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="chuvaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#ff4500" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black tabular-nums tracking-tight text-amber-400">
                {metrics.probabilidade}%
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                PROBABILIDADE
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              {metrics.mercadoStatus}
            </span>
          </div>
        </div>

        {/* 6 Metric Progress Bars */}
        <div className="mt-6 space-y-3.5">
          {/* 1. Chance de Explosão */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>💥</span> Chance de Explosão
              </span>
              <span className="tabular-nums font-mono text-rose-400">{metrics.chanceExplosao}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700"
                style={{ width: `${metrics.chanceExplosao}%` }}
              />
            </div>
          </div>

          {/* 2. Força do Gráfico */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>📈</span> Força do Gráfico
              </span>
              <span className="tabular-nums font-mono text-amber-400">{metrics.forcaGrafico}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                style={{ width: `${metrics.forcaGrafico}%` }}
              />
            </div>
          </div>

          {/* 3. Pressão Acumulada */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>⚡</span> Pressão Acumulada
              </span>
              <span className="tabular-nums font-mono text-purple-400">{metrics.pressaoAcumulada}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-700"
                style={{ width: `${metrics.pressaoAcumulada}%` }}
              />
            </div>
          </div>

          {/* 4. Frequência de Rosas */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>🌸</span> Frequência de Rosas
              </span>
              <span className="tabular-nums font-mono text-pink-400">{metrics.frequenciaRosas}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-700"
                style={{ width: `${metrics.frequenciaRosas}%` }}
              />
            </div>
          </div>

          {/* 5. Score da IA */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>🧠</span> Score da IA
              </span>
              <span className="tabular-nums font-mono text-cyan-400">{metrics.scoreIA}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-700"
                style={{ width: `${metrics.scoreIA}%` }}
              />
            </div>
          </div>

          {/* 6. Nível de Confiança */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>🔒</span> Nível de Confiança
              </span>
              <span className="tabular-nums font-mono text-emerald-400">{metrics.nivelConfianca}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${metrics.nivelConfianca}%` }}
              />
            </div>
          </div>
        </div>

        {/* 6 Stat Cards Grid (Exactly as in screenshot) */}
        <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-3">
          {/* Card 1 */}
          <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DESDE ÚLTIMA
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums my-0.5">
              {metrics.desdeUltima}
            </div>
            <span className="text-[10px] text-slate-500">rodadas</span>
          </div>

          {/* Card 2 */}
          <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              GAP MÉDIO
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums my-0.5">
              {metrics.gapMedio}
            </div>
            <span className="text-[10px] text-slate-500">entre 10x+</span>
          </div>

          {/* Card 3 */}
          <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DENSIDADE
            </span>
            <div className="text-xl sm:text-2xl font-black text-pink-400 tabular-nums my-0.5">
              {metrics.densidade10x}%
            </div>
            <span className="text-[10px] text-slate-500">10x+ em 50</span>
          </div>

          {/* Card 4 */}
          <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DENSIDADE 50X
            </span>
            <div className="text-xl sm:text-2xl font-black text-pink-500 tabular-nums my-0.5">
              {metrics.densidade50x}%
            </div>
            <span className="text-[10px] text-slate-500">50x+ em 100</span>
          </div>

          {/* Card 5 */}
          <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              MAX RECENTE
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums my-0.5">
              {metrics.maxRecente}x
            </div>
            <span className="text-[10px] text-slate-500">últimas 50</span>
          </div>

          {/* Card 6 */}
          <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              CLUSTER
            </span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 tabular-nums my-0.5">
              {metrics.clusterProximidade}
            </div>
            <span className="text-[10px] text-slate-500">proximidade</span>
          </div>
        </div>

        {/* Section: Critérios para Chuva Rosa (Exact 4/7 visual match) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">🌧</span>
              <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-amber-400 uppercase">
                CRITÉRIOS PARA CHUVA ROSA
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {atingidosCount}/{totalCriterios}
            </span>
          </div>

          <div className="space-y-2">
            {metrics.criterios.map((c) => {
              if (c.destaqueRoxo) {
                // Purple highlighted row from screenshot: Proporção Roxas + Rosas > Azuis
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all ${
                      c.atingido
                        ? 'bg-purple-950/30 border-purple-500/60 shadow-md shadow-purple-500/10'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] shrink-0 ${
                        c.atingido
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'border-slate-700 bg-slate-800 text-transparent'
                      }`}
                    >
                      {c.atingido && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block shrink-0" />
                      <span className={c.atingido ? 'text-purple-200' : 'text-slate-400'}>
                        {c.label}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all ${
                    c.atingido
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] shrink-0 ${
                      c.atingido
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'border-slate-700 bg-slate-800 text-transparent'
                    }`}
                  >
                    {c.atingido && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">
                    {c.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
