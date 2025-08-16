export interface MempoolTransaction {
  signature: string;
  slot: number;
  timestamp: number;
  accounts: string[];
  programId: string;
  amount: number;
  tokenMint: string;
  type: 'SWAP' | 'LIQUIDITY' | 'TRANSFER';
  estimatedPriceImpact: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SandwichOpportunity {
  id: string;
  targetTx: MempoolTransaction;
  tokenPair: {
    tokenA: string;
    tokenB: string;
    symbol: string;
  };
  estimatedProfit: number;
  profitPercent: number;
  frontRunPrice: number;
  backRunPrice: number;
  gasEstimate: number;
  confidence: number;
  timeWindow: number; // milliseconds
  status: 'DETECTED' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

export interface SandwichPosition {
  id: string;
  opportunityId: string;
  frontRunTx?: string;
  backRunTx?: string;
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  token: string;
  profit: number;
  gasUsed: number;
  netProfit: number;
  timestamp: number;
  status: 'PENDING' | 'FRONT_RUN_SENT' | 'BACK_RUN_SENT' | 'COMPLETED' | 'FAILED';
}

export interface SandwichConfig {
  enabled: boolean;
  capital: number; // Available capital for sandwich trades
  minProfitThreshold: number; // Minimum profit in SOL to execute
  maxGasPrice: number; // Maximum gas price to pay
  slippageTolerance: number; // Max slippage %
  maxPositionSize: number; // Max % of capital per trade
  targetTokens: string[]; // Tokens to monitor
  dexPrograms: string[]; // DEX program IDs to monitor
  rpcEndpoint: string;
  priorityFee: number; // Priority fee in microlamports
}

export interface SandwichStats {
  totalOpportunities: number;
  executedSandwiches: number;
  successfulSandwiches: number;
  totalProfit: number;
  totalGasSpent: number;
  netProfit: number;
  successRate: number;
  avgProfitPerTrade: number;
  lastUpdateTime: number;
}

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  volume24h: number;
  liquidity: number;
  isActive: boolean;
}

export interface DEXPool {
  address: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  reserveA: number;
  reserveB: number;
  fee: number;
  dexName: string;
  lastUpdate: number;
}

export interface MevMetrics {
  blockHeight: number;
  mempoolSize: number;
  avgGasPrice: number;
  competitorBots: number;
  networkCongestion: 'LOW' | 'MEDIUM' | 'HIGH';
  profitableOpportunities: number;
  lastScanTime: number;
}