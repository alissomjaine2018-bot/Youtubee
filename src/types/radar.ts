export type VelaClass = 'azul' | 'roxa' | 'rosa' | 'rosa50';

export interface Vela {
  id: number;
  mult: number;
  class: VelaClass;
  t: string; // "YYYY-MM-DD HH:MM:SS"
  rodada: number;
  timeFormatted: string; // "HH:MM:SS"
  dateTimeFormatted: string; // "09/11 08:19:42"
  hora: number;
  minuto: number;
  segundo: number;
}

export interface Projecao1H {
  id: string;
  rodada: number;
  multiplicador: number;
  originalTime: string; // "HH:MM:SS"
  originalTimestamp: number;
  projecaoTime: string; // "HH:MM:SS" (+1 hour)
  projecaoTimestamp: number;
  status: 'aguardando' | 'green' | 'red';
  probabilidade: number;
  countdown: string; // "MM:SS"
  countdownSeconds: number;
  resultadoMult?: number;
  // Somas dos dois segundos desta vela
  somaPrimeiroSegundo?: {
    segundo: number;
    minutoAlvo: string;
    formula: string;
  };
  somaSegundoSegundo?: {
    segundo: number;
    minutoAlvo: string;
    formula: string;
  };
}

export interface SomaOrigem {
  velaId: number;
  velaMult: number;
  originalTime: string;
  tipo: '10x' | '1.00x' | '100x';
  formula: string; // e.g. "40 + 2 = 42" or "Minuto 25 + Dígitos (1+2+5=8) = 33" or "Minuto 25 + 30 min = 55"
  digitoSegundo?: number;
  tipoSegundo?: '1º segundo' | '2º segundo' | 'ambos' | 'vela100x' | 'soma_digitos' | 'minuto_mais_30';
  estrategia100x?: 'soma_digitos' | 'minuto_mais_30';
}

export interface ConfirmacaoRosa {
  id: string;
  hora: number;
  minuto: number;
  formattedTime: string; // "00:42"
  totalConfirmacoes: number;
  origens: SomaOrigem[];
  status: 'pendente' | 'confirmada' | 'expirada';
  probabilidade: number;
  resultadoMult?: number;
  resultadoTipo?: 'rosa' | 'roxa' | 'azul';
  resultadoTexto?: string;
  momentoAlvo: number; // timestamp in ms
  contemPrimeiroSegundo: boolean;
  contemSegundoSegundo: boolean;
  temVela100x?: boolean;
  detalhe100x?: {
    velaMult: number;
    horarioOriginal: string;
    minutoOrigem: number;
    formula: string;
  };
}

export interface ParSomasVela {
  id: string;
  velaId: number;
  velaMult: number;
  tipo: '10x' | '1.00x';
  horarioOriginal: string; // "00:40:27"
  hora: number;
  minuto: number;
  segundo: number;
  digito1: number; // 2
  digito2: number; // 7
  soma1: {
    minutoAlvo: number;
    horarioAlvo: string; // "00:42"
    formula: string; // "40 + 2 = 42"
    status: 'pendente' | 'green' | 'red';
    resultadoMult?: number;
  };
  soma2: {
    minutoAlvo: number;
    horarioAlvo: string; // "00:47"
    formula: string; // "40 + 7 = 47"
    status: 'pendente' | 'green' | 'red';
    resultadoMult?: number;
  };
  somaAmbos: {
    minutoAlvo: number;
    horarioAlvo: string; // "00:49"
    formula: string; // "40 + (2+7) = 49"
    status: 'pendente' | 'green' | 'red';
    resultadoMult?: number;
  };
  statusGeral: 'pendente' | 'green' | 'red';
}

export interface FinalGroup {
  finalDigit: number;
  title: string;
  confirmacoesCount: number;
  isHot: boolean; // >= 2 confirms
  minutos: Array<{
    minuto: number;
    minutoStr: string; // "02", "12", ...
    status: 'confirmada' | 'alvo' | 'observacao' | 'neutro';
    mult?: number;
    count: number;
  }>;
}

export interface ChuvaMetrics {
  probabilidade: number;
  mercadoStatus: string;
  chanceExplosao: number;
  forcaGrafico: number;
  pressaoAcumulada: number;
  frequenciaRosas: number;
  scoreIA: number;
  nivelConfianca: number;
  desdeUltima: number;
  gapMedio: number;
  densidade10x: number;
  densidade50x: number;
  maxRecente: number;
  clusterProximidade: number;
  criterios: Array<{
    id: string;
    label: string;
    atingido: boolean;
    destaqueRoxo?: boolean;
  }>;
}

export interface Maxima50xMetrics {
  temperatura: number; // 0 to 100
  faixa: 'Frio' | 'Morno' | 'Quente' | 'Explodindo';
  desdeUltima50x: number;
  mediaRodadas: number;
  gapRatio: number;
  densidade10x: number;
  maxRecente: number;
  velasSem50x: number;
  ultimas10x: Array<{
    mult: number;
    time: string;
    rodada: number;
  }>;
}

export type BroadcastServerKey = 'aviator1' | 'aviator_vip' | 'premium';

export interface BroadcastServerInfo {
  key: BroadcastServerKey;
  name: string;
  badge: string;
  url: string;
  description: string;
}

export interface PadraoRepeticao {
  id: string;
  casa: number; // 1 to 10, or >10
  casaLabel: string; // "1ª Casa", "2ª Casa", "3ª Casa", ...
  velaOrigem: {
    mult: number;
    time: string;
    id: number;
  };
  velaConfirmada: {
    mult: number;
    time: string;
    id: number;
  };
  distanciaVelas: number; // quantas velas entre elas
  tempoMinutos: number;
  horarioConfirmado: string;
}

