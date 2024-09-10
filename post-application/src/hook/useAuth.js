import { useState } from 'react';

import axiosInstance from 'utils/axios/axios';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (endpoint, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(endpoint, data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
      return null;
    }
  };

  return { apiCall, loading, error };
};

export default useAuth;
