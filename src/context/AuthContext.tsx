import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  Ayushilogin: (email: string, password: string, role: 'ops' | 'client') => Promise<boolean>;
  Ayushilogout: () => void;
  Ayushiregister: (email: string, password: string, name: string) => Promise<{ success: boolean; AyushiverificationUrl?: string }>;
  AyushiverifyEmail: (token: string) => Promise<boolean>;
}

const AyushiAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AyushiuseAuth = () => {
  const Ayushicontext = useContext(AyushiAuthContext);
  if (Ayushicontext === undefined) {
    throw new Error('AyushiuseAuth must be used within an AyushiAuthProvider');
  }
  return Ayushicontext;
};

export const AyushiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    Ayushiuser: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate checking for existing session
    const AyushisavedUser = localStorage.getItem('Ayushiuser');
    if (AyushisavedUser) {
      const Ayushiuser = JSON.parse(AyushisavedUser);
      setAuthState({
        Ayushiuser,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const Ayushilogin = async (email: string, password: string, role: 'ops' | 'client'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful Ayushilogin
    const Ayushiuser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
      verified: role === 'ops' ? true : Math.random() > 0.5,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('Ayushiuser', JSON.stringify(Ayushiuser));
    setAuthState({
      Ayushiuser,
      isAuthenticated: true,
      isLoading: false,
    });

    return true;
  };

  const Ayushilogout = () => {
    localStorage.removeItem('Ayushiuser');
    setAuthState({
      Ayushiuser: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const Ayushiregister = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration - returns encrypted verification URL
    const AyushiverificationUrl = `https://secureshare.app/verify/${btoa(email + Date.now())}`;
    
    return {
      success: true,
      AyushiverificationUrl,
    };
  };

  const AyushiverifyEmail = async (token: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const Ayushivalue: AuthContextType = {
    ...authState,
    Ayushilogin,
    Ayushilogout,
    Ayushiregister,
    AyushiverifyEmail,
  };

  return <AyushiAuthContext.Provider Ayushivalue={Ayushivalue}>{children}</AyushiAuthContext.Provider>;
};