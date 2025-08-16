import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Unlink } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export const WalletConnection: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWalletConnection();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!wallet.connected ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your Phantom wallet to start live trading
            </p>
            <Button 
              onClick={connectWallet} 
              disabled={wallet.connecting}
              className="w-full"
            >
              {wallet.connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Connected Wallet</p>
                <p className="text-xs text-gray-500 font-mono">
                  {wallet.publicKey?.toString().slice(0, 8)}...{wallet.publicKey?.toString().slice(-8)}
                </p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Balance</p>
                <p className="text-lg font-bold">{wallet.balance.toFixed(4)} SOL</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={disconnectWallet}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};