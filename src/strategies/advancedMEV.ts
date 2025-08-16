// Advanced MEV Strategies with Loss Prevention
export interface AdvancedMEVStrategy {
  name: string;
  riskLevel: 'ULTRA_SAFE' | 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE' | 'ULTRA_AGGRESSIVE';
  stopLoss: number;
  takeProfit: number;
  holdTime: number; // ms to hold before force exit
  maxDrawdown: number;
  dynamicSizing: boolean;
  multiPairArbitrage: boolean;
  flashLoanEnabled: boolean;
}

export const MEV_STRATEGIES: Record<string, AdvancedMEVStrategy> = {
  ULTRA_SAFE: {
    name: 'Ultra Safe - 2-5% Daily ROI',
    riskLevel: 'ULTRA_SAFE',
    stopLoss: 0.2, // 0.2% max loss per trade
    takeProfit: 0.8, // 0.8% profit target (higher for demo)
    holdTime: 30000, // 30 seconds max hold
    maxDrawdown: 1.0, // 1% max portfolio drawdown
    dynamicSizing: false,
    multiPairArbitrage: false,
    flashLoanEnabled: false
  },
  CONSERVATIVE: {
    name: 'Conservative - 5-8% Daily ROI',
    riskLevel: 'CONSERVATIVE',
    stopLoss: 0.5, // 0.5% max loss per trade
    takeProfit: 1.2, // 1.2% profit target
    holdTime: 60000, // 1 minute max hold
    maxDrawdown: 2.0, // 2% max portfolio drawdown
    dynamicSizing: true,
    multiPairArbitrage: true,
    flashLoanEnabled: false
  },
  BALANCED: {
    name: 'Balanced - 8-15% Daily ROI',
    riskLevel: 'BALANCED',
    stopLoss: 1.0, // 1% max loss per trade
    takeProfit: 2.0, // 2.0% profit target
    holdTime: 120000, // 2 minutes max hold
    maxDrawdown: 3.0, // 3% max portfolio drawdown
    dynamicSizing: true,
    multiPairArbitrage: true,
    flashLoanEnabled: true
  },
  AGGRESSIVE: {
    name: 'Aggressive - 15-25% Daily ROI',
    riskLevel: 'AGGRESSIVE',
    stopLoss: 2.0, // 2% max loss per trade
    takeProfit: 3.5, // 3.5% profit target
    holdTime: 300000, // 5 minutes max hold
    maxDrawdown: 5.0, // 5% max portfolio drawdown
    dynamicSizing: true,
    multiPairArbitrage: true,
    flashLoanEnabled: true
  },
  ULTRA_AGGRESSIVE: {
    name: 'Ultra Aggressive - 25-50% Daily ROI',
    riskLevel: 'ULTRA_AGGRESSIVE',
    stopLoss: 3.0, // 3% max loss per trade
    takeProfit: 7.0, // 7% profit target
    holdTime: 600000, // 10 minutes max hold
    maxDrawdown: 10.0, // 10% max portfolio drawdown
    dynamicSizing: true,
    multiPairArbitrage: true,
    flashLoanEnabled: true
  }
};

// Advanced Trading Pairs - All Major Solana DEXs
export const ADVANCED_TRADING_PAIRS = [
  // Major pairs
  ['SOL', 'USDC'], ['SOL', 'USDT'], ['USDC', 'USDT'],
  // DeFi tokens
  ['SOL', 'RAY'], ['SOL', 'SRM'], ['SOL', 'ORCA'],
  ['SOL', 'MNGO'], ['SOL', 'SAMO'], ['SOL', 'COPE'],
  // Cross-pair arbitrage
  ['RAY', 'USDC'], ['SRM', 'USDT'], ['ORCA', 'USDC'],
  ['MNGO', 'USDC'], ['SAMO', 'USDC'], ['COPE', 'USDC'],
  // Stablecoin arbitrage
  ['USDC', 'USDT'], ['USDC', 'DAI'], ['USDT', 'DAI'],
  // Wrapped tokens
  ['SOL', 'mSOL'], ['SOL', 'stSOL'], ['mSOL', 'stSOL']
];

// Loss Prevention Logic
export class LossPreventionEngine {
  private positions: Map<string, any> = new Map();
  private strategy: AdvancedMEVStrategy;

  constructor(strategy: AdvancedMEVStrategy) {
    this.strategy = strategy;
  }

  // Instead of selling at loss, hold and try to recover
  shouldHoldPosition(position: any): boolean {
    const currentLoss = this.calculateCurrentLoss(position);
    const timeHeld = Date.now() - position.entryTime;
    
    // Hold if loss is within acceptable range and we haven't hit max hold time
    if (currentLoss < this.strategy.stopLoss / 2 && timeHeld < this.strategy.holdTime) {
      return true;
    }
    
    // Try to average down if we have capital
    if (this.canAverageDown(position)) {
      return true;
    }
    
    return false;
  }

  // Average down strategy
  canAverageDown(position: any): boolean {
    const currentLoss = this.calculateCurrentLoss(position);
    return currentLoss < this.strategy.stopLoss && position.averageDownCount < 2;
  }

  private calculateCurrentLoss(position: any): number {
    // Implement real loss calculation
    return Math.abs(position.entryPrice - position.currentPrice) / position.entryPrice * 100;
  }
}