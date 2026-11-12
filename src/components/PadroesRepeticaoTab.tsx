import React, { useState } from 'react';
import {
  Repeat,
  Trophy,
  Flame,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Crown,
} from 'lucide-react';
import {
  PadraoRepeticao,
  EstatisticaRepeticao,
  Vela,
  BroadcastServerKey,
  BroadcastServerInfo,
} from '../types/radar';

interface PadroesRepeticaoTabProps {
  padroes: PadraoRepeticao[];
  ranking: EstatisticaRepeticao[];
  casaAtualEmAndamento: number;
  rodadasSemRosa: number;
  ultimaRosa?: Vela;
  totalRosas: number;
  activeServer: BroadcastServerKey;
  servers: BroadcastServerInfo[];
  onSelectServer: (server: BroadcastServerKey) => void;
  clockString: string;
}

export const PadroesRepeticaoTab: React.FC<PadroesRepeticaoTabProps> = ({
  padroes,
  ranking,
  casaAtualEmAndamento,
  rodadasSemRosa,
  ultimaRosa,
  totalRosas,
  activeServer,
  servers,
  onSelectServer,
  clockString,
}) => {
  const [selectedFilterCasa, setSelectedFilterCasa] = useState<string>('todas');

  const currentServerInfo =
    servers.find((s) => s.key === activeServer) || {
      key: activeServer,
      name: 'Aviator 1',
      badge: 'BROADCAST 1',
    };

  const filteredPadroes = padroes.filter((p) => {
    if (selectedFilterCasa !== 'todas') {
      const cNum = parseInt(selectedFilterCasa, 10);
      if (p.casa !== cNum) return false;
    }
    return true;
  });

  const top1 = ranking[0];
  const isTopCasaCurrent = top1 && top1.casa === casaAtualEmAndamento;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-10">
      {/* ── HEADER CARD COM IDENTIDADE DO TIAGUINHO ── */}
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
                  PADRÕES DE REPETIÇÃO
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-950/90 text-purple-200 border border-purple-400/50 uppercase">
                  CASAS 1ª A 10ª+ • GATILHO REPETIÇÃO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Monitora e confirma repetições de velas rosas (&ge;10x) da 1ª à 10ª casa com ranking ao vivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 tabular-nums">
              ● {clockString} BSB
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black font-mono shadow-sm">
              {padroes.length} CONFIRMAÇÕES
            </span>
          </div>
        </div>

        {/* ── SELETOR DE GRÁFICO (ISOLADO POR SERVIDOR) ── */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Selecione o Gráfico:
            </span>
            <span className="text-[11px] font-mono text-amber-400 font-bold hidden sm:inline">
              {currentServerInfo.name} ({currentServerInfo.badge}) Ativo
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#090d15] p-1.5 rounded-xl border border-slate-800">
            {servers.map((s) => (
              <button
                key={s.key}
                onClick={() => onSelectServer(s.key)}
                className={`py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeServer === s.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeServer === s.key ? 'bg-white' : 'bg-purple-400'}`} />
                <span>{s.name.toUpperCase()}</span>
                <span className="text-[10px] opacity-75 font-mono">({s.badge.replace('BROADCAST ', 'B')})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CARD DE MONITORAMENTO DA CASA ATUAL EM ANDAMENTO ── */}
      <div
        className={`rounded-2xl border-2 p-4 sm:p-5 shadow-xl transition-all relative overflow-hidden ${
          isTopCasaCurrent
            ? 'border-amber-400/90 bg-gradient-to-r from-[#281806] via-[#1a0f02] to-[#221303] ring-2 ring-amber-400/40 shadow-amber-950/60'
            : 'border-purple-500/60 bg-gradient-to-r from-[#1b0c26] via-[#100717] to-[#180922]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider animate-pulse">
                AO VIVO • CICLO ATUAL
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {rodadasSemRosa} rodadas decorridas desde a última rosa
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tabular-nums">
                {casaAtualEmAndamento}ª CASA
              </div>
              <div className="border-l border-slate-700 pl-3 text-xs">
                {isTopCasaCurrent ? (
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 animate-bounce">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ATENÇÃO: Estamos na casa mais pagadora do ranking!
                  </span>
                ) : (
                  <span className="text-slate-300">
                    Aguardando confirmação de repetição nesta ou nas próximas casas
                  </span>
                )}
                {ultimaRosa && (
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Última rosa: <strong className="text-pink-400">{ultimaRosa.mult.toFixed(2)}x</strong> às{' '}
                    <strong className="text-white">{ultimaRosa.timeFormatted}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-purple-500/40 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0 self-start md:self-center">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Casa Campeã no Gráfico
              </span>
              <div className="text-sm font-black text-white font-mono">
                {top1 ? `${top1.casaLabel} (${top1.totalOcorrencias}x • ${top1.percentual}%)` : 'Analisando...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RANKING EM ORDEM DO MAIOR PARA O MENOR (EXATA ORDEM PEDIDA PELO USUÁRIO) ── */}
      <div className="bg-[#10141e] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              RANKING DE REPETIÇÃO: QUAL SAIU MAIS (DO MAIOR PARA O MENOR)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">
            Casas 1ª a 10ª ordenadas por frequência
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ranking.map((item, idx) => {
            const isTop1 = idx === 0;
            const isTop2 = idx === 1;
            const isTop3 = idx === 2;

            return (
              <div
                key={item.casa}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isTop1
                    ? 'bg-gradient-to-r from-amber-950/60 to-[#1d1206] border-amber-500/80 shadow-md shadow-amber-500/10'
                    : isTop2
                    ? 'bg-gradient-to-r from-slate-900 to-[#121620] border-slate-600/80'
                    : isTop3
                    ? 'bg-gradient-to-r from-[#1f150d] to-[#120e09] border-amber-800/80'
                    : 'bg-[#0d121c] border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                      isTop1
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : isTop2
                        ? 'bg-slate-300 text-slate-950'
                        : isTop3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `${idx + 1}º`}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white font-mono">
                        {item.casaLabel}
                      </span>
                      {item.casa === casaAtualEmAndamento && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500 text-slate-950 animate-bounce">
                          CASA ATUAL
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Posição #{item.posicaoRanking} no ranking de repetições
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-400 tabular-nums">
                    {item.totalOcorrencias}x
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">
                    {item.percentual}% do total
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FILTROS DE CASA E FEED HISTÓRICO DE REPETIÇÕES CONFIRMADAS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] text-slate-400 uppercase font-black mr-1">Filtrar Casa:</span>
          {['todas', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedFilterCasa(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                selectedFilterCasa === c
                  ? 'bg-purple-600 text-white font-black shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c === 'todas' ? 'Todas Casas' : `${c}ª Casa`}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Exibindo <strong className="text-purple-400">{filteredPadroes.length}</strong> repetições confirmadas
        </span>
      </div>

      {/* ── LISTA DE REPETIÇÕES CONFIRMADAS ── */}
      <div className="space-y-3">
        {filteredPadroes.length === 0 ? (
          <div className="bg-[#10141e] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            Nenhum padrão de repetição confirmado encontrado para a casa selecionada.
          </div>
        ) : (
          filteredPadroes.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border-2 border-purple-500/70 bg-gradient-to-r from-[#1c0b26] via-[#100617] to-[#180920] p-4 sm:p-5 shadow-lg shadow-purple-950/40 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white uppercase shadow-sm">
                      {p.casaLabel}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {p.casa === 1 ? (
                        <span>Velas seguidas / coladas (0 velas entre elas)</span>
                      ) : (
                        <span>
                          Passaram <strong className="text-white">{p.casa - 1} {p.casa - 1 === 1 ? 'vela' : 'velas'}</strong> (veio na <strong className="text-purple-300 font-bold">{p.casa}ª casa</strong>)
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      • {p.tempoMinutos} min decorridos
                    </span>
                  </div>

                  {/* Fluxo visual: Rosa Origem -> Rosa Confirmada */}
                  <div className="flex items-center gap-2 pt-2 text-sm font-mono flex-wrap">
                    <div className="flex items-center gap-1.5 bg-black/50 border border-slate-800 px-3 py-1.5 rounded-xl">
                      <span className="text-xs text-slate-400">Rosa 1:</span>
                      <strong className="text-pink-400 font-black">{p.velaOrigem.mult.toFixed(2)}x</strong>
                      <span className="text-[10px] text-slate-500">({p.velaOrigem.time})</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />

                    <div className="flex items-center gap-1.5 bg-pink-950/60 border border-pink-500/60 px-3 py-1.5 rounded-xl shadow-inner">
                      <span className="text-xs text-pink-300 font-bold">Rosa Confirmada:</span>
                      <strong className="text-emerald-400 font-black">{p.velaConfirmada.mult.toFixed(2)}x</strong>
                      <span className="text-[10px] text-emerald-300">({p.velaConfirmada.time})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span className="px-3 py-1.5 rounded-full bg-purple-900/80 border border-purple-400/50 text-purple-200 text-xs font-black font-mono">
                    Confirmado às {p.horarioConfirmado}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
