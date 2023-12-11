'use client'
import { useState, createContext, useEffect } from "react";

interface UserData {
  createdAt: string;
  email: string;
  id: string;
  accessToken: string;
  username: string;
  __typename: string;
}

export interface AuthInfo {
  accessToken: string | null;
  userData: UserData | null;
}

export interface AuthContextContent {
  authInfo: AuthInfo;
  isAuthenticated: () => boolean;
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo>>;
}

const defaultValue = {
  authInfo: {
    accessToken: null,
    userData: null,
  },
  isAuthenticated: () => false,
  setAuthInfo: () => {},
}

export const AuthContext = createContext<AuthContextContent>(defaultValue);
const Provider = AuthContext.Provider;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    accessToken: null,
    userData: null,
  });

  const isAuthenticated = () => authInfo.accessToken !== null;

  return (
    <Provider value={{ authInfo, isAuthenticated, setAuthInfo }}>
      { children }
    </Provider>
  )
}
