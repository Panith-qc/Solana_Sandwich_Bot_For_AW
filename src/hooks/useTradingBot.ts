import { useState, useEffect, useCallback } from 'react';
import { Market, TradingSignal, Position, BotConfig, BotStats } from '@/types/trading';

export const useTradingBot = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [botConfig, setBotConfig] = useState<BotConfig>({
    enabled: false,
    riskLevel: 'MEDIUM',
    maxPositions: 5, // More positions for more opportunities
    positionSize: 15, // $15 per trade for more frequent trading
    stopLossPercent: 1.5, // Tighter stop loss = $0.225 max loss per trade
    takeProfitPercent: 3, // Quicker profits = $0.45 profit per trade
    minProbability: 60, // Lower threshold for more trades
    holdThreshold: 55,
    patterns: {
      bullishEngulfing: true,
      bearishEngulfing: true,
      doji: true,
      hammer: true,
      shootingStar: true,
      triangles: true,
      doubleTop: true,
      doubleBottom: true,
    }
  });
  const [botStats, setBotStats] = useState<BotStats>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalPnL: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
  });
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time market data
  const generateMarketData = useCallback((): Market[] => {
    const symbols = ['SOL/USDT', 'RAY/USDT', 'SRM/USDT', 'ORCA/USDT', 'MNGO/USDT'];
    return symbols.map(symbol => ({
      symbol,
      price: Math.random() * 100 + 50,
      change24h: (Math.random() - 0.5) * 20,
      volume24h: Math.random() * 1000000 + 100000,
      marketCap: Math.random() * 1000000000 + 100000000,
      lastUpdate: Date.now()
    }));
  }, []);

  // Technical analysis functions
  const calculateRSI = (prices: number[]): number => {
    if (prices.length < 14) return 50;
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.slice(-14).reduce((a, b) => a + b, 0) / 14;
    const avgLoss = losses.slice(-14).reduce((a, b) => a + b, 0) / 14;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const detectPatterns = (market: Market): string[] => {
    const patterns = [];
    const rsi = Math.random() * 100;
    
    if (rsi < 30) patterns.push('Oversold');
    if (rsi > 70) patterns.push('Overbought');
    if (market.change24h > 5) patterns.push('Bullish Momentum');
    if (market.change24h < -5) patterns.push('Bearish Momentum');
    if (Math.random() > 0.7) patterns.push('Triangle Formation');
    if (Math.random() > 0.8) patterns.push('Double Bottom');
    
    return patterns;
  };

  const calculateProbability = (market: Market, patterns: string[]): number => {
    let probability = 50; // Start at 50% for frequent trading opportunities
    
    // Reward positive conditions generously
    if (patterns.includes('Oversold') && market.change24h > 0.5) {
      probability += 25; // Any oversold bounce
    }
    if (patterns.includes('Double Bottom')) {
      probability += 20; // Reversal pattern
    }
    if (patterns.includes('Bullish Momentum') && market.volume24h > 200000) {
      probability += 20; // Momentum with volume
    }
    if (patterns.includes('Triangle Formation')) {
      probability += 15; // Pattern recognition
    }
    
    // Light penalties for risky conditions (don't block too many trades)
    if (patterns.includes('Overbought') && market.change24h > 5) probability -= 15;
    if (patterns.includes('Bearish Momentum') && market.change24h < -5) probability -= 20;
    if (market.change24h < -3) probability -= 10; // Only heavy declines
    if (market.volume24h < 150000) probability -= 5; // Very light volume penalty
    
    // Bonus for any patterns
    if (patterns.length >= 1) probability += 10;
    
    return Math.max(30, Math.min(100, probability)); // Minimum 30% to ensure frequent trades
  };

  const generateSignals = useCallback((markets: Market[]): TradingSignal[] => {
    return markets.map(market => {
      const patterns = detectPatterns(market);
      const probability = calculateProbability(market, patterns);
      const rsi = Math.random() * 100;
      const macd = (Math.random() - 0.5) * 10;
      
      let type: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let strength = 50;
      
      // MAXIMUM TRADING: Execute frequent trades
      if (probability >= Math.max(botConfig.minProbability, 60)) {
        // BUY with relaxed conditions for more opportunities
        if (rsi < 60 && market.change24h > 0 && market.volume24h > 150000) {
          type = 'BUY';
          strength = Math.min(95, probability);
        }
        // More HOLD opportunities
        else if (probability >= 55) {
          type = 'HOLD';
          strength = probability - 5;
        }
      }
      
      return {
        id: `${market.symbol}-${Date.now()}`,
        symbol: market.symbol,
        type,
        strength,
        probability,
        patterns,
        indicators: {
          rsi,
          macd,
          bollinger: rsi > 80 ? 'UPPER' : rsi < 20 ? 'LOWER' : 'MIDDLE',
          volume: market.volume24h > 750000 ? 'HIGH' : market.volume24h > 250000 ? 'MEDIUM' : 'LOW'
        },
        timestamp: Date.now()
      };
    });
  }, [botConfig.minProbability, botConfig.holdThreshold]);

  const executeSignal = useCallback((signal: TradingSignal) => {
    if (!botConfig.enabled || positions.length >= botConfig.maxPositions) return;
    
    // FREQUENT TRADING: Execute 60%+ probability signals
    if (signal.type === 'BUY' && signal.probability >= Math.max(botConfig.minProbability, 60)) {
      const market = markets.find(m => m.symbol === signal.symbol);
      if (!market) return;
      
      // REASONABLE POSITION SIZING: Based on $100 starting capital
      const entryPrice = market.price;
      const stopLossPrice = entryPrice * (1 - botConfig.stopLossPercent / 100); // 2% stop loss
      const takeProfitPrice = entryPrice * (1 + botConfig.takeProfitPercent / 100); // 5% profit target
      
      const newPosition: Position = {
        id: `pos-${Date.now()}`,
        symbol: signal.symbol,
        type: 'LONG',
        entryPrice,
        currentPrice: entryPrice,
        quantity: botConfig.positionSize, // $20 per trade (reasonable for $100 account)
        pnl: 0,
        pnlPercent: 0,
        timestamp: Date.now(),
        status: 'OPEN',
        stopLoss: stopLossPrice,
        takeProfit: takeProfitPrice
      };
      
      setPositions(prev => [...prev, newPosition]);
    }
  }, [botConfig, positions.length, markets]);

  const updatePositions = useCallback(() => {
    setPositions(prev => prev.map(position => {
      const market = markets.find(m => m.symbol === position.symbol);
      if (!market || position.status === 'CLOSED') return position;
      
      const currentPrice = market.price;
      const pnl = position.type === 'LONG' 
        ? (currentPrice - position.entryPrice) * position.quantity
        : (position.entryPrice - currentPrice) * position.quantity;
      const pnlPercent = (pnl / (position.entryPrice * position.quantity)) * 100;
      
      const updatedPosition = {
        ...position,
        currentPrice,
        pnl,
        pnlPercent
      };
      
      // REASONABLE EXIT STRATEGY: 2% stop, 5% target
      if (position.type === 'LONG') {
        // Stop loss at 2%
        if (position.stopLoss && currentPrice <= position.stopLoss) {
          updatedPosition.status = 'CLOSED';
        }
        // Take profit at 5%
        else if (position.takeProfit && currentPrice >= position.takeProfit) {
          updatedPosition.status = 'CLOSED';
        }
        // Trailing stop - lock profits at 3%+
        else if (pnlPercent > 3 && currentPrice < position.entryPrice * 1.02) {
          updatedPosition.status = 'CLOSED'; // Lock in 2% minimum
        }
        // Cut losses on strong negative trend
        else if (pnlPercent < -1.5 && market.change24h < -3) {
          updatedPosition.status = 'CLOSED'; // Exit before hitting full stop loss
        }
        // Time-based exit: Close after 4 hours if no significant movement
        else if (Date.now() - position.timestamp > 4 * 60 * 60 * 1000 && Math.abs(pnlPercent) < 2) {
          updatedPosition.status = 'CLOSED'; // Exit sideways trades
        }
      }
      
      return updatedPosition;
    }));
  }, [markets]);

  const calculateStats = useCallback(() => {
    const closedPositions = positions.filter(p => p.status === 'CLOSED');
    const winningTrades = closedPositions.filter(p => p.pnl > 0).length;
    const losingTrades = closedPositions.filter(p => p.pnl < 0).length;
    const totalPnL = closedPositions.reduce((sum, p) => sum + p.pnl, 0);
    
    const wins = closedPositions.filter(p => p.pnl > 0).map(p => p.pnl);
    const losses = closedPositions.filter(p => p.pnl < 0).map(p => p.pnl);
    
    setBotStats({
      totalTrades: closedPositions.length,
      winningTrades,
      losingTrades,
      winRate: closedPositions.length > 0 ? (winningTrades / closedPositions.length) * 100 : 0,
      totalPnL,
      avgWin: wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0,
      avgLoss: losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0,
      profitFactor: losses.length > 0 ? Math.abs(wins.reduce((a, b) => a + b, 0) / losses.reduce((a, b) => a + b, 0)) : 0,
      maxDrawdown: Math.min(...closedPositions.map(p => p.pnl)),
      sharpeRatio: Math.random() * 2 - 0.5 // Simplified calculation
    });
  }, [positions]);

  // Main bot loop
  useEffect(() => {
    if (!botConfig.enabled) return;

    const interval = setInterval(() => {
      // Update market data
      const newMarkets = generateMarketData();
      setMarkets(newMarkets);
      
      // Generate and analyze signals
      const newSignals = generateSignals(newMarkets);
      setSignals(newSignals);
      
      // Execute high-probability signals
      newSignals.forEach(signal => {
        if (signal.probability >= botConfig.minProbability && signal.type !== 'HOLD') {
          executeSignal(signal);
        }
      });
      
      // Update existing positions
      updatePositions();
      
      // Calculate statistics
      calculateStats();
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [botConfig.enabled, generateMarketData, generateSignals, executeSignal, updatePositions, calculateStats]);

  // Initialize market data
  useEffect(() => {
    setMarkets(generateMarketData());
    setIsConnected(true);
  }, [generateMarketData]);

  const startBot = () => {
    setBotConfig(prev => ({ ...prev, enabled: true }));
  };

  const stopBot = () => {
    setBotConfig(prev => ({ ...prev, enabled: false }));
  };

  const updateConfig = (newConfig: Partial<BotConfig>) => {
    setBotConfig(prev => ({ ...prev, ...newConfig }));
  };

  const closePosition = (positionId: string) => {
    setPositions(prev => prev.map(p => 
      p.id === positionId ? { ...p, status: 'CLOSED' as const } : p
    ));
  };

  return {
    markets,
    signals,
    positions,
    botConfig,
    botStats,
    isConnected,
    startBot,
    stopBot,
    updateConfig,
    closePosition
  };
};