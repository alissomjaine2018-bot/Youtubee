import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Crown,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
  ShieldCheck,
  Target,
  Sparkle,
  XCircle,
} from 'lucide-react';
import {
  VelaRosaConfirmada,
  BroadcastServerKey,
  BroadcastServerInfo,
  AnaliseRosasConsecutivas,
  MinutagemVelaEspecial,
} from '../types/radar';

interface VelasRosasConfirmadasTabProps {
  rosasConfirmadas: VelaRosaConfirmada[];
  estatisticasGatilhos: Array<{ nome: string; totalAcertos: number; percentual: number }>;
  totalRosasAnalisadas: number;
  analiseRosasConsecutivas?: AnaliseRosasConsecutivas;
  minutagensEspeciais?: MinutagemVelaEspecial[];
  activeServer: BroadcastServerKey;
  servers: BroadcastServerInfo[];
  onSelectServer: (server: BroadcastServerKey) => void;
  clockString: string;
}

type MinutagemFilter = 'todas' | 'ativas' | 'rosa' | 'roxa' | 'azul';

export const VelasRosasConfirmadasTab: React.FC<VelasRosasConfirmadasTabProps> = ({
  rosasConfirmadas,
  estatisticasGatilhos,
  totalRosasAnalisadas,
  analiseRosasConsecutivas,
  minutagensEspeciais = [],
  activeServer,
  servers,
  onSelectServer,
  clockString,
}) => {
  const [minutagemFilter, setMinutagemFilter] = useState<MinutagemFilter>('todas');
  const [selectedEstrategia, setSelectedEstrategia] = useState<string>('todas');
  const [expandedMinutagemId, setExpandedMinutagemId] = useState<string | null>(null);

  const currentServerInfo = useMemo(() => {
    return (
      servers.find((s) => s.key === activeServer) || {
        key: activeServer,
        name: 'Aviator 1',
        badge: 'BROADCAST 1',
      }
    );
  }, [servers, activeServer]);

  // Current parsed hour and minute
  const [currentHour, currentMin] = useMemo(() => {
    const parts = clockString.split(':').map((n) => parseInt(n, 10));
    return [parts[0] || 0, parts[1] || 0];
  }, [clockString]);

  // Filter and order Minutagens
  const displayedMinutagens = useMemo(() => {
    let list = minutagensEspeciais.map((m) => {
      let diffMinutes = (m.hora - currentHour) * 60 + (m.minuto - currentMin);
      if (diffMinutes < -720) diffMinutes += 1440;
      if (diffMinutes > 720) diffMinutes -= 1440;

      const isCurrentMinute = diffMinutes === 0;
      const isPast = diffMinutes < 0;
      const isActive = diffMinutes >= 0 && m.status !== 'confirmada';

      return {
        ...m,
        diffMinutes,
        isCurrentMinute,
        isPast,
        isActive,
      };
    });

    // Strategy filter
    if (selectedEstrategia !== 'todas') {
      list = list.filter((m) =>
        m.estrategiasConfirmadas.some((e) => e.nome === selectedEstrategia)
      );
    }

    // Status filter
    if (minutagemFilter === 'ativas') {
      list = list.filter((m) => m.isActive);
    } else if (minutagemFilter === 'rosa') {
      list = list.filter((m) => m.resultado?.tipo === 'rosa' || m.status === 'confirmada');
    } else if (minutagemFilter === 'roxa') {
      list = list.filter((m) => m.resultado?.tipo === 'roxa');
    } else if (minutagemFilter === 'azul') {
      list = list.filter((m) => m.resultado?.tipo === 'azul');
    }

    // Ordenação exigida pelo usuário:
    // Horários ativos/próximos/saindo agora ficam EM CIMA no topo.
    // Horários que já passaram vão PARA BAIXO (as que pagaram rosa, pagou roxa, pagou azul).
    return [...list].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      if (a.isActive && b.isActive) {
        return a.diffMinutes - b.diffMinutes;
      }

      // Past: recent first
      const minA = a.hora * 60 + a.minuto;
      const minB = b.hora * 60 + b.minuto;
      return minB - minA;
    });
  }, [minutagensEspeciais, minutagemFilter, selectedEstrategia, currentHour, currentMin]);

  const ativasCount = minutagensEspeciais.filter((m) => {
    let diff = (m.hora - currentHour) * 60 + (m.minuto - currentMin);
    if (diff < -720) diff += 1440;
    if (diff > 720) diff -= 1440;
    return diff >= 0 && m.status !== 'confirmada';
  }).length;

  const pagasRosaCount = minutagensEspeciais.filter(
    (m) => m.resultado?.tipo === 'rosa' || m.status === 'confirmada'
  ).length;

  const pagasRoxaCount = minutagensEspeciais.filter((m) => m.resultado?.tipo === 'roxa').length;
  const pagasAzulCount = minutagensEspeciais.filter((m) => m.resultado?.tipo === 'azul').length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-10">
      {/* ── HEADER CARD COM IDENTIDADE DO TIAGUINHO ── */}
      <div className="bg-[#10141e] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-pink-500/60 shadow-lg shadow-pink-500/20 shrink-0 bg-[#0d111a]">
              <img
                src="/assets/aistudio/Tiaguinho__o_terror_do_Aviator__2___1__5caaaf07.png"
                alt="TiaguinhoO Terror do Aviator"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                  VELAS ESPECIAIS PUXA ROSA
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-pink-950/90 text-pink-300 border border-pink-500/40 uppercase">
                  11 ESTRATÉGIAS DA PLANILHA • CASAS 1ª A 5ª
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Minutagens de confirmação onde pode sair uma vela rosa baseadas exclusivamente nas 11 estratégias oficiais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 tabular-nums">
              ● {clockString} BSB
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-black font-mono shadow-sm">
              {displayedMinutagens.length} MINUTAGENS
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
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 ring-1 ring-pink-400'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeServer === s.key ? 'bg-white' : 'bg-pink-400'}`} />
                <span>{s.name.toUpperCase()}</span>
                <span className="text-[10px] opacity-75 font-mono">({s.badge.replace('BROADCAST ', 'B')})</span>
              </button>
            ))}
          </div>
        </div>
      </div>




          {/* Matriz das 11 Estratégias Oficiais da Planilha (Segunda Imagem) */}
          <div className="bg-[#10141e] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-pink-400" />
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  11 ESTRATÉGIAS OFICIAIS DA PLANILHA (SEGUNDA IMAGEM)
                </h3>
              </div>
              <span className="text-[10px] text-pink-300 font-mono hidden xs:inline">
                Casas 1ª a 5ª • Clique para filtrar minutagens
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {estatisticasGatilhos.map((gat, idx) => {
                const isSelected = selectedEstrategia === gat.nome;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedEstrategia(isSelected ? 'todas' : gat.nome)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-pink-950/60 border-pink-400 text-white ring-1 ring-pink-400'
                        : 'bg-[#0d121c] border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="truncate pr-1 text-slate-200">{gat.nome}</span>
                      <span className="text-pink-400 font-mono shrink-0">{gat.totalAcertos}x</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Assertividade:</span>
                      <span className="font-mono text-emerald-400 font-bold">{gat.percentual}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, gat.percentual))}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedEstrategia !== 'todas' && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-pink-300 font-medium">
                  Filtrando minutagens pela estratégia: <strong className="text-white">{selectedEstrategia}</strong>
                </span>
                <button
                  onClick={() => setSelectedEstrategia('todas')}
                  className="text-[11px] text-slate-400 hover:text-white underline font-mono"
                >
                  Limpar filtro de estratégia
                </button>
              </div>
            )}
          </div>

          {/* ── FILTROS DAS MINUTAGENS: TODAS, ATIVAS, PAGOU ROSA, PAGOU ROXA, PAGOU AZUL ── */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setMinutagemFilter('todas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  minutagemFilter === 'todas'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                    : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Todas ({minutagensEspeciais.length})
              </button>

              <button
                onClick={() => setMinutagemFilter('ativas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  minutagemFilter === 'ativas'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 ring-1 ring-pink-400'
                    : 'bg-pink-950/40 border border-pink-500/40 text-pink-300 hover:text-white hover:bg-pink-900/50'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                <span>Alvo 10X ({ativasCount})</span>
              </button>

              <button
                onClick={() => setMinutagemFilter('rosa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  minutagemFilter === 'rosa'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                    : 'bg-slate-900/70 border border-slate-800 text-pink-400 hover:text-pink-200'
                }`}
              >
                <span>🌸</span>
                <span>Pagas Rosa ({pagasRosaCount})</span>
              </button>

              <button
                onClick={() => setMinutagemFilter('roxa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  minutagemFilter === 'roxa'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                    : 'bg-slate-900/70 border border-slate-800 text-purple-400 hover:text-purple-200'
                }`}
              >
                <span>🟣</span>
                <span>Pagou Roxa ({pagasRoxaCount})</span>
              </button>

              <button
                onClick={() => setMinutagemFilter('azul')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  minutagemFilter === 'azul'
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'bg-slate-900/70 border border-slate-800 text-sky-400 hover:text-sky-200'
                }`}
              >
                <span>🔵</span>
                <span>Pagou Azul ({pagasAzulCount})</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-pink-300 bg-pink-950/40 px-2.5 py-1 rounded-lg border border-pink-500/30">
              <Clock className="w-3 h-3 text-pink-400" />
              <span>Alvos 10X no Topo • Passadas para Baixo</span>
            </div>
          </div>

          {/* ── FEED DE MINUTAGENS DE CONFIRMAÇÃO (ONDE PODE SAIR VELA ROSA) ── */}
          <div className="space-y-3">
            {displayedMinutagens.length === 0 ? (
              <div className="bg-[#10141e] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                Nenhuma minutagem de vela rosa encontrada para os filtros selecionados.
              </div>
            ) : (
              displayedMinutagens.map((item, idx) => {
                const isExpanded = expandedMinutagemId === item.id;
                const isPaidRosa = item.resultado?.tipo === 'rosa' || item.status === 'confirmada';
                const isPaidRoxa = item.resultado?.tipo === 'roxa';
                const isPaidAzul = item.resultado?.tipo === 'azul';

                // Separador visual entre horários ativos/próximos e os que já passaram
                const showPastDivider =
                  minutagemFilter === 'todas' &&
                  !item.isActive &&
                  (idx === 0 || displayedMinutagens[idx - 1].isActive);

                return (
                  <React.Fragment key={item.id}>
                    {showPastDivider && (
                      <div className="pt-3 pb-1 flex items-center gap-2 text-slate-400 font-mono text-xs">
                        <div className="h-px bg-slate-800 flex-1" />
                        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 font-bold">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Horários que já passaram ({displayedMinutagens.filter((x) => !x.isActive).length})
                        </span>
                        <div className="h-px bg-slate-800 flex-1" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl border transition-all shadow-md relative overflow-hidden ${
                        isPaidRosa
                          ? 'border-pink-500/80 bg-gradient-to-r from-[#200c28] via-[#14081c] to-[#1c0a24] shadow-pink-950/40'
                          : isPaidRoxa
                          ? 'border-purple-500/60 bg-[#160d22]/90 shadow-purple-500/10'
                          : isPaidAzul
                          ? 'border-sky-500/35 bg-[#09121a]/90'
                          : item.totalConfirmacoes >= 3
                          ? 'border-pink-500/80 bg-[#120a14]/90 shadow-pink-500/20 ring-1 ring-pink-500/40'
                          : item.totalConfirmacoes >= 2
                          ? 'border-emerald-400/80 bg-[#081512]/90 hover:border-emerald-300 shadow-emerald-500/10'
                          : 'border-slate-800 bg-[#0a0f16]/90 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Header Card da Minutagem */}
                      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tabular-nums tracking-tight">
                              {item.horarioStr}
                            </span>

                            {item.isCurrentMinute && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-500 text-slate-950 animate-bounce">
                                ⚡ NO MINUTO
                              </span>
                            )}

                            {item.isActive && !item.isCurrentMinute && (
                              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-900/80 text-amber-300 border border-purple-500/50">
                                ⏱️ Faltam {item.diffMinutes} min
                              </span>
                            )}

                            {item.totalConfirmacoes >= 3 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-pink-950 text-pink-300 border border-pink-500/40 uppercase animate-pulse">
                                CHANCE MÁXIMA
                              </span>
                            )}

                            {/* Status de Pagamento Conforme Solicitação Exata */}
                            {isPaidRosa && (
                              <span className="px-2.5 py-0.5 rounded text-xs font-black font-mono bg-pink-500 text-white shadow-sm flex items-center gap-1">
                                <span>🌸</span>
                                <span>{item.resultado?.texto || `PAGO ROSA ${item.resultado?.mult?.toFixed(2)}x`}</span>
                              </span>
                            )}

                            {isPaidRoxa && (
                              <span className="px-2.5 py-0.5 rounded text-xs font-black font-mono bg-purple-600 text-white shadow-sm flex items-center gap-1">
                                <span>🟣</span>
                                <span>{item.resultado?.texto || `PAGOU ROXA ${item.resultado?.mult?.toFixed(2)}x`}</span>
                              </span>
                            )}

                            {isPaidAzul && (
                              <span className="px-2.5 py-0.5 rounded text-xs font-black font-mono bg-sky-950 border border-sky-500/60 text-sky-300 shadow-sm flex items-center gap-1">
                                <span>🔵</span>
                                <span>{item.resultado?.texto || `PAGOU AZUL ${item.resultado?.mult?.toFixed(2)}x`}</span>
                              </span>
                            )}
                          </div>

                          {/* Subtítulo: Confirmações pelas Estratégias */}
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <div
                              className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                                item.totalConfirmacoes >= 3
                                  ? 'text-pink-300'
                                  : item.totalConfirmacoes >= 2
                                  ? 'text-emerald-300'
                                  : 'text-slate-300'
                              }`}
                            >
                              <Flame
                                className={`w-4 h-4 ${
                                  item.totalConfirmacoes >= 2
                                    ? 'text-amber-400 fill-amber-400 animate-pulse'
                                    : 'text-slate-400'
                                }`}
                              />
                              <span>
                                {item.totalConfirmacoes >= 3
                                  ? 'CHANCE MÁXIMA DE ROSA'
                                  : item.totalConfirmacoes >= 2
                                  ? 'CHANCE FORTE DE ROSA'
                                  : 'CHANCE DE ROSA'}
                                {' • '}
                                <strong className="text-white underline decoration-amber-400 underline-offset-2">
                                  {item.totalConfirmacoes}{' '}
                                  {item.totalConfirmacoes === 1 ? 'CONFIRMAÇÃO' : 'CONFIRMAÇÕES'} (ATÉ 5ª CASA)
                                </strong>
                              </span>
                            </div>

                            <span className="text-[10px] font-mono text-slate-400 hidden xs:inline">
                              (Estratégia Principal: {item.estrategiaPrincipal})
                            </span>
                          </div>
                        </div>

                        {/* Right: Assertividade & Botão Expandir */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-black font-mono shadow-sm">
                            {item.assertividadeScore}% Assertividade
                          </div>

                          <button
                            onClick={() =>
                              setExpandedMinutagemId(isExpanded ? null : item.id)
                            }
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                          >
                            <span>{isExpanded ? 'Ocultar' : 'Ver Estratégias'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-pink-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* ── LISTA DAS ESTRATÉGIAS DA PLANILHA QUE CONFIRMARAM ESTA MINUTAGEM ── */}
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-slate-800/60">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                          Estratégias da Planilha que Confirmaram a Minutagem {item.horarioStr}:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.estrategiasConfirmadas.map((est, i) => (
                            <div
                              key={i}
                              className="bg-black/50 border border-slate-800 hover:border-pink-500/40 rounded-xl p-2.5 text-xs font-mono space-y-1 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-amber-300 flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  {est.nome}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-500/40">
                                  {est.casa}ª Casa
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300">{est.formula}</p>
                              <div className="text-[10px] text-slate-400">
                                Gatilho: <strong className="text-pink-300">{est.velasGatilho}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
    </div>
  );
};