export interface EstatisticaRepeticao {
  casa: number;
  casaLabel: string;
  totalOcorrencias: number;
  percentual: number;
  posicaoRanking: number;
  exemploRecente?: string;
}

export interface GatilhoEstrategia {
  id: string;
  nome: string;
  descricao: string;
  exemplo: string;
  casaPadrao: string;
}

export interface EstrategiaAcionada {
  nome: string;
  formula: string;
  casa: number; // 1 to 11
  velasGatilho: string;
  tipo: string;
}

export interface VelaRosaConfirmada {
  id: string;
  velaRosa: {
    id: number;
    mult: number;
    time: string;
    rodada: number;
    hora: number;
    minuto: number;
    segundo: number;
  };
  estrategiaPrincipal: string;
  estrategiasDetalhadas: EstrategiaAcionada[];
  casaPagamento: number; // 1ª a 11ª casa
  horario: string;
  assertividadeScore: number;
}

export interface SequenciaRosaConsecutiva {
  id: string;
  velaGatilhoPrevia: {
    mult: number;
    time: string;
    class: VelaClass;
    tipo: string;
  };
  rosas: Array<{
    mult: number;
    time: string;
    ordem: number;
  }>;
  totalRosas: number;
  padraoNome: string;
  padraoDescricao: string;
  assertividade: number;
  horario: string;
}

export interface AnaliseRosasConsecutivas {
  totalSequencias24h: number;
  duplasRosasCount: number;
  triplasRosasCount: number;
  assertividadeGeral: number;
  gatilhosMaisFrequentes: Array<{
    gatilho: string;
    total: number;
    percentual: number;
    exemplo: string;
  }>;
  sequenciasDetectadas: SequenciaRosaConsecutiva[];
  padroesChave: Array<{
    titulo: string;
    descricao: string;
    frequencia: string;
    assertividade: string;
    tag: string;
    gatilhoExemplo: string;
  }>;
}

export interface MinutagemVelaEspecial {
  id: string;
  hora: number;
  minuto: number;
  horarioStr: string;
  status: 'pendente' | 'confirmada' | 'expirada';
  isCurrentMinute: boolean;
  isPast: boolean;
  isActive: boolean;
  diffMinutes: number;
  momentoAlvo: number;
  assertividadeScore: number;
  totalConfirmacoes: number;
  estrategiaPrincipal: string;
  estrategiasConfirmadas: Array<{
    nome: string;
    formula: string;
    casa: number;
    velasGatilho: string;
    tipo: string;
  }>;
  resultado?: {
    tipo: 'rosa' | 'roxa' | 'azul';
    mult: number;
    texto: string;
  };
}

export interface MinutoFrequenteItem {
  ranking: number;
  minuto: number; // 0 to 59
  minutoStr: string; // "Minuto 16"
  minutoPad: string; // "16"
  totalVelas: number; // 11 velas
  percentual: number; // 24.4%
  velas: Array<{
    id: number;
    mult: number;
    timeFormatted: string;
    rodada: number;
  }>;
  isProximo: boolean;
  diffMinutos: number;
  horariosRepetidos?: string[];
  consecutivasMax?: number;
  maiorMult?: number;
}

export interface FinalMinutoItem {
  ranking: number;
  digitoFinal: number; // 0 to 9
  label: string; // "Final 6"
  minutosCompreendidos: string; // ":06, :16, :26, :36, :46, :56"
  totalVelas: number;
  percentual: number;
  minutoMaisForte: number;
  velas: Array<{
    id: number;
    mult: number;
    timeFormatted: string;
  }>;
}

export interface HorarioRepetidoItem {
  ranking: number;
  horario: string; // "14:16"
  hora: number;
  minuto: number;
  repeticoes: number; // total de velas rosas saídas neste mesmo horário
  percentual: number;
  maiorMult: number;
  velas: Array<{
    id: number;
    mult: number;
    timeFormatted: string;
    rodada: number;
  }>;
}

export interface MinutagemConsecutivaItem {
  ranking: number;
  minuto: number;
  minutoStr: string;
  consecutivasMax: number; // Maior sequência de rosas consecutivas no mesmo minuto ou contíguo
  totalVelas: number;
  detalheHorarios: string;
  maiorMult: number;
  velas: Array<{
    id: number;
    mult: number;
    timeFormatted: string;
    rodada: number;
  }>;
}

export interface FaixaHorariaItem {
  hora: number;
  faixa: string; // "14:00 às 14:59"
  totalRosas: number;
  percentual: number;
  minutosMaisFortes: string;
}

export interface AnaliseMinutagemFrequente {
  totalRosasAnalisadas: number;
  rankingMinutos: MinutoFrequenteItem[];
  rankingFinais: FinalMinutoItem[];
  todosMinutos00a59: MinutoFrequenteItem[];
  minutoMaisFrequente?: MinutoFrequenteItem;
  finalMaisFrequente?: FinalMinutoItem;
  proximoMinutoQuente?: MinutoFrequenteItem;
  horariosMaisRepetidos: HorarioRepetidoItem[];
  minutagensConsecutivas: MinutagemConsecutivaItem[];
  faixasHorarias: FaixaHorariaItem[];
  horarioTopRepetido?: HorarioRepetidoItem;
  consecutivaTop?: MinutagemConsecutivaItem;
}



