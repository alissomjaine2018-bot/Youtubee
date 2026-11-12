import React, { useState, useMemo } from 'react';
import {
  Clock,
  Sparkles,
  Flame,
  ArrowUpRight,
  Layers,
  Zap,
  TrendingUp,
  X,
  Target,
  BarChart3,
  Search,
  Repeat,
  Trophy,
  History,
  Timer,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  AnaliseMinutagemFrequente,
  MinutoFrequenteItem,
  FinalMinutoItem,
  HorarioRepetidoItem,
  MinutagemConsecutivaItem,
  BroadcastServerKey,
  BroadcastServerInfo,
  Vela,
} from '../types/radar';

interface MinutagemMaisFrequenteTabProps {
  analise: AnaliseMinutagemFrequente;
  velas: Vela[];
  activeServer: BroadcastServerKey;
  servers: BroadcastServerInfo[];
  onSelectServer: (server: BroadcastServerKey) => void;
  clockString: string;
}

type SubTabType = 'minutos' | 'consecutivas' | 'horarios' | 'finais' | 'todos';

export const MinutagemMaisFrequenteTab: React.FC<MinutagemMaisFrequenteTabProps> = ({
  analise,
  velas,
  activeServer,
  servers,
  onSelectServer,
  clockString,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('minutos');
  const [isModalAllOpen, setIsModalAllOpen] = useState<boolean>(false);
  const [selectedMinutoModal, setSelectedMinutoModal] = useState<MinutoFrequenteItem | null>(null);
  const [selectedFinalModal, setSelectedFinalModal] = useState<FinalMinutoItem | null>(null);
  const [selectedHorarioModal, setSelectedHorarioModal] = useState<HorarioRepetidoItem | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentServerInfo = useMemo(() => {
    return (
      servers.find((s) => s.key === activeServer) || {
        key: activeServer,
        name: 'Aviator 1',
        badge: 'BROADCAST 1',
      }
    );
  }, [servers, activeServer]);

  // Current parsed minute and final digit
  const [currentHour, currentMin, currentFinal] = useMemo(() => {
    const parts = clockString.split(':').map((n) => parseInt(n, 10));
    const h = parts[0] || 0;
    const m = parts[1] || 0;
    return [h, m, m % 10];
  }, [clockString]);

  // Top items with search filter
  const filteredMinutos = useMemo(() => {
    if (!searchTerm.trim()) {
      return analise.rankingMinutos.slice(0, 15);
    }
    const term = searchTerm.trim().toLowerCase();
    return analise.rankingMinutos.filter(
      (item) =>
        item.minuto.toString().includes(term) ||
        item.minutoStr.toLowerCase().includes(term) ||
        item.horariosRepetidos?.some((h) => h.toLowerCase().includes(term))
    );
  }, [analise.rankingMinutos, searchTerm]);

  const filteredConsecutivas = useMemo(() => {
    if (!searchTerm.trim()) {
      return analise.minutagensConsecutivas || [];
    }
    const term = searchTerm.trim().toLowerCase();
    return (analise.minutagensConsecutivas || []).filter(
      (item) =>
        item.minuto.toString().includes(term) ||
        item.minutoStr.toLowerCase().includes(term) ||
        item.detalheHorarios.toLowerCase().includes(term)
    );
  }, [analise.minutagensConsecutivas, searchTerm]);

  const filteredHorarios = useMemo(() => {
    if (!searchTerm.trim()) {
      return (analise.horariosMaisRepetidos || []).slice(0, 20);
    }
    const term = searchTerm.trim().toLowerCase();
    return (analise.horariosMaisRepetidos || []).filter(
      (item) =>
        item.horario.toLowerCase().includes(term) ||
        item.hora.toString().includes(term) ||
        item.minuto.toString().includes(term)
    );
  }, [analise.horariosMaisRepetidos, searchTerm]);

  const rankingFinais = analise.rankingFinais;
  const proximo = analise.proximoMinutoQuente;
  const topMinuto = analise.minutoMaisFrequente;
  const topConsecutiva = analise.consecutivaTop;
  const topHorario = analise.horarioTopRepetido;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
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
                  MINUTAGEM MAIS FREQUENTE (10X+)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/50 uppercase font-mono flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  BUSCA 24H AO VIVO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium font-mono">
                Busca contínua 24h: minutagens consecutivas, horários que mais repetiram e minutos mais pagadores (&ge;10x)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 tabular-nums">
              ● {clockString} BSB
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-black font-mono shadow-sm">
              {analise.totalRosasAnalisadas} ROSAS ANALISADAS
            </span>
          </div>
        </div>

        {/* ── BARRA DE BUSCA RÁPIDA ── */}
        <div className="mt-3.5 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="⚡ Busca rápida 24h: digite o minuto ou horário exato (ex: 16 ou 14:16)..."
              className="w-full bg-[#080c14] border border-slate-800 focus:border-pink-500 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-8 py-2 rounded-xl outline-none font-mono transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── SELETOR DE GRÁFICO (ISOLADO POR SERVIDOR) ── */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
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
                className={`py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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

      {/* ── 4 CARDS DE DESTAQUE DE ELITE: MINUTO #1, CONSECUTIVAS #1, HORÁRIO #1 E FINAL #1 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Minuto Mais Pagador #1 */}
        <div className="bg-[#10141e] border-2 border-pink-500/60 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-pink-400" />
              Minuto Mais Pagador #1
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-pink-950 text-pink-300 border border-pink-500/40 font-mono">
              TOP 1
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-pink-400">
              {topMinuto?.minutoStr || 'Minuto 16'}
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {topMinuto?.percentual || 18.0}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Pagou <strong className="text-white">{topMinuto?.totalVelas || 11} velas rosas</strong> nas 24h
          </p>
        </div>

        {/* Card 2: Mais Consecutivas */}
        <div className="bg-[#10141e] border-2 border-rose-500/60 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Mais Consecutivas
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-950 text-rose-300 border border-rose-500/40 font-mono">
              COLADAS
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
              {topConsecutiva?.minutoStr || 'Minuto 16'}
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {topConsecutiva?.consecutivasMax || 3}x seguidas
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono truncate" title={topConsecutiva?.detalheHorarios}>
            {topConsecutiva?.detalheHorarios || '3 rosas seguidas às 14:16'}
          </p>
        </div>

        {/* Card 3: Horário Mais Repetido (HH:MM) */}
        <div className="bg-[#10141e] border-2 border-cyan-500/60 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Horário Mais Repetido
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              24H PICO
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
              {topHorario?.horario || '14:16'}
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {topHorario?.repeticoes || 4}x nas 24h
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Maior vela: <strong className="text-pink-400">⚡ {topHorario?.maiorMult?.toFixed(2) || '54.85'}x</strong>
          </p>
        </div>

        {/* Card 4: Último Número Mais Frequente */}
        <div className="bg-[#10141e] border-2 border-amber-500/60 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              Final Mais Frequente
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-950 text-amber-300 border border-amber-500/40 font-mono">
              FINAL #1
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              {analise.finalMaisFrequente?.label || 'Final 6'}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {analise.finalMaisFrequente?.percentual || 27.9}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {analise.finalMaisFrequente?.totalVelas || 17} rosas em :06, :16, :26...
          </p>
        </div>
      </div>

      {/* ── BOTÕES DE NAVEGAÇÃO ENTRE AS ABAS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#0d121c] p-1.5 rounded-2xl border border-slate-800">
        {/* SubTab 1: Ranking Minutos */}
        <button
          onClick={() => setActiveSubTab('minutos')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'minutos'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 ring-1 ring-pink-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Ranking Minutos</span>
        </button>

        {/* SubTab 2: Minutagens Consecutivas */}
        <button
          onClick={() => setActiveSubTab('consecutivas')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'consecutivas'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Consecutivas</span>
        </button>

        {/* SubTab 3: Horários Mais Repetidos (HH:MM) */}
        <button
          onClick={() => setActiveSubTab('horarios')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'horarios'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Horários Repetidos</span>
        </button>

        {/* SubTab 4: Finais 0 a 9 */}
        <button
          onClick={() => setActiveSubTab('finais')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'finais'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Último Número</span>
        </button>

        {/* SubTab 5: Todos 00 a 59 */}
        <button
          onClick={() => setActiveSubTab('todos')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
            activeSubTab === 'todos'
              ? 'bg-slate-700 text-white shadow-md ring-1 ring-slate-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Todos 00 a 59</span>
        </button>
      </div>

      {/* ── SEÇÃO 1: RANKING DOS MINUTOS MAIS FREQUENTES (COM HORÁRIOS QUE SE REPETIRAM) ── */}
      {activeSubTab === 'minutos' && (
        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-400" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  MINUTAGEM MAIS FREQUENTE (10X+)
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Minutagens que mais pagaram velas rosas nas 24h e seus horários mais repetidos
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalAllOpen(true)}
              className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ver Todas 00-59</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lista de Minutos */}
          <div className="space-y-2.5">
            {filteredMinutos.map((item) => {
              const isCurrent = item.minuto === currentMin;

              return (
                <div
                  key={item.minuto}
                  onClick={() => setSelectedMinutoModal(item)}
                  className={`bg-[#0f1422] hover:bg-[#141b2e] border transition-all rounded-xl p-3 sm:p-4 cursor-pointer ${
                    isCurrent
                      ? 'border-emerald-500/80 bg-emerald-950/20 shadow-md shadow-emerald-950/40'
                      : item.ranking === 1
                      ? 'border-pink-500/60 shadow-sm'
                      : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Left: #ranking + Minuto Badge + Tags */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-black font-mono text-slate-500 w-6">
                        #{item.ranking}
                      </span>

                      <span className="px-3 py-1.5 rounded-lg bg-[#2a0e1c] border border-pink-500/40 text-pink-300 font-mono font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5">
                        <span>{item.minutoStr}</span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
                        )}
                      </span>

                      {item.isProximo && !isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                          ⏱️ Em {item.diffMinutos} min
                        </span>
                      )}

                      {item.consecutivasMax && item.consecutivasMax >= 2 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
                          ⚡ {item.consecutivasMax} rosas seguidas
                        </span>
                      )}
                    </div>

                    {/* Right: Quantidade de velas e percentual dourado */}
                    <div className="flex items-center gap-6 sm:gap-8 font-mono self-end sm:self-auto">
                      <span className="text-xs sm:text-sm font-medium text-slate-300">
                        {item.totalVelas} {item.totalVelas === 1 ? 'vela' : 'velas'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-amber-400 min-w-[50px] text-right">
                        {item.percentual.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Horários exatos que mais se repetiram neste minuto */}
                  {item.horariosRepetidos && item.horariosRepetidos.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-2 flex-wrap text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Repeat className="w-3 h-3 text-cyan-400" />
                        Horários que mais repetiram:
                      </span>
                      {item.horariosRepetidos.map((hr, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold"
                        >
                          {hr}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Mostrando minutos de maior frequência de velas rosas nas 24h</span>
            <button
              onClick={() => setIsModalAllOpen(true)}
              className="text-pink-400 hover:underline font-bold cursor-pointer"
            >
              Expandir todos os 60 minutos &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ── SEÇÃO 2: MINUTAGENS CONSECUTIVAS QUE MAIS SAÍRAM COM VELAS ROSAS ── */}
      {activeSubTab === 'consecutivas' && (
        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  MINUTAGENS QUE MAIS SAÍRAM CONSECUTIVAMENTE (VELAS COLADAS)
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Minutos com maior explosão de rosas em sequência direta nas 24h
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredConsecutivas.map((item) => (
              <div
                key={item.minuto}
                className="bg-[#0f1422] border border-rose-500/40 rounded-xl p-3.5 hover:border-rose-400 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-black font-mono text-slate-500 w-6">
                      #{item.ranking}
                    </span>

                    <span className="px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-500/60 text-rose-300 font-mono font-black text-xs sm:text-sm shadow-sm">
                      {item.minutoStr}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-white" />
                      <span>{item.consecutivasMax} ROSAS SEGUIDAS</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 font-mono self-end sm:self-auto text-xs">
                    <span className="text-slate-300 font-medium">
                      Total: <strong className="text-white">{item.totalVelas} rosas</strong>
                    </span>
                    <span className="text-amber-400 font-black">
                      Pico: {item.maiorMult.toFixed(2)}x
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="text-rose-400 font-bold">Ocorrência registrada:</span>
                  <span className="text-slate-200">{item.detalheHorarios}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SEÇÃO 3: HORÁRIOS QUE MAIS SE REPETIRAM E SAÍRAM VELAS ROSAS (HH:MM) ── */}
      {activeSubTab === 'horarios' && (
        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  HORÁRIOS QUE MAIS SE REPETIRAM COM VELAS ROSAS (HH:MM)
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Horários exatos do dia que mais registraram saídas repetidas de velas rosas (&ge;10x)
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold self-start sm:self-auto">
              {analise.horariosMaisRepetidos?.length || 0} Horários Catalogados
            </span>
          </div>

          {/* Ranking dos Horários Exatos Mais Repetidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredHorarios.map((item) => (
              <div
                key={item.horario}
                onClick={() => setSelectedHorarioModal(item)}
                className="bg-[#0f1422] hover:bg-[#141b2e] border border-slate-800 hover:border-cyan-500/60 rounded-xl p-3.5 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black font-mono text-slate-500 w-5">
                      #{item.ranking}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono font-black text-sm shadow-sm flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.horario}</span>
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Repetiu {item.repeticoes}x
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>
                    Minuto: <strong className="text-pink-300">Minuto {item.minuto.toString().padStart(2, '0')}</strong>
                  </span>
                  <span>
                    Maior vela: <strong className="text-emerald-400 font-bold">{item.maiorMult.toFixed(2)}x</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Faixas Horárias de Pico 24h */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>DISTRIBUIÇÃO POR FAIXA HORÁRIA (HORAS MAIS QUENTES DO DIA)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(analise.faixasHorarias || []).slice(0, 6).map((fx, idx) => (
                <div
                  key={fx.hora}
                  className="bg-[#090d15] border border-slate-800 rounded-xl p-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">{fx.faixa}</span>
                    <span className="px-1.5 py-0.2 rounded bg-pink-950 text-pink-300 text-[10px] font-black">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-lg font-black text-pink-400">{fx.totalRosas} rosas</span>
                    <span className="text-amber-400 font-bold">{fx.percentual}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Minutos pico: {fx.minutosMaisFortes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SEÇÃO 4: ANÁLISE DO ÚLTIMO NÚMERO DO MINUTO (FINAIS 0 A 9) ── */}
      {activeSubTab === 'finais' && (
        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  ANÁLISE DO ÚLTIMO NÚMERO DO MINUTO (FINAIS 0 A 9)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Identifica qual terminação de minuto (dígito final) mais puxa velas rosas nas 24h
              </p>
            </div>

            <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 self-start sm:self-center">
              <span>Minuto Atual:</span>
              <strong className="text-white">:{currentMin.toString().padStart(2, '0')}</strong>
              <span className="text-slate-500">•</span>
              <span>Final:</span>
              <strong className="text-amber-400 font-bold">{currentFinal}</strong>
            </div>
          </div>

          <div className="space-y-2.5">
            {rankingFinais.map((item) => {
              const isCurrentFinal = item.digitoFinal === currentFinal;

              return (
                <div
                  key={item.digitoFinal}
                  onClick={() => setSelectedFinalModal(item)}
                  className={`bg-[#0f1422] hover:bg-[#141b2e] border transition-all rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                    isCurrentFinal
                      ? 'border-amber-400/80 bg-amber-950/20 shadow-md shadow-amber-950/40 ring-1 ring-amber-400/40'
                      : item.ranking === 1
                      ? 'border-pink-500/60 shadow-sm'
                      : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-black font-mono text-slate-500 w-6">
                      #{item.ranking}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black font-mono text-xs sm:text-sm shadow-sm">
                        {item.label}
                      </span>
                      {isCurrentFinal && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase animate-bounce font-mono">
                          Dígito Atual
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                      ({item.minutosCompreendidos})
                    </span>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                    <div className="text-left sm:text-right text-xs font-mono">
                      <span className="text-slate-400 block sm:inline mr-2">
                        Minuto pico: <strong className="text-pink-300">Minuto {item.minutoMaisForte.toString().padStart(2, '0')}</strong>
                      </span>
                      <span className="text-white font-bold">{item.totalVelas} velas</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-20 sm:w-28 bg-slate-800 h-2 rounded-full overflow-hidden hidden xs:block">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-pink-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(8, item.percentual * 2.5))}%` }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-black font-mono text-amber-400 min-w-[45px] text-right">
                        {item.percentual.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SEÇÃO 5: TODOS OS MINUTOS 00 A 59 EM GRID COMPLETO ── */}
      {activeSubTab === 'todos' && (
        <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-pink-400" />
                <span>MAPA COMPLETO DOS 60 MINUTOS (00 A 59)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Visualize a frequência de velas rosas minuto a minuto na hora
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Minuto Atual: :{currentMin.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-10 gap-2 pt-2">
            {analise.todosMinutos00a59.map((item) => {
              const isCurrent = item.minuto === currentMin;
              const isTop = item.totalVelas >= 3;

              return (
                <div
                  key={item.minuto}
                  onClick={() => setSelectedMinutoModal(item)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-emerald-400 bg-emerald-950/40 ring-1 ring-emerald-400'
                      : isTop
                      ? 'border-pink-500/70 bg-[#1e0d19]/80 shadow-sm'
                      : item.totalVelas > 0
                      ? 'border-slate-800 bg-[#0f1422] hover:border-slate-700'
                      : 'border-slate-900 bg-[#080b12] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="text-xs font-mono font-black text-slate-200">
                    :{item.minutoPad}
                  </div>
                  <div
                    className={`text-[11px] font-mono font-bold mt-1 ${
                      item.totalVelas > 0 ? 'text-pink-400' : 'text-slate-600'
                    }`}
                  >
                    {item.totalVelas} {item.totalVelas === 1 ? 'rosa' : 'rosas'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL: VER TODOS OS 60 MINUTOS EXPANDIDOS ── */}
      {isModalAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e121d] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#101524]">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-mono">
                  TODOS OS 60 MINUTOS (00 A 59) • RANKING COMPLETO
                </h3>
              </div>
              <button
                onClick={() => setIsModalAllOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1 no-scrollbar">
              {analise.rankingMinutos.map((item) => (
                <div
                  key={item.minuto}
                  className="bg-[#111625] border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-bold w-6">#{item.ranking}</span>
                    <span className="px-2.5 py-1 rounded bg-[#250d19] border border-pink-500/40 text-pink-300 font-bold">
                      {item.minutoStr}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      (Final {item.minuto % 10})
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-slate-300 font-medium">{item.totalVelas} velas</span>
                    <span className="text-amber-400 font-bold w-12 text-right">
                      {item.percentual.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-800 text-right bg-[#0a0d16]">
              <button
                onClick={() => setIsModalAllOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DETALHE DO MINUTO SELECIONADO ── */}
      {selectedMinutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e121d] border border-pink-500/60 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="text-base font-black text-white font-mono">
                  {selectedMinutoModal.minutoStr}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMinutoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Posição no Ranking:</span>
                <strong className="text-pink-400 font-black">#{selectedMinutoModal.ranking} Lugar</strong>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total de Velas Rosas:</span>
                <strong className="text-white font-black">{selectedMinutoModal.totalVelas} velas</strong>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Frequência em 24h:</span>
                <strong className="text-amber-400 font-black">{selectedMinutoModal.percentual}%</strong>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Maior Sequência Consecutiva:</span>
                <strong className="text-rose-400 font-black">{selectedMinutoModal.consecutivasMax || 1} rosas seguidas</strong>
              </div>

              <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1.5">Horários que mais se repetiram:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedMinutoModal.horariosRepetidos || []).map((h, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[11px]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedMinutoModal(null)}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DETALHE DO HORÁRIO SELECIONADO ── */}
      {selectedHorarioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e121d] border border-cyan-500/60 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white font-mono">
                  Horário Exato: {selectedHorarioModal.horario}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHorarioModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total de Repetições nas 24h:</span>
                <strong className="text-cyan-300 font-black">{selectedHorarioModal.repeticoes} vezes</strong>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Maior Vela Registrada:</span>
                <strong className="text-emerald-400 font-black">⚡ {selectedHorarioModal.maiorMult.toFixed(2)}x</strong>
              </div>

              <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1.5">Velas catalogadas neste horário:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                  {selectedHorarioModal.velas.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] bg-slate-900/80 px-2 py-1 rounded">
                      <span className="text-slate-300">{v.timeFormatted}</span>
                      <strong className="text-pink-400 font-bold">{v.mult.toFixed(2)}x</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedHorarioModal(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
