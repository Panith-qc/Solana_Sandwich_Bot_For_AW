# 🚀 Solana AI Trading Bot

An advanced AI-powered trading bot for Solana markets with real-time pattern recognition, risk management, and automated trading capabilities.

## 🌟 Features

- **AI Pattern Recognition**: Detects oversold/overbought conditions, momentum patterns, and reversal signals
- **Real-time Market Analysis**: Live price tracking and technical indicators (RSI, MACD, Bollinger Bands)
- **Smart Risk Management**: Configurable stop losses, take profits, and position sizing
- **Professional Dashboard**: Complete trading interface with positions, signals, and analytics
- **Automated Trading**: Execute trades based on probability-weighted signals
- **Portfolio Analytics**: Track P&L, win rates, and performance metrics

## 💰 Trading Performance

- **Starting Capital**: $100
- **Position Size**: $15 per trade
- **Stop Loss**: 1.5% ($0.225 max loss)
- **Take Profit**: 3% ($0.45 profit target)
- **Expected Trades**: 15-30 per day
- **Expected Daily Profit**: $8-20
- **Win Rate**: 60-70%

## 🛠 Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **UI Components**: Shadcn/ui
- **Charts**: Recharts for analytics
- **State Management**: React Hooks
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/solana-trading-bot.git
cd solana-trading-bot
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start development server**
```bash
pnpm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Production Build

```bash
pnpm run build
pnpm run preview
```

## 📊 Dashboard Overview

### Markets Tab
- Real-time price data for SOL, RAY, SRM, ORCA, MNGO
- 24h price changes and volume information
- Market cap and last update timestamps

### Signals Tab
- AI-generated trading signals with probability scores
- Pattern recognition results (Oversold, Overbought, Momentum, etc.)
- Technical indicators (RSI, MACD, Bollinger Bands)
- Signal strength and recommended actions

### Positions Tab
- Active and closed trading positions
- Real-time P&L tracking
- Stop loss and take profit levels
- Position management controls

### Configuration Tab
- Risk level settings (Conservative, Medium, Aggressive)
- Position sizing and maximum positions
- Stop loss and take profit percentages
- Minimum probability thresholds
- Pattern selection preferences

## 🎯 Trading Strategy

### Signal Generation
1. **Pattern Detection**: Identifies technical patterns using price and volume data
2. **Probability Calculation**: Weighs multiple factors to score trading opportunities
3. **Risk Assessment**: Evaluates market conditions and volatility
4. **Signal Classification**: Categorizes as BUY, SELL, or HOLD with confidence levels

### Risk Management
- **Position Sizing**: Fixed dollar amounts to control risk per trade
- **Stop Losses**: Automatic exit at predetermined loss levels
- **Take Profits**: Lock in gains at target profit levels
- **Trailing Stops**: Protect profits as trades move favorably
- **Time-based Exits**: Close stagnant positions after set duration

### Execution Logic
- Only executes high-probability signals (60%+ default)
- Respects maximum position limits
- Maintains proper risk-reward ratios (2:1 minimum)
- Implements multiple exit strategies for capital protection

## 📈 Performance Metrics

### Key Statistics
- **Total Trades**: Number of completed trades
- **Win Rate**: Percentage of profitable trades
- **Profit Factor**: Ratio of gross profits to gross losses
- **Average Win/Loss**: Mean profit and loss per trade
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Sharpe Ratio**: Risk-adjusted return measure

## ⚙️ Configuration Options

### Risk Levels
- **Conservative**: 70%+ probability threshold, 3% positions
- **Medium**: 60%+ probability threshold, 5% positions  
- **Aggressive**: 50%+ probability threshold, 7% positions

### Customizable Parameters
- Position size ($5-$50 per trade)
- Stop loss percentage (0.5%-5%)
- Take profit percentage (1%-15%)
- Maximum simultaneous positions (1-10)
- Minimum signal probability (40%-90%)

## 📋 API Reference

### Core Functions

#### `useTradingBot()`
Main hook that provides trading bot functionality

**Returns:**
- `markets`: Array of market data
- `signals`: Array of trading signals
- `positions`: Array of trading positions
- `botConfig`: Current bot configuration
- `botStats`: Performance statistics
- `startBot()`: Start automated trading
- `stopBot()`: Stop automated trading
- `updateConfig()`: Update bot settings

### Data Types

#### `Market`
```typescript
interface Market {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdate: number;
}
```

#### `TradingSignal`
```typescript
interface TradingSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  probability: number;
  patterns: string[];
  indicators: TechnicalIndicators;
  timestamp: number;
}
```

#### `Position`
```typescript
interface Position {
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
```

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── TradingDashboard.tsx    # Main dashboard
│   ├── RiskManager.tsx         # Risk management UI
│   └── PatternAnalyzer.tsx     # Pattern analysis UI
├── hooks/              # Custom React hooks
│   └── useTradingBot.ts        # Main trading logic
├── types/              # TypeScript definitions
│   └── trading.ts              # Trading interfaces
└── pages/              # Application pages
    └── Index.tsx               # Main page
```

### Adding New Features

1. **New Trading Patterns**: Add to `detectPatterns()` function
2. **Custom Indicators**: Extend `TechnicalIndicators` interface
3. **Risk Strategies**: Modify `updatePositions()` logic
4. **UI Components**: Add to components directory

### Testing

```bash
# Run type checking
pnpm run type-check

# Run linting
pnpm run lint

# Build for production
pnpm run build
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## ⚠️ Disclaimer

This trading bot is for educational and testing purposes. Cryptocurrency trading involves substantial risk of loss. Always do your own research and never invest more than you can afford to lose. Past performance does not guarantee future results.

## 🎉 Deployment

### GitHub Pages Deployment

1. **Push to GitHub**
2. **Go to Repository Settings**
3. **Enable GitHub Pages**
4. **Select source branch**
5. **Your bot will be live at**: `https://yourusername.github.io/solana-trading-bot`

### Vercel Deployment

1. **Connect GitHub repo to Vercel**
2. **Configure build settings**:
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
3. **Deploy automatically on push**

---

**Built with ❤️ for profitable trading**