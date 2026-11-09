import { useContext } from 'react';
import { useEffect } from 'react';
import { AuthContext } from '../auth.context.jsx';
import {Login,Register,Logout,getMe} from '../services/auth.api.js';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, loading, setUser, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await Login({ email, password });
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await Register({ username, email, password });
      setUser(data.user);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await Logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      const userData = await getMe();
      setUser(userData.user);
      setLoading(false);
    };
    getAndSetUser();
  },[]);

  return { user, loading, handleLogin, handleRegister, handleLogout };
};




