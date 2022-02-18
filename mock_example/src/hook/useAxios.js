import { useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/api';

const useAxios = () => {

  const sendRequest = useCallback((axiosParams) => {
    return new Promise((resolve, reject) => {
      axios.request(axiosParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
      });
  }, []);

  return {
    sendRequest: sendRequest,
  };
};

export default useAxios;
