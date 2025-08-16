import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, TrendingUp, Target, DollarSign, Activity } from 'lucide-react';
import { useRealTradingBot } from '@/hooks/useRealTradingBot';

export const RealTradingDashboard: React.FC = () => {
  const { 
    isActive, 
    trades, 
    stats, 
    opportunities, 
    wallet, 
    startBot, 
    stopBot, 
    executeTrade 
  } = useRealTradingBot();

  const handleExecuteTrade = async (opportunity: any) => {
    try {
      await executeTrade(opportunity);
      alert(`Trade executed! Check your wallet for transaction confirmation.`);
    } catch (error) {
      alert(`Trade failed: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bot Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Bot Status
            </span>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={startBot} 
              disabled={!wallet.connected || isActive}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Bot
            </Button>
            <Button 
              onClick={stopBot} 
              disabled={!isActive}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Stop Bot
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  +{stats.totalProfit.toFixed(3)} SOL
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.winRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Avg Profit</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.avgProfit.toFixed(3)} SOL
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-orange-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalTrades}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Live Opportunities</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MEV Opportunities ({opportunities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {isActive ? "Scanning for opportunities..." : "Start the bot to find opportunities"}
                </p>
              ) : (
                <div className="space-y-4">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{opp.type}</Badge>
                          <Badge variant={
                            opp.riskLevel === 'low' ? 'default' : 
                            opp.riskLevel === 'medium' ? 'secondary' : 'destructive'
                          }>
                            {opp.riskLevel} risk
                          </Badge>
                        </div>
                        <p className="font-medium">{opp.token}</p>
                        <p className="text-sm text-gray-600">
                          Expected profit: +{opp.expectedProfit.toFixed(3)} SOL
                        </p>
                        <p className="text-sm text-gray-600">
                          Confidence: {opp.confidence.toFixed(1)}%
                        </p>
                      </div>
                      <Button 
                        onClick={() => handleExecuteTrade(opp)}
                        disabled={!wallet.connected}
                        size="sm"
                      >
                        Execute Trade
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No trades yet</p>
              ) : (
                <div className="space-y-4">
                  {trades.slice(0, 10).map((trade) => (
                    <div key={trade.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{trade.type}</Badge>
                          <Badge variant={trade.status === 'completed' ? 'default' : 'secondary'}>
                            {trade.status}
                          </Badge>
                        </div>
                        <span className="text-green-600 font-medium">
                          +{trade.profit.toFixed(3)} SOL
                        </span>
                      </div>
                      <p className="font-medium">{trade.token}</p>
                      <p className="text-sm text-gray-600">
                        {trade.timestamp.toLocaleString()}
                      </p>
                      {trade.txSignature && (
                        <p className="text-xs text-gray-500 font-mono mt-2">
                          Tx: {trade.txSignature.slice(0, 8)}...{trade.txSignature.slice(-8)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bot Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Trading Parameters</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Max Position Size:</span>
                      <span className="font-medium ml-2">20% of balance</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Min Profit Threshold:</span>
                      <span className="font-medium ml-2">0.1 SOL</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <span className="font-medium ml-2">Medium</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Slippage Tolerance:</span>
                      <span className="font-medium ml-2">1%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This bot executes real trades with real money. 
                    Always ensure you understand the risks and never trade with more than you can afford to lose.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};