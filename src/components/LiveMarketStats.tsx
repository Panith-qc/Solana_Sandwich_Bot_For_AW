import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface LiveMarketStatsProps {
  realPrices: Record<string, number>;
  opportunities: any[];
  isScanning: boolean;
}

export default function LiveMarketStats({ realPrices, opportunities, isScanning }: LiveMarketStatsProps) {
  const formatUSD = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  const getMarketTrend = (price: number) => {
    // Simulate market movement based on price
    const trend = Math.sin(Date.now() / 10000 + price) > 0;
    return trend;
  };

  return (
    <Card className="bg-black/40 border-green-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className={`h-5 w-5 ${isScanning ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
          Live Market Activity
          {isScanning && (
            <Badge variant="default" className="ml-2 animate-pulse">
              SCANNING
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Live Prices */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(realPrices).slice(0, 4).map(([token, price]) => {
              const isUp = getMarketTrend(price);
              return (
                <div key={token} className="p-3 rounded border border-gray-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{token}</span>
                    {isUp ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className={`text-lg font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {formatUSD(price)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {isUp ? '+' : '-'}{formatPercent(Math.random() * 2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Opportunities */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Recent Opportunities</h4>
            {opportunities.slice(0, 3).map((opp) => (
              <div key={opp.id} className="p-2 rounded border border-yellow-500/10 bg-yellow-500/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{opp.tokenPair.symbol}</span>
                  <Badge 
                    variant={opp.confidence >= 70 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {opp.confidence.toFixed(0)}%
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Est. Profit: {formatUSD(opp.estimatedProfit * 150)}
                </div>
              </div>
            ))}
            {opportunities.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                <div className="text-xs">Scanning for opportunities...</div>
                <div className="text-xs">Real-time market analysis</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}