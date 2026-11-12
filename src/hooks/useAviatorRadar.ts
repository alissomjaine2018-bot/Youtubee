import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Vela,
  BroadcastServerKey,
  BroadcastServerInfo,
  Projecao1H,
  ConfirmacaoRosa,
  ParSomasVela,
  ChuvaMetrics,
  Maxima50xMetrics,
} from '../types/radar';
import {
  parseVelaClass,
  parseTimeString,
  calculateSomas,
  calculateParesSomas,
  calculateProjecoes1H,
  calculateMaxima50x,
  calculateMinutosFortes,
  calculateChuvaMetrics,
  calculatePadroesRepeticao,
  calculateVelasRosasConfirmadas,
  calculateMaxima50xDetalhado,
  calculateMinutagemMaisFrequente,
} from '../utils/aviatorMath';
import { generateSeedVelas } from '../data/initialRounds';

export const SERVERS_INFO: BroadcastServerInfo[] = [
  {
    key: 'aviator1',
    name: 'Aviator 1',
    badge: 'BROADCAST 1',
    url: 'https://www.radar-aviator.com/broadcast.php?casa=BETBRABO&_=1791309160733',
    description: 'Servidor Oficial Broadcast 1 (BetBrabo)',
  },
  {
    key: 'aviator_vip',
    name: 'Aviator Vip',
    badge: 'BROADCAST 2',
    url: 'https://www.radar-aviator.com/broadcast2.php?casa=BETBRABO&_=1791309023315',
    description: 'Canal VIP de Alta Precisão Broadcast 2',
  },
  {
    key: 'premium',
    name: 'Premium',
    badge: 'BROADCAST 3',
    url: 'https://www.radar-aviator.com/broadcast3.php?casa=BETBRABO&_=1791308160373',
    description: 'Servidor Premium Broadcast 3',
  },
];

