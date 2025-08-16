import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';
import { TradingSignal } from '@/types/trading';

interface PatternAnalyzerProps {
  signals: TradingSignal[];
}

export default function PatternAnalyzer({ signals }: PatternAnalyzerProps) {
  const getPatternStats = () => {
    const patternCounts: Record<string, { count: number; avgProbability: number; signals: TradingSignal[] }> = {};
    
    signals.forEach(signal => {
      signal.patterns.forEach(pattern => {
        if (!patternCounts[pattern]) {
          patternCounts[pattern] = { count: 0, avgProbability: 0, signals: [] };
        }
        patternCounts[pattern].count++;
        patternCounts[pattern].signals.push(signal);
      });
    });

    // Calculate average probabilities
    Object.keys(patternCounts).forEach(pattern => {
      const totalProb = patternCounts[pattern].signals.reduce((sum, s) => sum + s.probability, 0);
      patternCounts[pattern].avgProbability = totalProb / patternCounts[pattern].count;
    });

    return patternCounts;
  };

  const patternStats = getPatternStats();
  const sortedPatterns = Object.entries(patternStats)
    .sort(([,a], [,b]) => b.avgProbability - a.avgProbability);

  const getPatternIcon = (pattern: string) => {
    if (pattern.includes('Bull') || pattern.includes('Bottom')) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (pattern.includes('Bear') || pattern.includes('Top')) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <BarChart3 className="w-4 h-4 text-blue-500" />;
  };

  const strongPatterns = sortedPatterns.filter(([, stats]) => stats.avgProbability >= 70);
  const moderatePatterns = sortedPatterns.filter(([, stats]) => stats.avgProbability >= 50 && stats.avgProbability < 70);
  const weakPatterns = sortedPatterns.filter(([, stats]) => stats.avgProbability < 50);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Pattern Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-green-600">Strong Patterns (≥70%)</h3>
              {strongPatterns.length > 0 ? (
                strongPatterns.map(([pattern, stats]) => (
                  <div key={pattern} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getPatternIcon(pattern)}
                      <span className="text-sm font-medium">{pattern}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {stats.avgProbability.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {stats.count} signals
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No strong patterns detected</div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-yellow-600">Moderate Patterns (50-69%)</h3>
              {moderatePatterns.length > 0 ? (
                moderatePatterns.map(([pattern, stats]) => (
                  <div key={pattern} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getPatternIcon(pattern)}
                      <span className="text-sm font-medium">{pattern}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-yellow-600">
                        {stats.avgProbability.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {stats.count} signals
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No moderate patterns detected</div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-red-600">Weak Patterns (&lt;50%)</h3>
              {weakPatterns.length > 0 ? (
                weakPatterns.map(([pattern, stats]) => (
                  <div key={pattern} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getPatternIcon(pattern)}
                      <span className="text-sm font-medium">{pattern}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        {stats.avgProbability.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {stats.count} signals
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No weak patterns detected</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Signal Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {signals.slice(-10).reverse().map((signal) => (
              <div key={signal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge className={signal.type === 'BUY' ? 'bg-green-500' : signal.type === 'SELL' ? 'bg-red-500' : 'bg-gray-500'}>
                    {signal.type}
                  </Badge>
                  <div>
                    <div className="font-semibold">{signal.symbol}</div>
                    <div className="text-sm text-gray-600">
                      RSI: {signal.indicators.rsi.toFixed(1)} | MACD: {signal.indicators.macd.toFixed(2)} | Volume: {signal.indicators.volume}
                    </div>
                    <div className="text-xs text-gray-500">
                      Patterns: {signal.patterns.join(', ') || 'None detected'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {signal.probability}%
                  </div>
                  <Progress value={signal.probability} className="w-20 mt-1" />
                  <div className="text-xs text-gray-500 mt-1">
                    Strength: {signal.strength}
                  </div>
                </div>
              </div>
            ))}
            {signals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No signals to analyze
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}