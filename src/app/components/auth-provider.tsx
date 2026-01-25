"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthApi, UsersApi, Configuration, TokenObtainPair, UserRegister, User } from '@/lib/api';
import axios from 'axios';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: TokenObtainPair) => Promise<void>;
  register: (data: UserRegister) => Promise<void>;
  logout: () => void;
  token: string | null;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a single axios instance for the application
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // Initialize API clients
  const apiConfig = new Configuration({
    basePath: 'http://localhost:8000',
    accessToken: token || undefined,
  });

  const authApi = new AuthApi(apiConfig, undefined, axiosInstance);
  const usersApi = new UsersApi(apiConfig, undefined, axiosInstance);

  const fetchUser = useCallback(async () => {
    try {
      const response = await usersApi.usersMeRetrieve();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  }, [token]);

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Set the default header for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
        fetchUser();
    }
  }, [token, fetchUser]);

  // Axios interceptor for 401 handling
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // If we receive a 401, clear token and show login modal
          // Only show toast if we were previously authenticated (to avoid spam on initial load if token expired)
          if (token) { 
             toast.error("Sesja wygasła. Zaloguj się ponownie.");
             logout();
          }
          setShowLoginModal(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const login = async (credentials: TokenObtainPair) => {
    try {
      const response = await authApi.authTokenCreate(credentials);
      const newToken = response.data.access;
      const refreshToken = response.data.refresh; // Store if needed, for now just access
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success("Zalogowano pomyślnie");
      setShowLoginModal(false);
      // fetchUser will be triggered by token change
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: UserRegister) => {
    try {
      await authApi.authRegisterCreate(data);
      toast.success("Rejestracja pomyślna. Możesz się zalogować.");
      // Automatically login or let user login? Let's just switch to login mode in modal usually
      // For now, assume register just creates account.
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axiosInstance.defaults.headers.common['Authorization'];
    router.push('/');
    toast.info("Wylogowano.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        token,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
