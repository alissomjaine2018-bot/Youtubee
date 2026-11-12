import React, { useState } from 'react';
import { MessageCircle, Sparkles, ExternalLink, Zap } from 'lucide-react';
import { useAviatorRadar } from './hooks/useAviatorRadar';
import { Header, TabKey } from './components/Header';
import { Listinha10xTab } from './components/Listinha10xTab';
import { Maxima50xTab } from './components/Maxima50xTab';
import { MinutosFortesTab } from './components/MinutosFortesTab';
import { ConfirmacoesRosasTab } from './components/ConfirmacoesRosasTab';
import { MinutagemMaisFrequenteTab } from './components/MinutagemMaisFrequenteTab';
import { HistoricoRodadasTab } from './components/HistoricoRodadasTab';
import { VelasRosasConfirmadasTab } from './components/VelasRosasConfirmadasTab';
import { PadroesRepeticaoTab } from './components/PadroesRepeticaoTab';
import { SidebarMenu } from './components/SidebarMenu';
import { WebViewModal } from './components/WebViewModal';
import { TestVelaModal } from './components/TestVelaModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('confirmacoes');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isWebViewOpen, setIsWebViewOpen] = useState<boolean>(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  const {
    velas,
    activeServer,
    setActiveServer,
    servers,
    clockString,
    isLiveOnline,
    selectedHour,
    setSelectedHour,
    autoSimulate,
    setAutoSimulate,
    isRefreshing,
    refreshData,
    addManualVela,
    projecoes1H,
    maxima50x,
    maxima50xDetalhado,
    hotFinals,
    observationFinals,
    confirmacoesRosas,
    paresSomas,
    padroesRepeticao,
    velasRosasConfirmadas,
    minutagemMaisFrequente,
    rawApiData,
  } = useAviatorRadar();

  const currentHour = new Date().getHours();

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white pb-14">
      {/* Top Header & Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        clockString={clockString}
        isOnline={isLiveOnline}
        activeServer={activeServer}
        servers={servers}
        onSelectServer={setActiveServer}
        onOpenWebView={() => setIsWebViewOpen(true)}
        onOpenTestModal={() => setIsTestModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 pt-4 sm:pt-6">

        {currentTab === 'confirmacoes' && (
          <ConfirmacoesRosasTab
            velas={velas}
            confirmacoes={confirmacoesRosas}
            clockString={clockString}
            activeServer={activeServer}
            servers={servers}
            onSelectServer={setActiveServer}
            onOpenTestModal={() => setIsTestModalOpen(true)}
            onSelectTab={setCurrentTab}
            onOpenWebView={() => setIsWebViewOpen(true)}
          />
        )}

        {currentTab === 'minutos' && (
          <MinutosFortesTab
            hotFinals={hotFinals}
            observationFinals={observationFinals}
            selectedHour={selectedHour}
            onSelectHour={setSelectedHour}
            currentHour={currentHour}
          />
        )}

        {currentTab === 'minutagem_frequente' && (
          <MinutagemMaisFrequenteTab
            analise={minutagemMaisFrequente}
            velas={velas}
            activeServer={activeServer}
            servers={servers}
            onSelectServer={setActiveServer}
            clockString={clockString}
          />
        )}

        {currentTab === 'listinha' && (
          <Listinha10xTab projecoes={projecoes1H} clockString={clockString} />
        )}

        {currentTab === 'maxima50' && (
          <Maxima50xTab
            metrics={maxima50x}
            velas={velas}
            clockString={clockString}
            onRefresh={refreshData}
            isRefreshing={isRefreshing}
          />
        )}

        {currentTab === 'historico' && (
          <HistoricoRodadasTab
            velas={velas}
            servers={servers}
            activeServer={activeServer}
            onSelectServer={setActiveServer}
            onOpenWebView={() => setIsWebViewOpen(true)}
          />
        )}

        {currentTab === 'rosas_confirmadas' && (
          <VelasRosasConfirmadasTab
            rosasConfirmadas={velasRosasConfirmadas.rosasConfirmadas}
            estatisticasGatilhos={velasRosasConfirmadas.estatisticasGatilhos}
            totalRosasAnalisadas={velasRosasConfirmadas.totalRosasAnalisadas}
            analiseRosasConsecutivas={velasRosasConfirmadas.analiseRosasConsecutivas}
            minutagensEspeciais={velasRosasConfirmadas.minutagensEspeciais}
            activeServer={activeServer}
            servers={servers}
            onSelectServer={setActiveServer}
            clockString={clockString}
          />
        )}

        {currentTab === 'padroes_repeticao' && (
          <PadroesRepeticaoTab
            padroes={padroesRepeticao.padroes}
            ranking={padroesRepeticao.ranking}
            casaAtualEmAndamento={padroesRepeticao.casaAtualEmAndamento}
            rodadasSemRosa={padroesRepeticao.rodadasSemRosa}
            ultimaRosa={padroesRepeticao.ultimaRosa}
            totalRosas={padroesRepeticao.totalRosas}
            activeServer={activeServer}
            servers={servers}
            onSelectServer={setActiveServer}
            clockString={clockString}
          />
        )}
      </main>

      {/* Floating Action Button (Exact Green Chat Bubble from Screenshots) */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsTestModalOpen(true)}
          className="p-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xl shadow-pink-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-pink-400/40"
          title="Testar Algoritmo de Somas e Projeções"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={() => setIsWebViewOpen(true)}
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-emerald-300/40 cursor-pointer"
          title="Ver Transmissão Ao Vivo (WebView)"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </button>
      </div>

      {/* Sidebar Menu (Drawer Lateral no canto do app) */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        projecoesCount={projecoes1H.filter((p) => p.status === 'aguardando').length || 3}
        confirmacoesCount={confirmacoesRosas.filter((c) => c.status === 'pendente').length || 7}
        rosasConfirmadasCount={velasRosasConfirmadas.totalRosasAnalisadas}
        padroesCount={padroesRepeticao.padroes.length}
        minutagemMaisFrequenteCount={minutagemMaisFrequente.rankingMinutos.filter((r) => r.totalVelas > 0).length || 10}
      />

      {/* WebView Modal for the 3 broadcast links */}
      <WebViewModal
        isOpen={isWebViewOpen}
        onClose={() => setIsWebViewOpen(false)}
        activeServer={activeServer}
        servers={servers}
        onSelectServer={setActiveServer}
        rawApiData={rawApiData}
        isOnline={isLiveOnline}
      />

      {/* Test Vela Modal for instant formula simulation */}
      <TestVelaModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onAddVela={addManualVela}
        autoSimulate={autoSimulate}
        onToggleSimulate={() => setAutoSimulate(!autoSimulate)}
      />
    </div>
  );
}
