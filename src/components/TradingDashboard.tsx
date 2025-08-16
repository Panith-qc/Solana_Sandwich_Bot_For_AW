import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useTradingBot } from '@/hooks/useTradingBot';
import { Play, Pause, Activity, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react';

export default function TradingDashboard() {
  const {
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
  } = useTradingBot();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY': return 'bg-green-500';
      case 'SELL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Solana Trading Bot</h1>
            <p className="text-gray-600">Advanced AI-powered trading with pattern recognition</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button
              onClick={botConfig.enabled ? stopBot : startBot}
              variant={botConfig.enabled ? 'destructive' : 'default'}
              className="flex items-center space-x-2"
            >
              {botConfig.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{botConfig.enabled ? 'Stop Bot' : 'Start Bot'}</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPnLColor(botStats.totalPnL)}`}>
                {formatCurrency(botStats.totalPnL)}
              </div>
              <p className="text-xs text-muted-foreground">
                {botStats.totalTrades} total trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(botStats.winRate)}</div>
              <Progress value={botStats.winRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {positions.filter(p => p.status === 'OPEN').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Max: {botConfig.maxPositions}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{botStats.profitFactor.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Avg Win: {formatCurrency(botStats.avgWin)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          {/* Markets Tab */}
          <TabsContent value="markets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {markets.map((market) => (
                    <div key={market.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold">{market.symbol}</div>
                          <div className="text-sm text-gray-600">
                            Vol: {formatCurrency(market.volume24h)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(market.price)}</div>
                        <div className={`text-sm ${market.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {market.change24h >= 0 ? '+' : ''}{formatPercent(market.change24h)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signals Tab */}
          <TabsContent value="signals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {signals.map((signal) => (
                    <div key={signal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge className={getSignalColor(signal.type)}>
                          {signal.type}
                        </Badge>
                        <div>
                          <div className="font-semibold">{signal.symbol}</div>
                          <div className="text-sm text-gray-600">
                            Patterns: {signal.patterns.join(', ') || 'None'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          Probability: {signal.probability}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Strength: {signal.strength}
                        </div>
                        <Progress value={signal.probability} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {positions.filter(p => p.status === 'OPEN').map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant={position.type === 'LONG' ? 'default' : 'secondary'}>
                          {position.type}
                        </Badge>
                        <div>
                          <div className="font-semibold">{position.symbol}</div>
                          <div className="text-sm text-gray-600">
                            Entry: {formatCurrency(position.entryPrice)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {position.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(position.currentPrice)}
                        </div>
                        <div className={`text-sm ${getPnLColor(position.pnl)}`}>
                          {formatCurrency(position.pnl)} ({formatPercent(position.pnlPercent)})
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => closePosition(position.id)}
                          className="mt-2"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ))}
                  {positions.filter(p => p.status === 'OPEN').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No active positions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bot Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bot-enabled">Bot Enabled</Label>
                      <Switch
                        id="bot-enabled"
                        checked={botConfig.enabled}
                        onCheckedChange={(enabled) => updateConfig({ enabled })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Risk Level</Label>
                      <select
                        value={botConfig.riskLevel}
                        onChange={(e) => updateConfig({ riskLevel: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Positions: {botConfig.maxPositions}</Label>
                      <Slider
                        value={[botConfig.maxPositions]}
                        onValueChange={([value]) => updateConfig({ maxPositions: value })}
                        max={10}
                        min={1}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Position Size</Label>
                      <Input
                        type="number"
                        value={botConfig.positionSize}
                        onChange={(e) => updateConfig({ positionSize: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Stop Loss %: {botConfig.stopLossPercent}%</Label>
                      <Slider
                        value={[botConfig.stopLossPercent]}
                        onValueChange={([value]) => updateConfig({ stopLossPercent: value })}
                        max={20}
                        min={1}
                        step={0.5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Take Profit %: {botConfig.takeProfitPercent}%</Label>
                      <Slider
                        value={[botConfig.takeProfitPercent]}
                        onValueChange={([value]) => updateConfig({ takeProfitPercent: value })}
                        max={50}
                        min={5}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Min Probability: {botConfig.minProbability}%</Label>
                      <Slider
                        value={[botConfig.minProbability]}
                        onValueChange={([value]) => updateConfig({ minProbability: value })}
                        max={95}
                        min={50}
                        step={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hold Threshold: {botConfig.holdThreshold}%</Label>
                      <Slider
                        value={[botConfig.holdThreshold]}
                        onValueChange={([value]) => updateConfig({ holdThreshold: value })}
                        max={90}
                        min={30}
                        step={5}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold">Pattern Recognition</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {Object.entries(botConfig.patterns).map(([pattern, enabled]) => (
                      <div key={pattern} className="flex items-center space-x-2">
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            updateConfig({
                              patterns: { ...botConfig.patterns, [pattern]: checked }
                            })
                          }
                        />
                        <Label className="text-sm">
                          {pattern.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}