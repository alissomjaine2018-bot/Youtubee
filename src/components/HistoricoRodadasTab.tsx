import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Flame,
  Zap,
  Clock,
  X,
  Radio,
  ExternalLink,
  RotateCw,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Vela, BroadcastServerKey, BroadcastServerInfo } from '../types/radar';
import { parseVelaClass, parseTimeString } from '../utils/aviatorMath';

interface HistoricoRodadasTabProps {
  velas: Vela[];
  servers: BroadcastServerInfo[];
  activeServer: BroadcastServerKey;
  onSelectServer: (server: BroadcastServerKey) => void;
  onOpenWebView: () => void;
}

type ServerViewMode = 'aviator1' | 'aviator_vip' | 'premium' | 'todos3';
type FilterType = 'todas' | 'rosas' | 'roxas' | 'azuis' | 'crashes';

interface ServerApiData {
  ok: boolean;
  ts?: string;
  momento?: {
    estado: string;
    score_pagantes: number;
    score_azuis: number;
    motivos?: string[];
  };
  ultimaVela?: {
    id: number;
    mult: number;
    class: string;
    t: string;
    rodada: number;
  };
  padroes?: string[];
  historico?: Array<{
    id: number;
    mult: number;
    class: string;
    t: string;
    rodada: number;
  }>;
}

