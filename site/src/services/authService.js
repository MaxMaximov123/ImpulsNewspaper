// frontend/src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:81';

export const loginWithGoogle = async () => {
    try {
      const response = await fetch(`http://localhost:81/auth/google`);
      console.log(response);
      window.location.href = response.data;
    } catch (error) {
      console.error('Login with Google failed:', error);
      throw error; // Возможно, вы хотите выбросить ошибку для дальнейшей обработки
    }
  };
  
export const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error; // Аналогично, выбросите ошибку при необходимости
    }
  };
  
export const getUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`);
      return response.data;
    } catch (error) {
      console.error('Get user failed:', error);
      throw error; // Возможно, выбросить ошибку при необходимости
    }
  };