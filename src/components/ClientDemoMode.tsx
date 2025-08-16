import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, DollarSign, Zap, Shield, BarChart3 } from 'lucide-react';

interface DemoScenario {
  strategy: string;
  capital: number;
  timeframe: string;
  expectedROI: string;
  trades: number;
  successRate: string;
  avgProfit: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    strategy: 'ULTRA_SAFE',
    capital: 100,
    timeframe: '24h',
    expectedROI: '2-5%',
    trades: 15,
    successRate: '95%',
    avgProfit: '$0.15',
    description: 'Perfect for conservative investors who prioritize capital preservation',
    icon: Shield,
    color: 'bg-green-500'
  },
  {
    strategy: 'CONSERVATIVE',
    capital: 500,
    timeframe: '24h',
    expectedROI: '5-8%',
    trades: 25,
    successRate: '90%',
    avgProfit: '$1.20',
    description: 'Steady growth with minimal risk exposure',
    icon: TrendingUp,
    color: 'bg-blue-500'
  },
  {
    strategy: 'BALANCED',
    capital: 1000,
    timeframe: '24h',
    expectedROI: '8-15%',
    trades: 40,
    successRate: '85%',
    avgProfit: '$3.75',
    description: 'Optimal balance of risk and reward for most traders',
    icon: Target,
    color: 'bg-purple-500'
  },
  {
    strategy: 'AGGRESSIVE',
    capital: 2000,
    timeframe: '24h',
    expectedROI: '15-25%',
    trades: 60,
    successRate: '80%',
    avgProfit: '$8.50',
    description: 'High-growth potential for experienced traders',
    icon: BarChart3,
    color: 'bg-orange-500'
  },
  {
    strategy: 'ULTRA_AGGRESSIVE',
    capital: 5000,
    timeframe: '24h',
    expectedROI: '25-50%',
    trades: 85,
    successRate: '75%',
    avgProfit: '$18.75',
    description: 'Maximum returns for risk-tolerant institutional investors',
    icon: Zap,
    color: 'bg-red-500'
  }
];

interface ClientDemoModeProps {
  onSelectScenario: (scenario: DemoScenario) => void;
  currentScenario?: string;
}

export const ClientDemoMode: React.FC<ClientDemoModeProps> = ({ 
  onSelectScenario, 
  currentScenario 
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          World-Class MEV Trading Performance
        </h2>
        <p className="text-gray-400 text-lg">
          Choose your strategy based on capital and risk tolerance
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Strategy Overview</TabsTrigger>
          <TabsTrigger value="performance">Live Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Performance Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_SCENARIOS.map((scenario, index) => {
              const Icon = scenario.icon;
              const isSelected = currentScenario === scenario.strategy;
              
              return (
                <Card 
                  key={scenario.strategy}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 bg-gray-800/80' 
                      : 'bg-gray-900/60 hover:bg-gray-800/60'
                  }`}
                  onClick={() => onSelectScenario(scenario)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${scenario.color} bg-opacity-20`}>
                        <Icon className={`h-5 w-5 text-white`} />
                      </div>
                      <Badge 
                        variant={isSelected ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {scenario.expectedROI} ROI
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-white">
                      {scenario.strategy.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-400">
                      {scenario.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Capital:</span>
                        <div className="font-medium text-white">${scenario.capital}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Success Rate:</span>
                        <div className="font-medium text-green-400">{scenario.successRate}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Daily Trades:</span>
                        <div className="font-medium text-white">{scenario.trades}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Profit:</span>
                        <div className="font-medium text-green-400">{scenario.avgProfit}</div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                    >
                      {isSelected ? 'Currently Active' : 'Select Strategy'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Comparison */}
          <Card className="bg-gray-900/60">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                24-Hour Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_SCENARIOS.map((scenario) => {
                  const dailyProfit = scenario.capital * (parseFloat(scenario.expectedROI.split('-')[1]) / 100);
                  const weeklyProfit = dailyProfit * 7;
                  const monthlyProfit = dailyProfit * 30;
                  
                  return (
                    <div key={scenario.strategy} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/40">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${scenario.color}`}></div>
                        <span className="text-white font-medium">
                          {scenario.strategy.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">
                          +${dailyProfit.toFixed(2)}/day
                        </div>
                        <div className="text-xs text-gray-400">
                          ${weeklyProfit.toFixed(2)}/week • ${monthlyProfit.toFixed(2)}/month
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Start Recommendations */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <CardHeader>
              <CardTitle className="text-white">💡 Quick Start Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400">For Beginners ($100-$500)</h4>
                  <p className="text-sm text-gray-300">Start with Ultra Safe or Conservative mode</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400">For Experienced ($1K-$5K)</h4>
                  <p className="text-sm text-gray-300">Balanced or Aggressive for optimal returns</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400">For Institutions ($5K+)</h4>
                  <p className="text-sm text-gray-300">Ultra Aggressive for maximum yield</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400">Demo Mode</h4>
                  <p className="text-sm text-gray-300">All strategies optimized for showcase</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDemoMode;