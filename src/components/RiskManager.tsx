import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, TrendingDown, Activity } from 'lucide-react';
import { Position, BotConfig } from '@/types/trading';

interface RiskManagerProps {
  positions: Position[];
  botConfig: BotConfig;
  totalPnL: number;
}

export default function RiskManager({ positions, botConfig, totalPnL }: RiskManagerProps) {
  const openPositions = positions.filter(p => p.status === 'OPEN');
  const totalExposure = openPositions.reduce((sum, pos) => sum + pos.entryPrice * pos.quantity, 0);
  const totalRisk = openPositions.reduce((sum, pos) => sum + (pos.stopLoss ? Math.abs(pos.entryPrice - pos.stopLoss) * pos.quantity : 0), 0);
  const riskRewardRatio = totalPnL > 0 ? Math.abs(totalPnL / totalRisk) : 0;

  const getRiskLevel = (percentage: number) => {
    if (percentage < 30) return { level: 'LOW', color: 'bg-green-500' };
    if (percentage < 70) return { level: 'MEDIUM', color: 'bg-yellow-500' };
    return { level: 'HIGH', color: 'bg-red-500' };
  };

  const exposurePercentage = Math.min(100, (totalExposure / 10000) * 100); // Assuming $10k portfolio
  const riskLevelInfo = getRiskLevel(exposurePercentage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Risk Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Portfolio Exposure</span>
                <Badge className={riskLevelInfo.color}>
                  {riskLevelInfo.level}
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                ${totalExposure.toLocaleString()}
              </div>
              <Progress value={exposurePercentage} className="mt-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">Total Risk</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                ${totalRisk.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {((totalRisk / totalExposure) * 100).toFixed(1)}% of exposure
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Risk/Reward</span>
              </div>
              <div className="text-2xl font-bold">
                1:{riskRewardRatio.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                Current ratio
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">Position Utilization</span>
              </div>
              <div className="text-2xl font-bold">
                {openPositions.length}/{botConfig.maxPositions}
              </div>
              <Progress 
                value={(openPositions.length / botConfig.maxPositions) * 100} 
                className="mt-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Position Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {openPositions.map((position) => {
              const riskAmount = position.stopLoss 
                ? Math.abs(position.entryPrice - position.stopLoss) * position.quantity
                : 0;
              const riskPercentage = (riskAmount / (position.entryPrice * position.quantity)) * 100;
              const riskInfo = getRiskLevel(riskPercentage);

              return (
                <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant={position.type === 'LONG' ? 'default' : 'secondary'}>
                      {position.type}
                    </Badge>
                    <div>
                      <div className="font-semibold">{position.symbol}</div>
                      <div className="text-sm text-gray-600">
                        Size: ${(position.entryPrice * position.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={riskInfo.color}>
                        {riskPercentage.toFixed(1)}% Risk
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Max Loss: ${riskAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      SL: ${position.stopLoss?.toFixed(2) || 'None'}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {openPositions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No positions to analyze
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}