import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, Radio, Layers, Code, ShieldCheck } from 'lucide-react';
import { BroadcastServerKey, BroadcastServerInfo } from '../types/radar';

interface WebViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeServer: BroadcastServerKey;
  servers: BroadcastServerInfo[];
  onSelectServer: (server: BroadcastServerKey) => void;
  rawApiData: any;
  isOnline: boolean;
}

export const WebViewModal: React.FC<WebViewModalProps> = ({
  isOpen,
  onClose,
  activeServer,
  servers,
  onSelectServer,
  rawApiData,
  isOnline,
}) => {
  const [viewMode, setViewMode] = useState<'iframe' | 'json'>('iframe');
  const [iframeKey, setIframeKey] = useState<number>(1);

  if (!isOpen) return null;

  const currentServerInfo = servers.find((s) => s.key === activeServer) || servers[0];

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1420] border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-[#090d15] px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  INTEGRAÇÃO RÁPIDA WEBVIEW • RADAR OFICIAL
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {isOnline ? 'CONEXÃO ATIVA' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentServerInfo.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Switcher & Mode Bar */}
        <div className="bg-[#121724] px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Server tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {servers.map((s) => {
              const active = activeServer === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onSelectServer(s.key)}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] opacity-80">({s.badge})</span>
                </button>
              );
            })}
          </div>

          {/* Controls: Iframe vs Raw JSON, Reload & External link */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={() => setViewMode('iframe')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                  viewMode === 'iframe'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                WebView
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                  viewMode === 'json'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3 h-3" />
                Dados API (JSON)
              </button>
            </div>

            <button
              onClick={handleRefreshIframe}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Recarregar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <a
              href={currentServerInfo.url}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1 text-[11px]"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Abrir Link Direto</span>
            </a>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 bg-black relative overflow-hidden">
          {viewMode === 'iframe' ? (
            <div className="w-full h-full flex flex-col">
              <div className="bg-[#0b0f16] px-3 py-1.5 text-[11px] text-slate-400 font-mono truncate border-b border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-500">URL:</span>
                <span className="text-sky-300 truncate">{currentServerInfo.url}</span>
              </div>
              <iframe
                key={iframeKey}
                src={currentServerInfo.url}
                title={currentServerInfo.name}
                className="w-full flex-1 border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          ) : (
            <div className="w-full h-full p-4 overflow-auto font-mono text-xs text-emerald-400 bg-[#070b10]">
              <pre className="whitespace-pre-wrap break-all">
                {rawApiData ? JSON.stringify(rawApiData, null, 2) : 'Aguardando pacote de dados...'}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#090d15] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Servidor selecionado: <strong className="text-white">{currentServerInfo.name}</strong></span>
          <span className="text-[11px] text-slate-500">
            Pressione Esc ou clique em fechar para voltar ao Radar
          </span>
        </div>
      </div>
    </div>
  );
};
