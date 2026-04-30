import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE}/api/auth/login`, {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_BASE}/api/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
