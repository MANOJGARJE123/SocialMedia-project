import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'production'
  ? 'https://socialmedia-project-backend.onrender.com/api'
  : 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies
});

export default axiosInstance;
