import { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
      publicKey: PublicKey | null;
      isConnected: boolean;
    };
  }
}

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number;
  connecting: boolean;
}

export const useWalletConnection = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
    connecting: false
  });

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  const connectWallet = async () => {
    try {
      setWallet(prev => ({ ...prev, connecting: true }));
      
      if (!window.solana?.isPhantom) {
        alert('Please install Phantom wallet extension');
        return;
      }

      const response = await window.solana.connect();
      const publicKey = response.publicKey;
      
      // Get wallet balance
      const balance = await connection.getBalance(publicKey);
      
      setWallet({
        connected: true,
        publicKey,
        balance: balance / LAMPORTS_PER_SOL,
        connecting: false
      });
      
      console.log('Connected to wallet:', publicKey.toString());
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ ...prev, connecting: false }));
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
      }
      setWallet({
        connected: false,
        publicKey: null,
        balance: 0,
        connecting: false
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const executeTransaction = async (transaction: Transaction) => {
    if (!wallet.connected || !wallet.publicKey || !window.solana) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await window.solana.signAndSendTransaction(transaction);
      return signature.signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana?.isConnected && window.solana.publicKey) {
        const balance = await connection.getBalance(window.solana.publicKey);
        setWallet({
          connected: true,
          publicKey: window.solana.publicKey,
          balance: balance / LAMPORTS_PER_SOL,
          connecting: false
        });
      }
    };

    checkWalletConnection();
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    executeTransaction,
    connection
  };
};