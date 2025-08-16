export interface Market {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdate: number;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  strength: number; // 0-100
  probability: number; // 0-100
  patterns: string[];
  indicators: {
    rsi: number;
    macd: number;
    bollinger: 'UPPER' | 'MIDDLE' | 'LOWER';
    volume: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  timestamp: number;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
  status: 'OPEN' | 'CLOSED';
  stopLoss?: number;
  takeProfit?: number;
}

export interface BotConfig {
  enabled: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  maxPositions: number;
  positionSize: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  minProbability: number;
  holdThreshold: number;
  patterns: {
    bullishEngulfing: boolean;
    bearishEngulfing: boolean;
    doji: boolean;
    hammer: boolean;
    shootingStar: boolean;
    triangles: boolean;
    doubleTop: boolean;
    doubleBottom: boolean;
  };
}

export interface BotStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
}