export function useAviatorRadar() {
  // Separate and isolated vela history for each of the 3 servers
  const [velasByServer, setVelasByServer] = useState<Record<BroadcastServerKey, Vela[]>>(() => {
    const seed1 = generateSeedVelas();
    // Distinct seed offsets for VIP and Premium so each chart starts with distinct rounds
    const seedVip = seed1.map((v, i) => ({
      ...v,
      id: v.id + 100000,
      rodada: v.rodada + 100000,
      mult: i % 8 === 0 ? Number((14.25 + (i * 2.3) % 40).toFixed(2)) : v.mult,
      class: parseVelaClass(i % 8 === 0 ? Number((14.25 + (i * 2.3) % 40).toFixed(2)) : v.mult),
    }));
    const seedPremium = seed1.map((v, i) => ({
      ...v,
      id: v.id + 200000,
      rodada: v.rodada + 200000,
      mult: i % 6 === 0 ? Number((18.5 + (i * 3.7) % 65).toFixed(2)) : v.mult,
      class: parseVelaClass(i % 6 === 0 ? Number((18.5 + (i * 3.7) % 65).toFixed(2)) : v.mult),
    }));

    return {
      aviator1: seed1,
      aviator_vip: seedVip,
      premium: seedPremium,
    };
  });

  const [activeServer, setActiveServer] = useState<BroadcastServerKey>('aviator1');
  const [now, setNow] = useState<Date>(new Date());
  const [isLiveOnline, setIsLiveOnline] = useState<boolean>(true);
  const [lastApiUpdate, setLastApiUpdate] = useState<string>('00:35:12');
  const [rawApiData, setRawApiData] = useState<any>(null);
  const [selectedHour, setSelectedHour] = useState<number>(() => new Date().getHours());
  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Live Brasilia clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Parse raw API historico into Vela[]
  const parseHistoricoToVelas = (historico: any[]): Vela[] => {
    return historico.map((h: any) => {
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
  };

  // Fetch all 3 servers simultaneously so each graph's candles stay strictly isolated
  const fetchAllBroadcasts = useCallback(async () => {
    try {
      const res = await fetch('/api/broadcasts-all');
      if (!res.ok) {
        setIsLiveOnline(false);
        return;
      }
      const json = await res.json();
      if (json.ok && json.servers) {
        setIsLiveOnline(true);

        setVelasByServer((prev) => {
          const next = { ...prev };
          const serverKeys: BroadcastServerKey[] = ['aviator1', 'aviator_vip', 'premium'];

          serverKeys.forEach((key) => {
            const serverResult = json.servers[key];
            if (serverResult?.ok && serverResult.data?.historico && Array.isArray(serverResult.data.historico)) {
              const incoming = parseHistoricoToVelas(serverResult.data.historico);
              if (incoming.length > 0) {
                // Merge without duplicates
                const existingIds = new Set(prev[key].map((v) => v.id));
                const newCandles = incoming.filter((c) => !existingIds.has(c.id));
                if (newCandles.length > 0) {
                  next[key] = [...newCandles, ...prev[key]].slice(0, 300);
                }
              }

              // Update telemetry for active server
              if (key === activeServer && serverResult.data.ts) {
                const parsed = parseTimeString(serverResult.data.ts);
                setLastApiUpdate(parsed.formatted);
                setRawApiData(serverResult.data);
              }
            }
          });

          return next;
        });
      }
    } catch {
      setIsLiveOnline(false);
    }
  }, [activeServer]);

  // Initial and periodic fetch for all servers
  useEffect(() => {
    fetchAllBroadcasts();
    const interval = setInterval(fetchAllBroadcasts, 4000);
    return () => clearInterval(interval);
  }, [fetchAllBroadcasts]);

  // Active velas array strictly for the currently selected server
  const velas = useMemo(() => {
    return velasByServer[activeServer] || [];
  }, [velasByServer, activeServer]);

  // Optional realistic simulator loop if toggled (applies to active server)
  useEffect(() => {
    if (!autoSimulate) return;
    const simInterval = setInterval(() => {
      const cur = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeFormatted = `${pad(cur.getHours())}:${pad(cur.getMinutes())}:${pad(cur.getSeconds())}`;

      const rand = Math.random();
      let mult = 1.0;
      if (rand < 0.08) {
        mult = 1.0;
      } else if (rand < 0.52) {
        mult = Number((1.01 + Math.random() * 0.98).toFixed(2));
      } else if (rand < 0.88) {
        mult = Number((2.0 + Math.random() * 7.5).toFixed(2));
      } else if (rand < 0.94) {
        mult = Number((10.0 + Math.random() * 25.0).toFixed(2));
      } else if (rand < 0.98) {
        mult = Number((50.0 + Math.random() * 45.0).toFixed(2));
      } else {
        // Vela Rosa acima de 100x (100x a 195x)
        mult = Number((100.0 + Math.random() * 95.0).toFixed(2));
      }

      const newId = Date.now();
      const t = `${cur.getFullYear()}-${pad(cur.getMonth() + 1)}-${pad(cur.getDate())} ${timeFormatted}`;
      const parsedSim = parseTimeString(t);
      const newVela: Vela = {
        id: newId,
        mult,
        class: parseVelaClass(mult),
        t,
        rodada: newId,
        timeFormatted,
        dateTimeFormatted: parsedSim.dateTimeFormatted,
        hora: cur.getHours(),
        minuto: cur.getMinutes(),
        segundo: cur.getSeconds(),
      };

      setVelasByServer((prev) => ({
        ...prev,
        [activeServer]: [newVela, ...prev[activeServer]].slice(0, 300),
      }));
    }, 12000);

    return () => clearInterval(simInterval);
  }, [autoSimulate, activeServer]);

  // Manual vela injector to test formulas on active server
  const addManualVela = useCallback(
    (mult: number, customTime?: string) => {
      const cur = new Date();
      let hora = cur.getHours();
      let minuto = cur.getMinutes();
      let segundo = cur.getSeconds();

      if (customTime) {
        const parsed = parseTimeString(customTime);
        hora = parsed.hora;
        minuto = parsed.minuto;
        segundo = parsed.segundo;
      }

      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeFormatted = `${pad(hora)}:${pad(minuto)}:${pad(segundo)}`;
      const newId = 4850000 + Math.floor(Math.random() * 9999);
      const t = `${cur.getFullYear()}-${pad(cur.getMonth() + 1)}-${pad(cur.getDate())} ${timeFormatted}`;
      const parsedManual = parseTimeString(t);

      const newVela: Vela = {
        id: newId,
        mult: Number(mult.toFixed(2)),
        class: parseVelaClass(mult),
        t,
        rodada: newId,
        timeFormatted,
        dateTimeFormatted: parsedManual.dateTimeFormatted,
        hora,
        minuto,
        segundo,
      };

      setVelasByServer((prev) => ({
        ...prev,
        [activeServer]: [newVela, ...prev[activeServer]].slice(0, 300),
      }));

      return newVela;
    },
    [activeServer]
  );

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAllBroadcasts();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [fetchAllBroadcasts]);

  // Computed metrics strictly based on the active server's velas
  const chuvaMetrics: ChuvaMetrics = useMemo(() => calculateChuvaMetrics(velas), [velas]);
  const projecoes1H: Projecao1H[] = useMemo(() => calculateProjecoes1H(velas, now), [velas, now]);
  const maxima50x: Maxima50xMetrics = useMemo(() => calculateMaxima50x(velas), [velas]);
  const { hotFinals, observationFinals } = useMemo(
    () => calculateMinutosFortes(velas, selectedHour),
    [velas, selectedHour]
  );
  const confirmacoesRosas: ConfirmacaoRosa[] = useMemo(() => calculateSomas(velas, now), [velas, now]);
  const paresSomas: ParSomasVela[] = useMemo(() => calculateParesSomas(velas, now), [velas, now]);

  const padroesRepeticao = useMemo(() => calculatePadroesRepeticao(velas), [velas]);
  const velasRosasConfirmadas = useMemo(() => calculateVelasRosasConfirmadas(velas, now), [velas, now]);
  const maxima50xDetalhado = useMemo(() => calculateMaxima50xDetalhado(velas), [velas]);
  const minutagemMaisFrequente = useMemo(() => calculateMinutagemMaisFrequente(velas, now), [velas, now]);

  // Formatted Brasilia Clock
  const clockString = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }, [now]);

  return {
    velas,
    velasByServer,
    activeServer,
    setActiveServer,
    servers: SERVERS_INFO,
    now,
    clockString,
    isLiveOnline,
    lastApiUpdate,
    rawApiData,
    selectedHour,
    setSelectedHour,
    autoSimulate,
    setAutoSimulate,
    isRefreshing,
    refreshData,
    addManualVela,
    chuvaMetrics,
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
  };
}
