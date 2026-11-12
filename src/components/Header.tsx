import React from 'react';
import {
  Radio,
  Flame,
  Sparkles,
  ExternalLink,
  Activity,
  Menu,
  BarChart3,
  Clock,
} from 'lucide-react';
import { BroadcastServerKey, BroadcastServerInfo } from '../types/radar';

export type TabKey =
  | 'confirmacoes'
  | 'minutos'
  | 'minutagem_frequente'
  | 'listinha'
  | 'maxima50'
  | 'historico'
  | 'rosas_confirmadas'
  | 'padroes_repeticao';

interface HeaderProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenSidebar: () => void;
  clockString: string;
  isOnline: boolean;
  activeServer: BroadcastServerKey;
  servers: BroadcastServerInfo[];
  onSelectServer: (server: BroadcastServerKey) => void;
  onOpenWebView: () => void;
  onOpenTestModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSidebar,
  clockString,
  isOnline,
  activeServer,
  servers,
  onSelectServer,
  onOpenWebView,
  onOpenTestModal,
}) => {
  const tabTitles: Record<TabKey, { label: string; icon: string }> = {
    confirmacoes: { label: 'Confirmação Vela Rosa', icon: '⚡' },
    minutos: { label: 'Minutos Fortes', icon: '⏱️' },
    minutagem_frequente: { label: 'Minutagem Mais Frequente (10X+)', icon: '⏱️' },
    listinha: { label: 'Listinha 10X (Projeção 1H)', icon: '🚨' },
    maxima50: { label: 'TiaguinhoO Máxima de 50X', icon: '🔥' },
    historico: { label: 'Ver os 3 Gráficos Juntos', icon: '📊' },
    rosas_confirmadas: { label: 'Velas Especiais puxa Rosa', icon: '🌸' },
    padroes_repeticao: { label: 'Padrões de Repetição', icon: '🔁' },
  };

  const currentInfo = tabTitles[currentTab] || { label: 'Radar Aviator', icon: '⚡' };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
      {/* ── TOP BANNER: BRAND TIAGUINHOO AVIATOR COM FOTO OFICIAL & BOTÃO MENU LATERAL ── */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Botão Hamburger do Menu Lateral + Foto & Nome TiaguinhoO Aviator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
            title="Abrir Menu Lateral de Abas"
            aria-label="Abrir Menu Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onSelectTab('confirmacoes')}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-amber-500 hover:border-pink-500 shadow-lg shadow-amber-500/30 shrink-0 bg-[#0d111a] cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="Voltar para Confirmações de Velas Rosas (Aba Principal)"
            aria-label="Ir para Confirmações de Velas Rosas"
          >
            <img
              src="/assets/aistudio/Tiaguinho__o_terror_do_Aviator__2___1__5caaaf07.png"
              alt="TiaguinhoO Aviator"
              className="w-full h-full object-cover"
            />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTab('confirmacoes')}
                className="font-black text-sm sm:text-base tracking-wider text-white hover:text-amber-300 uppercase drop-shadow-sm font-mono text-left transition-colors cursor-pointer group flex items-center"
                title="Voltar para Confirmações de Velas Rosas (Aba Principal)"
              >
                <span>TIAGUINHOO</span>&nbsp;<span className="text-amber-400 group-hover:text-pink-400">AVIATOR</span>
              </button>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AO VIVO
              </span>
            </div>
            {/* Indicador da aba atualmente ativa */}
            <button
              onClick={() => onSelectTab('confirmacoes')}
              className="flex items-center gap-1 text-[11px] text-amber-300 font-bold truncate text-left cursor-pointer hover:text-amber-200 transition-colors"
              title="Voltar para Confirmações de Velas Rosas (Aba Principal)"
            >
              <span>{currentInfo.icon}</span>
              <span className="truncate">{currentInfo.label}</span>
            </button>
          </div>
        </div>

        {/* Right: Relógio, Botão WebView & Testar Vela */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono tabular-nums">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>{clockString}</span>
          </div>

          <button
            onClick={onOpenWebView}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Abrir WebView dos links oficiais do Aviator"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>WebView</span>
          </button>

          <button
            onClick={onOpenTestModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-600/20 transition-all active:scale-95 cursor-pointer"
            title="Simular ou Inserir Vela para Testar Somas e Projeções"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Testar Vela</span>
          </button>
        </div>
      </div>

      {/* ── SELETOR DE SERVIDORES (AVIATOR 1, VIP, PREMIUM) & ACESSO RÁPIDO AO MENU LATERAL ── */}
      <div className="bg-[#090c12] border-t border-slate-800/60 px-3 sm:px-4 py-1.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider shrink-0 mr-1">
              Servidor:
            </span>
            {servers.map((s) => {
              const isActive = activeServer === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onSelectServer(s.key)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400' : 'bg-slate-500'}`} />
                  {s.name}
                </button>
              );
            })}

            {/* Separador sutil */}
            <span className="w-px h-3.5 bg-slate-800 mx-1 shrink-0" />

            {/* Aba rápida: Ver os 3 gráficos juntos (exatamente como na segunda imagem) */}
            <button
              onClick={() => onSelectTab('historico')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm ${
                currentTab === 'historico'
                  ? 'bg-sky-600 text-white border border-sky-400 shadow-sky-500/30 ring-1 ring-sky-400'
                  : 'bg-[#122336] hover:bg-[#18314e] text-sky-300 border border-sky-500/40 hover:border-sky-400/70'
              }`}
              title="Ver os 3 gráficos juntos"
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Ver os 3 gráficos juntos</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-[10px] font-mono hidden xs:flex items-center gap-1 ${
                isOnline ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <Activity className="w-3 h-3" />
              {isOnline ? 'Conectado' : 'Sincronizando'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
