import { useState, useEffect, useRef, useCallback } from 'react';

interface RealTimeData {
  blockHeight: number;
  gasPrice: number;
  mempoolActivity: number;
  networkStatus: 'FAST' | 'NORMAL' | 'CONGESTED';
  lastUpdate: number;
}

export const useRealTimeUpdates = () => {
  const [data, setData] = useState<RealTimeData>({
    blockHeight: 247891234,
    gasPrice: 2500,
    mempoolActivity: 0,
    networkStatus: 'FAST',
    lastUpdate: Date.now()
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  const updateData = useCallback(() => {
    setData(prev => ({
      blockHeight: prev.blockHeight + Math.floor(Math.random() * 3) + 1,
      gasPrice: 2000 + Math.floor(Math.random() * 1500),
      mempoolActivity: Math.floor(Math.random() * 50) + 10,
      networkStatus: Math.random() > 0.8 ? 'NORMAL' : 'FAST',
      lastUpdate: Date.now()
    }));
  }, []);

  useEffect(() => {
    // Update every 200ms for ultra-fast real-time feel
    intervalRef.current = setInterval(updateData, 200);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateData]);

  return data;
};