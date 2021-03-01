import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API = axios.create({
  baseURL: "https://distributed.app/api/",
  headers: {
    'content-type': 'text/plain',
  },
  data: {
    'email': 'demo@m3o.com',
  },
});

API.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token')
    if(token) config.headers.authorization = `Bearer ${token}`
  } catch (error) {
    console.warn(`Error getting token from SecureStore: ${error}`)
  }
  return config;
})

export default API;