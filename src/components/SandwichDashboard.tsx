import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, TrendingUp, Zap, Activity, DollarSign, Clock, Target, Cpu } from 'lucide-react';
import { useRealSandwichBot } from '@/hooks/useRealSandwichBot';
import LiveMarketStats from '@/components/LiveMarketStats';
import RealTradingConnection from '@/components/RealTradingConnection';
import StrategySelector from '@/components/StrategySelector';

export default function SandwichDashboard() {
  const {
    opportunities,
    positions,
    realPrices,
    mevMetrics,
    config,
    stats,
    startBot,
    stopBot,
    updateConfig,
    isScanning
  } = useRealSandwichBot();

  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState<string>();
  const [selectedStrategy, setSelectedStrategy] = React.useState('BALANCED');

  const handleWalletConnect = (address: string, privateKey: string) => {
    setWalletAddress(address);
    setIsWalletConnected(true);
    // In real implementation, store private key securely
    console.log('Wallet connected:', address);
  };

  const handleStrategyChange = (strategy: string) => {
    setSelectedStrategy(strategy);
    // Update bot configuration based on strategy
    console.log('Strategy changed to:', strategy);
  };

  const formatSOL = (amount: number) => `${amount.toFixed(4)} SOL`;
  const formatUSD = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🥪 Solana Sandwich Bot
            </h1>
            <p className="text-gray-300">Advanced MEV Trading & Arbitrage</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={config.enabled ? 'default' : 'secondary'} className="px-4 py-2">
              {config.enabled ? '🟢 ACTIVE' : '🔴 INACTIVE'}
            </Badge>
            <Button
              onClick={config.enabled ? stopBot : startBot}
              variant={config.enabled ? 'destructive' : 'default'}
              size="lg"
            >
              {config.enabled ? 'Stop Bot' : 'Start Bot'}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-black/40 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatUSD(stats.netProfit * 150)}
              </div>
              <p className="text-xs text-gray-400">
                {formatSOL(stats.netProfit)} • {formatPercent((stats.netProfit / config.capital) * 100)} ROI
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {formatPercent(stats.successRate)}
              </div>
              <p className="text-xs text-gray-400">
                {stats.successfulSandwiches}/{stats.executedSandwiches} successful
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Opportunities</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {stats.totalOpportunities}
              </div>
              <p className="text-xs text-gray-400">
                {mevMetrics.profitableOpportunities} current
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Profit</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">
                {formatUSD(stats.avgProfitPerTrade * 150)}
              </div>
              <p className="text-xs text-gray-400">
                {formatSOL(stats.avgProfitPerTrade)} per trade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/40">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="mempool">Mempool</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            {/* Live Market Stats */}
            <LiveMarketStats 
              realPrices={realPrices}
              opportunities={opportunities}
              isScanning={isScanning}
            />
            
            <Card className="bg-black/40 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Live Sandwich Opportunities
                  {isScanning && (
                    <div className="ml-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">LIVE</span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Real-time MEV opportunities detected from market analysis • {opportunities.length} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {opportunities.slice(0, 10).map((opp) => (
                      <div
                        key={opp.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {opp.tokenPair.symbol}
                            </Badge>
                            <Badge 
                              variant={opp.confidence >= 80 ? 'default' : opp.confidence >= 60 ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {opp.confidence.toFixed(0)}% Confidence
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300">
                            Estimated Profit: <span className="text-green-400 font-medium">
                              {formatUSD(opp.estimatedProfit * 150)} ({formatPercent(opp.profitPercent)})
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Price Impact: {formatPercent(opp.targetTx.estimatedPriceImpact)} • 
                            Gas: {formatSOL(opp.gasEstimate / 1e9)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
                            {formatUSD(opp.targetTx.amount)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {opp.status}
                          </div>
                        </div>
                      </div>
                    ))}
                    {opportunities.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No opportunities detected yet</p>
                        <p className="text-xs">Bot will scan for profitable sandwich trades</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Active & Recent Positions
                </CardTitle>
                <CardDescription>
                  Track your sandwich trades and P&L in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {positions.slice(0, 20).map((pos) => (
                      <div
                        key={pos.id}
                        className={`p-4 rounded-lg border ${
                          pos.netProfit > 0 
                            ? 'border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent' 
                            : pos.netProfit < 0
                            ? 'border-red-500/20 bg-gradient-to-r from-red-500/5 to-transparent'
                            : 'border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {pos.token}
                            </Badge>
                            <Badge 
                              variant={
                                pos.status === 'COMPLETED' ? 'default' : 
                                pos.status === 'FAILED' ? 'destructive' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {pos.status}
                            </Badge>
                          </div>
                          <div className={`text-sm font-medium ${
                            pos.netProfit > 0 ? 'text-green-400' : 
                            pos.netProfit < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {pos.netProfit > 0 ? '+' : ''}{formatUSD(pos.netProfit * 150)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                          <div>Entry: {formatUSD(pos.entryPrice)}</div>
                          <div>Exit: {pos.exitPrice ? formatUSD(pos.exitPrice) : 'Pending'}</div>
                          <div>Amount: {formatUSD(pos.amount)}</div>
                          <div>Gas: {formatSOL(pos.gasUsed / 1e9)}</div>
                        </div>
                      </div>
                    ))}
                    {positions.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No positions yet</p>
                        <p className="text-xs">Start the bot to begin sandwich trading</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mempool" className="space-y-4">
            <Card className="bg-black/40 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  Real-Time Price Monitor
                </CardTitle>
                <CardDescription>
                  Live Solana token prices from Jupiter API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-400 font-medium">{mevMetrics.mempoolSize}</div>
                    <div className="text-gray-400">Opportunities Scanned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">{Object.keys(realPrices).length}</div>
                    <div className="text-gray-400">Tokens Monitored</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${
                      mevMetrics.networkCongestion === 'HIGH' ? 'text-red-400' :
                      mevMetrics.networkCongestion === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {mevMetrics.networkCongestion}
                    </div>
                    <div className="text-gray-400">Network Status</div>
                  </div>
                </div>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {Object.entries(realPrices).map(([token, price]) => (
                      <div key={token} className="p-3 rounded border border-blue-500/20 bg-blue-500/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {token}
                            </Badge>
                            <span className="text-sm text-white font-medium">
                              {formatUSD(price)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Last Updated: {new Date(mevMetrics.lastScanTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {Object.keys(realPrices).length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Cpu className="h-8 w-8 mx-auto mb-2" />
                        <p>Loading real-time prices...</p>
                        <p className="text-xs">Connecting to Jupiter API</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-black/40 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-white">{formatPercent(stats.successRate)}</span>
                    </div>
                    <Progress value={stats.successRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Active Positions</span>
                      <span className="text-white">
                        {positions.filter(p => p.status !== 'COMPLETED').length}
                      </span>
                    </div>
                    <Progress value={(positions.filter(p => p.status !== 'COMPLETED').length / 5) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-lg font-medium text-green-400">
                        {formatUSD(stats.totalProfit * 150)}
                      </div>
                      <div className="text-xs text-gray-400">Total Profit</div>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-red-400">
                        {formatUSD(stats.totalGasSpent * 150)}
                      </div>
                      <div className="text-xs text-gray-400">Gas Spent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-teal-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Real Market Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      <div className="p-4 rounded border border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-transparent">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teal-400 mb-2">
                            REAL SOLANA DATA
                          </div>
                          <div className="text-sm text-gray-300 space-y-1">
                            <div>✅ Live Jupiter API Integration</div>
                            <div>✅ Real-time Price Feeds</div>
                            <div>✅ Actual MEV Opportunities</div>
                            <div>✅ True Network Conditions</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded border border-green-500/20 bg-green-500/5">
                          <div className="text-green-400 font-medium text-sm">Simple Trading</div>
                          <div className="text-xs text-gray-400">No flash loans</div>
                        </div>
                        <div className="p-3 rounded border border-blue-500/20 bg-blue-500/5">
                          <div className="text-blue-400 font-medium text-sm">Real Profits</div>
                          <div className="text-xs text-gray-400">1-8% per trade</div>
                        </div>
                        <div className="p-3 rounded border border-purple-500/20 bg-purple-500/5">
                          <div className="text-purple-400 font-medium text-sm">Smart Entry</div>
                          <div className="text-xs text-gray-400">80%+ confidence</div>
                        </div>
                        <div className="p-3 rounded border border-orange-500/20 bg-orange-500/5">
                          <div className="text-orange-400 font-medium text-sm">Risk Control</div>
                          <div className="text-xs text-gray-400">Stop at 65% success</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            {/* Strategy Selection */}
            <StrategySelector 
              selectedStrategy={selectedStrategy}
              onStrategyChange={handleStrategyChange}
            />

            {/* Real Trading Connection */}
            <RealTradingConnection 
              onConnect={handleWalletConnect}
              isConnected={isWalletConnected}
              walletAddress={walletAddress}
            />
            
            {/* Bot Configuration */}
            <Card className="bg-black/40 border-gray-500/20">
              <CardHeader>
                <CardTitle className="text-white">Bot Configuration</CardTitle>
                <CardDescription>
                  Optimize your sandwich bot settings for maximum profitability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="capital" className="text-white">Capital ($)</Label>
                      <Input
                        id="capital"
                        type="number"
                        value={config.capital}
                        onChange={(e) => updateConfig(prev => ({ ...prev, capital: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="minProfit" className="text-white">Min Profit Threshold (SOL)</Label>
                      <Input
                        id="minProfit"
                        type="number"
                        step="0.001"
                        value={config.minProfitThreshold}
                        onChange={(e) => updateConfig(prev => ({ ...prev, minProfitThreshold: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxPosition" className="text-white">Max Position Size (%)</Label>
                      <Input
                        id="maxPosition"
                        type="number"
                        value={config.maxPositionSize}
                        onChange={(e) => updateConfig(prev => ({ ...prev, maxPositionSize: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="slippage" className="text-white">Slippage Tolerance (%)</Label>
                      <Input
                        id="slippage"
                        type="number"
                        step="0.1"
                        value={config.slippageTolerance}
                        onChange={(e) => updateConfig(prev => ({ ...prev, slippageTolerance: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="priorityFee" className="text-white">Priority Fee (microlamports)</Label>
                      <Input
                        id="priorityFee"
                        type="number"
                        value={config.priorityFee}
                        onChange={(e) => updateConfig(prev => ({ ...prev, priorityFee: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxGas" className="text-white">Max Gas Price</Label>
                      <Input
                        id="maxGas"
                        type="number"
                        value={config.maxGasPrice}
                        onChange={(e) => updateConfig(prev => ({ ...prev, maxGasPrice: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-white font-medium mb-3">Target Tokens</h4>
                  <div className="flex flex-wrap gap-2">
                    {['SOL', 'USDC', 'USDT', 'mSOL', 'RND'].map((token) => (
                      <Badge
                        key={token}
                        variant={config.targetTokens.includes(token) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const newTokens = config.targetTokens.includes(token)
                            ? config.targetTokens.filter(t => t !== token)
                            : [...config.targetTokens, token];
                          updateConfig(prev => ({ ...prev, targetTokens: newTokens }));
                        }}
                      >
                        {token}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-white font-medium">Bot Status</div>
                    <div className="text-sm text-gray-400">
                      {config.enabled ? 'Actively scanning and trading' : 'Inactive'}
                    </div>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        startBot();
                      } else {
                        stopBot();
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}