export const HistoricoRodadasTab: React.FC<HistoricoRodadasTabProps> = ({
  velas,
  onOpenWebView,
}) => {
  const [filter, setFilter] = useState<FilterType>('todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVela, setSelectedVela] = useState<Vela | null>(null);
  const [liveData, setLiveData] = useState<Record<string, ServerApiData>>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Fetch live history for all 3 graphics
  const fetchAll3Histories = async () => {
    try {
      const res = await fetch('/api/broadcasts-all');
      if (res.ok) {
        const json = await res.json();
        if (json.servers) {
          const map: Record<string, ServerApiData> = {};
          Object.keys(json.servers).forEach((k) => {
            if (json.servers[k].ok && json.servers[k].data) {
              map[k] = json.servers[k].data;
            }
          });
          setLiveData(map);
        }
      }
    } catch (err) {
      console.error('Error fetching 3 aviator histories', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll3Histories();
    const interval = setInterval(fetchAll3Histories, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchAll3Histories();
  };

  // Helper to convert an API server's raw history to Vela[] format
  const getServerVelas = (serverKey: string): Vela[] => {
    const sData = liveData[serverKey];
    if (sData?.historico && sData.historico.length > 0) {
      return sData.historico.map((h) => {
        const parsed = parseTimeString(h.t || '');
        const mult = typeof h.mult === 'number' ? h.mult : parseFloat(h.mult);
        return {
          id: h.id,
          mult,
          class: parseVelaClass(mult),
          t: h.t || new Date().toISOString(),
          rodada: h.rodada || h.id,
          timeFormatted: parsed.formatted,
          dateTimeFormatted: parsed.dateTimeFormatted,
          hora: parsed.hora,
          minuto: parsed.minuto,
          segundo: parsed.segundo,
        };
      });
    }

    // Default fallback to enriched seed history if server hasn't loaded yet
    return velas;
  };

  const velasAviator1 = useMemo(() => getServerVelas('aviator1'), [liveData, velas]);
  const velasAviatorVip = useMemo(() => getServerVelas('aviator_vip'), [liveData, velas]);
  const velasPremium = useMemo(() => getServerVelas('premium'), [liveData, velas]);

  // Lista combinada com todas as velas dos 3 gráficos
  const all3CombinedVelas = useMemo(() => {
    return [...velasAviator1, ...velasAviatorVip, ...velasPremium];
  }, [velasAviator1, velasAviatorVip, velasPremium]);

  // Filter helper for any given velas list
  const filterVelas = (list: Vela[]) => {
    return list.filter((v) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesMult = v.mult.toString().includes(term);
        const matchesTime = v.dateTimeFormatted?.toLowerCase().includes(term) || v.timeFormatted.includes(term);
        if (!matchesMult && !matchesTime) return false;
      }
      if (filter === 'rosas') return v.mult >= 10.0;
      if (filter === 'roxas') return v.mult >= 2.0 && v.mult < 10.0;
      if (filter === 'azuis') return v.mult < 2.0;
      if (filter === 'crashes') return Math.abs(v.mult - 1.0) < 0.01;
      return true;
    });
  };

  // Stats consolidados dos 3 gráficos juntos
  const stats = useMemo(() => {
    const total = all3CombinedVelas.length;
    const rosas = all3CombinedVelas.filter((v) => v.mult >= 10.0);
    const roxas = all3CombinedVelas.filter((v) => v.mult >= 2.0 && v.mult < 10.0);
    const azuis = all3CombinedVelas.filter((v) => v.mult < 2.0);
    const crashes = all3CombinedVelas.filter((v) => Math.abs(v.mult - 1.0) < 0.01);
    const maxVela = all3CombinedVelas.reduce((max, v) => (v.mult > max ? v.mult : max), 1.0);

    return {
      total,
      rosasCount: rosas.length,
      pctRosas: total > 0 ? ((rosas.length / total) * 100).toFixed(1) : '0',
      roxasCount: roxas.length,
      pctRoxas: total > 0 ? ((roxas.length / total) * 100).toFixed(1) : '0',
      azuisCount: azuis.length,
      pctAzuis: total > 0 ? ((azuis.length / total) * 100).toFixed(1) : '0',
      crashesCount: crashes.length,
      maxVela,
    };
  }, [all3CombinedVelas]);

  // Selected candle math breakdown (Minuto + 1º Seg e 2º Seg)
  const mathBreakdown = useMemo(() => {
    if (!selectedVela) return null;
    const m = selectedVela.minuto;
    const sStr = selectedVela.segundo.toString().padStart(2, '0');
    const d1 = parseInt(sStr[0], 10);
    const d2 = parseInt(sStr[1], 10);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const t1 = (m + d1) % 60;
    const h1 = (selectedVela.hora + Math.floor((m + d1) / 60)) % 24;
    const t2 = (m + d2) % 60;
    const h2 = (selectedVela.hora + Math.floor((m + d2) / 60)) % 24;
    const tAmbos = (m + d1 + d2) % 60;
    const hAmbos = (selectedVela.hora + Math.floor((m + d1 + d2) / 60)) % 24;

    return {
      minuto: m,
      segundos: sStr,
      d1,
      d2,
      soma1: `${pad(m)} + ${d1} = ${pad(t1)} ➔ Alvo ${pad(h1)}:${pad(t1)}`,
      soma2: `${pad(m)} + ${d2} = ${pad(t2)} ➔ Alvo ${pad(h2)}:${pad(t2)}`,
      somaAmbos: `${pad(m)} + (${d1}+${d2}) = ${pad(tAmbos)} ➔ Alvo ${pad(hAmbos)}:${pad(tAmbos)}`,
      proj1h: `${pad((selectedVela.hora + 1) % 24)}:${pad(m)}:${sStr}`,
    };
  }, [selectedVela]);

  // Render individual 8-column grid for a set of velas (Exact match to screenshot)
  const renderCapsuleGrid = (list: Vela[]) => {
    const items = filterVelas(list);

    if (items.length === 0) {
      return (
        <div className="bg-[#090d14] border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
          Nenhuma vela encontrada para este filtro no momento.
        </div>
      );
    }

    return (
      <div className="bg-[#090d14] border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-2.5">
          {items.map((v) => {
            const is1000x = v.mult >= 1000.0;
            const is100x = v.mult >= 100.0 && v.mult < 1000.0;
            const isRosa = v.mult >= 10.0;
            const isRoxa = v.mult >= 2.0 && v.mult < 10.0;

            let cardBg = '';
            let borderColor = '';
            let timeColor = '';
            let extraBadge = null;

            if (is1000x) {
              // ── DESTAQUE DIFERENCIADO LENDÁRIO ACIMA DE 1000X ──
              cardBg = 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 animate-pulse';
              borderColor = 'border-2 border-yellow-300 ring-2 ring-yellow-400/90 shadow-[0_0_22px_rgba(250,204,21,0.9)]';
              timeColor = 'text-yellow-100 font-bold';
              extraBadge = (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-yellow-400 text-slate-950 text-[8px] font-black rounded-full shadow-lg uppercase tracking-wider flex items-center gap-0.5 whitespace-nowrap animate-bounce">
                  💎 1000X+
                </span>
              );
            } else if (is100x) {
              // ── DESTAQUE ACIMA DE 100X ──
              cardBg = 'bg-gradient-to-br from-[#4a044e] via-[#2e1065] to-[#701a75]';
              borderColor = 'border-2 border-amber-400 ring-1 ring-amber-400/70 shadow-[0_0_15px_rgba(251,191,36,0.6)]';
              timeColor = 'text-amber-200 font-bold';
              extraBadge = (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[8px] font-black rounded-full shadow-md uppercase tracking-wider flex items-center gap-0.5 whitespace-nowrap animate-pulse">
                  👑 100X+
                </span>
              );
            } else if (isRosa) {
              cardBg = 'bg-gradient-to-b from-[#e11d48] to-[#be185d]';
              borderColor = 'border-[#9f1239]';
              timeColor = 'text-pink-100/90';
            } else if (isRoxa) {
              cardBg = 'bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9]';
              borderColor = 'border-[#5b21b6]';
              timeColor = 'text-purple-100/90';
            } else {
              cardBg = 'bg-gradient-to-b from-[#0ea5e9] to-[#0284c7]';
              borderColor = 'border-[#0369a1]';
              timeColor = 'text-sky-100/90';
            }

            return (
              <button
                key={v.id}
                onClick={() => setSelectedVela(v)}
                className={`relative flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border ${cardBg} ${borderColor} shadow-md hover:scale-[1.05] active:scale-95 transition-all cursor-pointer group`}
                title={`Vela ${v.mult.toFixed(2)}x às ${v.dateTimeFormatted} - Clique para ver fórmula das somas`}
              >
                {extraBadge}
                <span className={`font-black text-sm sm:text-base leading-tight tracking-tight drop-shadow-sm tabular-nums ${
                  is1000x
                    ? 'text-yellow-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-black'
                    : is100x
                    ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : 'text-white'
                }`}>
                  {v.mult.toFixed(2)}x
                </span>
                <span className={`text-[9px] sm:text-[10px] ${timeColor} font-mono font-medium tracking-tighter mt-0.5 whitespace-nowrap opacity-90 group-hover:opacity-100`}>
                  {v.dateTimeFormatted}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12">
      {/* Top Banner Card: HISTÓRICO DOS 3 GRÁFICOS */}
      <div className="bg-[#10141e] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-wider text-white uppercase">
                HISTÓRICO DOS 3 GRÁFICOS (APIS AO VIVO)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AO VIVO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Grade oficial das rodadas sincronizadas com as APIs do Aviator 1, Aviator Vip e Premium
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={onOpenWebView}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WebView</span>
            </button>
          </div>
        </div>



        {/* Search and Filters Strip */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setFilter('todas')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                filter === 'todas'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas ({stats.total})
            </button>

            <button
              onClick={() => setFilter('rosas')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                filter === 'rosas'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌸 Rosas ≥10x ({stats.rosasCount})</span>
            </button>

            <button
              onClick={() => setFilter('roxas')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                filter === 'roxas'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🟣 Roxas ({stats.roxasCount})</span>
            </button>

            <button
              onClick={() => setFilter('azuis')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                filter === 'azuis'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔵 Azuis ({stats.azuisCount})</span>
            </button>

            <button
              onClick={() => setFilter('crashes')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                filter === 'crashes'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡ 1.00x ({stats.crashesCount})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar (ex: 84.35 ou 08:19)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Stats Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3.5">
          <div className="bg-rose-950/25 border border-rose-500/40 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
              🌸 ROSAS (≥10X)
            </span>
            <div className="text-xl font-black text-rose-400 tabular-nums">
              {stats.rosasCount} <span className="text-xs text-rose-300 font-semibold">({stats.pctRosas}%)</span>
            </div>
          </div>

          <div className="bg-purple-950/25 border border-purple-500/40 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              🟣 ROXAS (2X–9.99X)
            </span>
            <div className="text-xl font-black text-purple-400 tabular-nums">
              {stats.roxasCount} <span className="text-xs text-purple-300 font-semibold">({stats.pctRoxas}%)</span>
            </div>
          </div>

          <div className="bg-sky-950/25 border border-sky-500/40 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
              🔵 AZUIS (&lt;2X)
            </span>
            <div className="text-xl font-black text-sky-400 tabular-nums">
              {stats.azuisCount} <span className="text-xs text-sky-300 font-semibold">({stats.pctAzuis}%)</span>
            </div>
          </div>

          <div className="bg-amber-950/25 border border-amber-500/40 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              👑 MAIOR VELA
            </span>
            <div className="text-xl font-black text-amber-400 tabular-nums truncate">
              {stats.maxVela.toFixed(2)}x
            </div>
          </div>
        </div>
      </div>

      {/* RENDER GRIDS: OS 3 GRÁFICOS JUNTOS DIRETAMENTE */}
      <div className="space-y-6">
        {/* 1. Gráfico Aviator 1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              1. GRÁFICO AVIATOR 1 (BROADCAST 1)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {velasAviator1.length} rodadas
            </span>
          </div>
          {renderCapsuleGrid(velasAviator1)}
        </div>

        {/* 2. Gráfico Aviator Vip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-black text-purple-400 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              2. GRÁFICO AVIATOR VIP (BROADCAST 2)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {velasAviatorVip.length} rodadas
            </span>
          </div>
          {renderCapsuleGrid(velasAviatorVip)}
        </div>

        {/* 3. Gráfico Premium */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-black text-rose-400 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              3. GRÁFICO PREMIUM (BROADCAST 3)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {velasPremium.length} rodadas
            </span>
          </div>
          {renderCapsuleGrid(velasPremium)}
        </div>
      </div>

      {/* Click Modal / Drawer for Selected Candle */}
      {selectedVela && mathBreakdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#10141e] border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedVela(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg ${
                  selectedVela.mult >= 10.0
                    ? 'bg-rose-600 shadow-rose-600/30'
                    : selectedVela.mult >= 2.0
                    ? 'bg-purple-600 shadow-purple-600/30'
                    : 'bg-sky-600 shadow-sky-600/30'
                }`}
              >
                {selectedVela.mult.toFixed(2)}x
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">
                    Vela {selectedVela.mult.toFixed(2)}x
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    #{selectedVela.rodada}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Horário: {selectedVela.dateTimeFormatted}
                </p>
              </div>
            </div>

            {/* Somas dos dois segundos para esta vela */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                ⚡ Somas dos Dois Segundos (Regra do Radar):
              </span>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    1ª SOMA (Minuto + 1º Segundo: {mathBreakdown.d1})
                  </span>
                  <div className="text-white font-bold mt-0.5">
                    {mathBreakdown.soma1}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40">
                  <span className="text-[10px] text-amber-400 font-bold block">
                    2ª SOMA (Minuto + 2º Segundo: {mathBreakdown.d2})
                  </span>
                  <div className="text-white font-bold mt-0.5">
                    {mathBreakdown.soma2}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/30 text-slate-300 text-[11px]">
                  <span>Soma conjunta dos dois dígitos: </span>
                  <strong className="text-white">{mathBreakdown.somaAmbos}</strong>
                </div>

                {selectedVela.mult >= 10.0 && (
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-slate-200 text-[11px] flex justify-between">
                    <span>Projeção +1h:</span>
                    <strong className="text-rose-400">{selectedVela.timeFormatted} ➔ {mathBreakdown.proj1h}</strong>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedVela(null)}
              className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
