import React from 'react';
import {
  RotateCw,
  Flame,
  Thermometer,
  AlertTriangle,
  Crown,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Maxima50xMetrics, Vela } from '../types/radar';
import { calculateMaxima50xDetalhado } from '../utils/aviatorMath';

interface Maxima50xTabProps {
  metrics: Maxima50xMetrics;
  velas: Vela[];
  clockString: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Maxima50xTab: React.FC<Maxima50xTabProps> = ({
  metrics,
  velas,
  clockString,
  onRefresh,
  isRefreshing,
}) => {
  const detalhado = React.useMemo(() => calculateMaxima50xDetalhado(velas), [velas]);

  // Filtrar SOMENTE velas rosas (mult >= 10.0x), em ordem de chegada (mais recentes primeiro)
  const velasRosas = React.useMemo(() => {
    return velas.filter((v) => v.mult >= 10.0);
  }, [velas]);

  const totalRosas50x = React.useMemo(() => {
    return velasRosas.filter((v) => v.mult >= 50.0 && v.mult < 100.0).length;
  }, [velasRosas]);

  const totalRosas100x = React.useMemo(() => {
    return velasRosas.filter((v) => v.mult >= 100.0 && v.mult < 1000.0).length;
  }, [velasRosas]);

  const totalRosas1000x = React.useMemo(() => {
    return velasRosas.filter((v) => v.mult >= 1000.0).length;
  }, [velasRosas]);

  const getFaixaBadge = (faixa: Maxima50xMetrics['faixa']) => {
    switch (faixa) {
      case 'Explodindo':
        return {
          icon: '💥',
          text: 'EXPLODINDO',
          color: 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-rose-500/30',
        };
      case 'Quente':
        return {
          icon: '🌡',
          text: 'QUENTE',
          color: 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-orange-500/30',
        };
      case 'Morno':
        return {
          icon: '🔥',
          text: 'MORNO',
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/30',
        };
      case 'Frio':
      default:
        return {
          icon: '❄️',
          text: 'FRIO',
          color: 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-sky-500/30',
        };
    }
  };

  const badge = getFaixaBadge(detalhado.previsaoProxima50x.status || metrics.faixa);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-10">
      {/* ── HEADER CARD RENOMEADO PARA TIAGUINHOO MÁXIMA DE 50X ── */}
      <div className="bg-[#10141e] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-amber-500/20 shrink-0 bg-[#0d111a]">
              <img
                src="/assets/aistudio/Tiaguinho__o_terror_do_Aviator__2___1__5caaaf07.png"
                alt="TiaguinhoO Terror do Aviator"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                  TIAGUINHOO MÁXIMA DE 50X
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  MONITORAMENTO 50X+ & ACÚMULO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Vela de referência destacada • Contagem progressiva de velas acumuladas abaixo de 50x e tempo decorrido
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 tabular-nums">
              ● {clockString} BSB
            </span>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>
      </div>



      {/* ── PAINEL ESTATÍSTICO DE 4 CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Velas Acumuladas */}
        <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            VELAS ACUMULADAS
          </span>
          <div className="text-xl sm:text-2xl font-black text-sky-400 tabular-nums my-0.5">
            {detalhado.totalVelasSem50x}
          </div>
          <span className="text-[10px] text-slate-500">abaixo de 50x</span>
        </div>

        {/* Média entre 50x */}
        <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            MÉDIA DE VELAS
          </span>
          <div className="text-xl sm:text-2xl font-black text-teal-400 tabular-nums my-0.5">
            {detalhado.mediaVelasEntre50x}
          </div>
          <span className="text-[10px] text-slate-500">rodadas entre cada</span>
        </div>

        {/* Média de Tempo */}
        <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            TEMPO MÉDIO
          </span>
          <div className="text-xl sm:text-2xl font-black text-pink-400 tabular-nums my-0.5">
            {detalhado.mediaMinutosEntre50x} min
          </div>
          <span className="text-[10px] text-slate-500">para sair 50x+</span>
        </div>

        {/* Max Recente */}
        <div className="bg-[#141824] border border-slate-800 rounded-xl p-3 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            MÁXIMA RECENTE
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums my-0.5">
            {metrics.maxRecente.toFixed(1)}x
          </div>
          <span className="text-[10px] text-slate-500">no gráfico</span>
        </div>
      </div>

      {/* ── TERMÔMETRO DE PROBABILIDADE ── */}
      <div className="bg-[#121622] border border-slate-800/80 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          <Thermometer className="w-4 h-4 text-amber-400" />
          TERMÔMETRO DE EXPLOSÃO 50X+
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-20 h-56 sm:h-64 flex justify-center items-end">
            <div className="relative w-10 h-full bg-[#181d2a] rounded-t-full rounded-b-full border border-slate-700/80 overflow-hidden flex flex-col justify-end p-1">
              <div className="absolute inset-y-2 right-1 flex flex-col justify-between text-[9px] font-mono font-bold text-slate-500 select-none pointer-events-none">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
              <div
                className="w-full rounded-b-full transition-all duration-1000 ease-out bg-gradient-to-t from-amber-500 via-rose-500 to-pink-500 relative shadow-lg shadow-pink-500/50"
                style={{ height: `${Math.max(12, detalhado.previsaoProxima50x.percentualProgresso)}%` }}
              >
                <div className="w-full h-2 bg-white/40 rounded-t-full" />
              </div>
            </div>

            <div className="absolute -bottom-3 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-600 to-pink-500 p-1 flex items-center justify-center shadow-xl shadow-rose-600/40 border-2 border-slate-900">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-400 to-rose-600 flex items-center justify-center">
                <Flame className="w-8 h-8 text-white fill-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="text-4xl sm:text-5xl font-black text-slate-100 font-mono tabular-nums tracking-tight">
              {detalhado.previsaoProxima50x.percentualProgresso}%
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border shadow-sm ${badge.color}`}>
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {detalhado.totalVelasSem50x} velas acumuladas abaixo de 50x desde a última referência
            </p>
          </div>
        </div>
      </div>

      {/* ── GRÁFICO SOMENTE COM VELAS ROSAS (&ge;10X) COM DESTAQUE EM 50X+ ── */}
      <div className="bg-[#10141e] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  GRÁFICO DE VELAS ROSAS (&ge;10X) • DESTAQUE 50X+
                </h3>
                <span className="px-2 py-0.2 rounded text-[9px] font-black bg-pink-500/20 text-pink-300 border border-pink-500/40 uppercase">
                  AO VIVO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Somente velas rosas (&ge;10x) • Atualizando uma por uma ao vivo • Destaque 👑 100X+ e Destaque Diferenciado 💎 1000X+
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap shrink-0 self-start sm:self-center">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-pink-400 font-bold">
              {velasRosas.length} Rosas (&ge;10x)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-black flex items-center gap-1">
              <span>👑</span>
              <span>{totalRosas50x} Velas &ge;50x</span>
            </span>
            {totalRosas100x > 0 && (
              <span className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/50 text-[10px] font-mono text-purple-300 font-black flex items-center gap-1 shadow-sm">
                <span>👑</span>
                <span>{totalRosas100x} &ge;100x</span>
              </span>
            )}
            {totalRosas1000x > 0 && (
              <span className="px-2 py-0.5 rounded bg-yellow-500/25 border border-yellow-400/60 text-[10px] font-mono text-yellow-300 font-black flex items-center gap-1 animate-pulse shadow-md shadow-yellow-500/20">
                <span>💎</span>
                <span>{totalRosas1000x} &ge;1000x Mítica</span>
              </span>
            )}
          </div>
        </div>

        {velasRosas.length === 0 ? (
          <div className="bg-[#141824] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            Aguardando novas velas rosas (&ge;10x) no gráfico... Conforme forem saindo, atualizarão uma por uma aqui!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {velasRosas.slice(0, 32).map((v, i) => {
                const is1000x = v.mult >= 1000.0;
                const is100x = v.mult >= 100.0 && v.mult < 1000.0;
                const is50x = v.mult >= 50.0 && v.mult < 100.0;
                const isNewest = i === 0;

                return (
                  <div
                    key={v.id}
                    className={`relative p-2 rounded-xl text-center font-mono transition-all duration-300 hover:scale-105 select-none ${
                      is1000x
                        ? 'border-2 border-yellow-300 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 animate-pulse shadow-[0_0_22px_rgba(250,204,21,0.85)] ring-2 ring-yellow-400'
                        : is100x
                        ? 'border-2 border-amber-400 bg-gradient-to-br from-[#4a044e] via-[#2e1065] to-[#701a75] shadow-xl shadow-amber-500/40 ring-2 ring-amber-400/60'
                        : is50x
                        ? 'border-2 border-amber-500/80 bg-gradient-to-b from-[#381e05] via-[#221203] to-[#140b02] shadow-xl shadow-amber-500/30 ring-1 ring-amber-400/40'
                        : 'border border-pink-500/40 bg-gradient-to-b from-pink-950/40 via-[#180916] to-[#0e040c] shadow-md shadow-pink-950/40 hover:border-pink-400/80'
                    }`}
                  >
                    {/* Badge 1000X+ em destaque diferenciado */}
                    {is1000x && (
                      <div className="absolute -top-2.5 right-1 px-1.5 py-0.2 bg-yellow-300 text-slate-950 font-black text-[8px] rounded-full uppercase shadow-lg flex items-center gap-0.5 animate-bounce">
                        💎 1000X+
                      </div>
                    )}

                    {/* Badge 100X+ em destaque */}
                    {is100x && (
                      <div className="absolute -top-2 right-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-[8px] rounded-full uppercase shadow-md flex items-center gap-0.5 animate-pulse">
                        <Crown className="w-2.5 h-2.5 fill-slate-950" />
                        <span>100X+</span>
                      </div>
                    )}

                    {/* Badge 50X+ */}
                    {is50x && (
                      <div className="absolute -top-2 right-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[8px] rounded-full uppercase shadow-sm">
                        50X+
                      </div>
                    )}

                    {/* Tag de última vela rosa se for a mais recente */}
                    {isNewest && !is50x && !is100x && !is1000x && (
                      <div className="absolute -top-1.5 right-1 px-1 py-0.2 bg-pink-500 text-white font-black text-[7px] rounded uppercase shadow-sm">
                        ÚLTIMA
                      </div>
                    )}

                    {/* Número cronológico da vela rosa */}
                    <div className="flex items-center justify-between text-[8px] mb-0.5">
                      <span className={is1000x ? 'text-yellow-200 font-black' : is100x || is50x ? 'text-amber-400/80 font-bold' : 'text-slate-500'}>
                        #{velasRosas.length - i}
                      </span>
                      {isNewest && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>

                    {/* Multiplicador da Vela */}
                    <div
                      className={`text-xs sm:text-sm font-black tabular-nums tracking-tight my-0.5 ${
                        is1000x
                          ? 'text-yellow-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-black text-sm sm:text-base'
                          : is100x
                          ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] font-black'
                          : is50x
                          ? 'text-amber-400 font-extrabold'
                          : 'text-pink-400 font-extrabold'
                      }`}
                    >
                      {v.mult.toFixed(2)}x
                    </div>

                    {/* Horário */}
                    <div className={`text-[9px] font-mono ${is1000x ? 'text-yellow-200 font-bold' : is100x || is50x ? 'text-amber-200/80' : 'text-slate-400'}`}>
                      {v.timeFormatted.slice(0, 5)}
                    </div>
                  </div>
                );
              })}
            </div>

            {velasRosas.length > 32 && (
              <div className="mt-3 text-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                + {velasRosas.length - 32} outras velas rosas (&ge;10x) acumuladas no histórico
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
