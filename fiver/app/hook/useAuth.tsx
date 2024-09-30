'use client';
import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface ApiCall {
  (endpoint: string, data?: Record<string, any>, method?: 'POST' | 'GET', token?: string | null): Promise<ApiResponse<any> | null>;
}


const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall: ApiCall = useCallback(async (endpoint, data, method = 'POST') => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
  
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
    };
  
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
  
    try {
      const response = await fetch(endpoint, {
        method,
        headers,
        body: method === 'POST' ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
      });
  
      const responseData = await response.json();
      setLoading(false);
  
      if (!response.ok) {
        const message = responseData?.message || 'An error occurred.';
        setError(message);
        return { data: null, error: message };
      }
  
      return { data: responseData, error: undefined };
    } catch (err) {
      setLoading(false);
      const message = (err as Error)?.message || 'An error occurred.';
      setError(message);
      return { data: null, error: message };
    }
  }, []);

  return { apiCall, loading, error };
};

export default useAuth;

