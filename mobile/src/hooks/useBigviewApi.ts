import { useState, useEffect } from 'react';

// Replace with your actual Vercel/Production URL
const BASE_URL = 'https://your-bigview-web-app.vercel.app/api';

export function useEarnData() {
  const [data, setData] = useState({ apy: '0', tvl: '0', loading: true });

  const refresh = async () => {
    try {
      const response = await fetch(`${BASE_URL}/earn`);
      const result = await response.json();
      setData({ ...result, loading: false });
    } catch (error) {
      console.error("API Error:", error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { ...data, refresh };
}