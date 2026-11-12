import React, { useEffect } from 'react';
import {
  X,
  ChevronRight,
  Plane,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TabKey } from './Header';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  projecoesCount?: number;
  confirmacoesCount?: number;
  rosasConfirmadasCount?: number;
  padroesCount?: number;
  minutagemMaisFrequenteCount?: number;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  projecoesCount = 3,
  confirmacoesCount = 7,
  rosasConfirmadasCount = 18,
  padroesCount = 15,
  minutagemMaisFrequenteCount = 10,
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems: Array<{
    key: TabKey;
    numero: number;
    titulo: string;
    subtitulo: string;
    icon: string;
    badge?: number;
  }> = [
    {
      key: 'confirmacoes',
      numero: 1,
      titulo: 'Confirmação Vela Rosa',
      subtitulo: 'Somas minutos + segundos (1.00x e 10x)',
      icon: '⚡',
      badge: confirmacoesCount,
    },
    {
      key: 'minutos',
      numero: 2,
      titulo: 'Minutos Fortes',
      subtitulo: 'Estratégia dos finais e repetições',
      icon: '⏱️',
    },
    {
      key: 'minutagem_frequente',
      numero: 3,
      titulo: 'Minutagem Mais Frequente (10X+)',
      subtitulo: 'Minutos mais pagadores & análise do último dígito',
      icon: '⏱️',
      badge: minutagemMaisFrequenteCount,
    },
    {
      key: 'listinha',
      numero: 4,
      titulo: 'Listinha 10X (Projeção 1H)',
      subtitulo: 'Projeção hora a hora com countdown',
      icon: '🚨',
      badge: projecoesCount,
    },
    {
      key: 'maxima50',
      numero: 5,
      titulo: 'TiaguinhoO Máxima de 50X',
      subtitulo: 'Termômetro visual de temperatura & acúmulo',
      icon: '🔥',
    },
    {
      key: 'rosas_confirmadas',
      numero: 6,
      titulo: 'Velas Especiais puxa Rosa',
      subtitulo: 'Análise 24h das estratégias da planilha',
      icon: '🌸',
      badge: rosasConfirmadasCount,
    },
    {
      key: 'padroes_repeticao',
      numero: 7,
      titulo: 'Padrões de Repetição',
      subtitulo: 'Casas 1ª à 10ª & ranking de repetição',
      icon: '🔁',
      badge: padroesCount,
    },
    {
      key: 'historico',
      numero: 8,
      titulo: 'Ver os 3 Gráficos Juntos',
      subtitulo: 'Broadcast 1, 2 e 3 simultâneos ao vivo',
      icon: '📊',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Dark backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Side Drawer Panel (Exact match to Screenshot_20261109-210200.Chrome_d1697f2a.png) */}
      <div className="relative w-[85vw] max-w-sm sm:w-96 bg-[#0c101a] border-r border-slate-800/90 h-full flex flex-col justify-between shadow-2xl z-50 overflow-hidden">
        {/* Top Header of Sidebar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/60 shadow-md shadow-amber-500/20 bg-[#121622] flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Tiaguinho__o_terror_do_Aviator__2___1__5caaaf07.png"
                alt="TiaguinhoO"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-black text-sm sm:text-base tracking-wider text-white uppercase flex items-center gap-1.5 font-mono">
                <span>TIAGUINHOO AVIATOR</span>
              </div>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                TIAGUINHO • BETBRABO
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Fechar Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 no-scrollbar">
          {menuItems.map((item) => {
            const isActive = currentTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectTab(item.key);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                  isActive
                    ? 'bg-rose-950/40 border-rose-500/80 text-white shadow-lg shadow-rose-950/50 ring-1 ring-rose-400/50'
                    : 'bg-[#101522]/80 border-slate-800/80 hover:border-slate-700 hover:bg-[#141b2c] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{item.icon}</span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {item.numero}. {item.titulo}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                      {item.subtitulo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                      isActive ? 'text-rose-400' : 'text-slate-500'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer of Sidebar (Exact copy from Image 2) */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070a12] text-center">
          <p className="text-[11px] text-slate-400 font-medium">Radar Estatístico Aviator</p>
          <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono mt-0.5">
            Horário Oficial de Brasília (UTC-3)
          </p>
        </div>
      </div>
    </div>
  );
};
