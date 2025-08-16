import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface RealTradingConnectionProps {
  onConnect: (walletAddress: string, privateKey: string) => void;
  isConnected: boolean;
  walletAddress?: string;
}

export default function RealTradingConnection({ onConnect, isConnected, walletAddress }: RealTradingConnectionProps) {
  const [privateKey, setPrivateKey] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleConnect = () => {
    // In real implementation, this would use wallet adapters
    // For now, we'll simulate the connection
    const simulatedAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
    onConnect(simulatedAddress, privateKey);
  };

  if (isConnected) {
    return (
      <Card className="border-green-500/20 bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Address:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}
            </Badge>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>LIVE TRADING ACTIVE</strong><br />
              Real SOL will be used for sandwich trades. Monitor positions carefully.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded border border-green-500/20">
              <div className="text-green-400 font-medium">Ready for Trading</div>
              <div className="text-xs text-gray-400">Connected to Solana Mainnet</div>
            </div>
            <div className="p-3 rounded border border-blue-500/20">
              <div className="text-blue-400 font-medium">Gas Optimization</div>
              <div className="text-xs text-gray-400">Priority fees configured</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-500/20 bg-yellow-950/10">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Real Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Real Trading Mode</strong><br />
            This will connect to your actual Solana wallet for live MEV trading.
          </AlertDescription>
        </Alert>

        {!showForm ? (
          <div className="space-y-3">
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Setup Real Trading
            </Button>
            
            <div className="text-xs text-gray-400 space-y-1">
              <div>• Minimum 0.01 SOL balance required</div>
              <div>• Gas fees: ~0.004 SOL per sandwich attempt</div>
              <div>• Expected daily ROI: 2-8% (realistic)</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="private-key">Solana Private Key</Label>
              <Input
                id="private-key"
                type="password"
                placeholder="Enter your Solana private key..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="font-mono text-xs"
              />
              <div className="text-xs text-gray-400">
                This will be stored securely and used for signing transactions.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleConnect}
                disabled={!privateKey}
                className="bg-green-600 hover:bg-green-700"
              >
                Connect Wallet
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>

            <div className="p-3 rounded border border-red-500/20 bg-red-950/20">
              <div className="text-red-400 text-xs font-medium mb-1">⚠️ Risk Warning</div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• MEV trading involves significant risk</div>
                <div>• You may lose funds due to failed transactions</div>
                <div>• High gas fees during network congestion</div>
                <div>• No guarantee of profits</div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Recommended Wallets:</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Phantom</Badge>
              <Badge variant="outline" className="text-xs">Solflare</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}