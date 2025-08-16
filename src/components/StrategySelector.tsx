import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MEV_STRATEGIES } from '@/strategies/advancedMEV';
import { TrendingUp, Shield, Zap, Target, Clock, DollarSign } from 'lucide-react';

interface StrategySelectorProps {
  selectedStrategy: string;
  onStrategyChange: (strategy: string) => void;
}

export default function StrategySelector({ selectedStrategy, onStrategyChange }: StrategySelectorProps) {
  const strategy = MEV_STRATEGIES[selectedStrategy];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'ULTRA_SAFE': return 'text-green-400 border-green-500/20 bg-green-950/20';
      case 'CONSERVATIVE': return 'text-blue-400 border-blue-500/20 bg-blue-950/20';
      case 'BALANCED': return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
      case 'AGGRESSIVE': return 'text-orange-400 border-orange-500/20 bg-orange-950/20';
      case 'ULTRA_AGGRESSIVE': return 'text-red-400 border-red-500/20 bg-red-950/20';
      default: return 'text-gray-400 border-gray-500/20 bg-gray-950/20';
    }
  };

  const getRiskScore = (riskLevel: string) => {
    switch (riskLevel) {
      case 'ULTRA_SAFE': return 20;
      case 'CONSERVATIVE': return 35;
      case 'BALANCED': return 50;
      case 'AGGRESSIVE': return 75;
      case 'ULTRA_AGGRESSIVE': return 95;
      default: return 50;
    }
  };

  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-400" />
          Advanced MEV Strategy Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Choose Your Strategy:</label>
          <Select value={selectedStrategy} onValueChange={onStrategyChange}>
            <SelectTrigger className="bg-black/60 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-600">
              {Object.entries(MEV_STRATEGIES).map(([key, strat]) => (
                <SelectItem key={key} value={key} className="text-white">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRiskColor(strat.riskLevel)}>
                      {strat.riskLevel.replace('_', ' ')}
                    </Badge>
                    {strat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Strategy Details */}
        <div className={`p-4 rounded-lg border ${getRiskColor(strategy.riskLevel)}`}>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{strategy.name}</span>
              <Badge className={getRiskColor(strategy.riskLevel)}>
                {strategy.riskLevel.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Risk Level:</span>
              <Progress value={getRiskScore(strategy.riskLevel)} className="flex-1 h-2" />
              <span>{getRiskScore(strategy.riskLevel)}%</span>
            </div>
          </div>

          {/* Strategy Parameters */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-400" />
              <span className="text-gray-300">Stop Loss:</span>
              <span className="text-red-400 font-medium">{strategy.stopLoss}%</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-gray-300">Take Profit:</span>
              <span className="text-green-400 font-medium">{strategy.takeProfit}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Max Hold:</span>
              <span className="text-blue-400 font-medium">{strategy.holdTime / 1000}s</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">Max Drawdown:</span>
              <span className="text-yellow-400 font-medium">{strategy.maxDrawdown}%</span>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              {strategy.dynamicSizing && (
                <Badge variant="outline" className="text-xs">Dynamic Sizing</Badge>
              )}
              {strategy.multiPairArbitrage && (
                <Badge variant="outline" className="text-xs">Multi-Pair Arbitrage</Badge>
              )}
              {strategy.flashLoanEnabled && (
                <Badge variant="outline" className="text-xs">Flash Loans</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Strategy Recommendations */}
        <div className="p-3 rounded border border-gray-600 bg-gray-900/40">
          <div className="text-sm text-gray-300 space-y-1">
            <div className="font-medium text-white mb-2">💡 Strategy Guide:</div>
            {strategy.riskLevel === 'ULTRA_SAFE' && (
              <>
                <div>• Best for: New users, capital preservation</div>
                <div>• Expected daily ROI: 1-3%</div>
                <div>• Risk: Very Low loss probability</div>
              </>
            )}
            {strategy.riskLevel === 'CONSERVATIVE' && (
              <>
                <div>• Best for: Steady growth, low risk tolerance</div>
                <div>• Expected daily ROI: 2-5%</div>
                <div>• Risk: Low loss probability</div>
              </>
            )}
            {strategy.riskLevel === 'BALANCED' && (
              <>
                <div>• Best for: Balanced risk/reward approach</div>
                <div>• Expected daily ROI: 4-8%</div>
                <div>• Risk: Moderate loss probability</div>
              </>
            )}
            {strategy.riskLevel === 'AGGRESSIVE' && (
              <>
                <div>• Best for: High profit seeking, risk tolerance</div>
                <div>• Expected daily ROI: 6-15%</div>
                <div>• Risk: Higher loss probability</div>
              </>
            )}
            {strategy.riskLevel === 'ULTRA_AGGRESSIVE' && (
              <>
                <div>• Best for: Maximum profit, high risk tolerance</div>
                <div>• Expected daily ROI: 10-25%</div>
                <div>• Risk: Highest loss probability</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}