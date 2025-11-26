import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  readFromStorage,
  writeToStorage,
  removeFromStorage,
} from "../core/storage";
import { STORAGE_KEYS } from "../utils";
import type { AuthContextType, User } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  useEffect(() => {
    const bootstrap = async () => {
      const [
        storedUser,
        completedOnboarding,
        token,
        storedEmail,
        storedUserId,
      ] = await Promise.all([
        readFromStorage<User>(STORAGE_KEYS.USER),
        readFromStorage<boolean>(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
        readFromStorage<string>(STORAGE_KEYS.AUTH_TOKEN),
        readFromStorage<string>(STORAGE_KEYS.USER_EMAIL),
        readFromStorage<string>(STORAGE_KEYS.USER_ID),
      ]);

      const hasCompletedOnboarding = completedOnboarding === true;

      if (storedUser) {
        setUser(storedUser);
        setIsSignedIn(true);
        setIsFirstTime(!hasCompletedOnboarding);
        return;
      }

      if (token) {
        const fallbackUser: User = {
          id: storedUserId ?? undefined,
          email: storedEmail ?? "user@unknown.com",
          fullName: storedEmail?.split("@")[0] || "User",
        };
        setUser(fallbackUser);
        setIsSignedIn(true);
        setIsFirstTime(!hasCompletedOnboarding);
      }
    };

    bootstrap();
  }, []);

  const signIn = (userData: User): void => {
    writeToStorage(STORAGE_KEYS.USER, userData).then(() => {
      setUser(userData);
      setIsSignedIn(true);
    });
  };

  const signOut = (): void => {
    removeFromStorage([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.HAS_COMPLETED_ONBOARDING,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_EMAIL,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.IS_AUTHENTICATED,
    ]).then(() => {
      setUser(null);
      setIsSignedIn(false);
      setIsFirstTime(true);
    });
  };

  const completeOnboarding = (): void => {
    writeToStorage(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, true).then(() => {
      setIsFirstTime(false);
    });
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      writeToStorage(STORAGE_KEYS.USER, updatedUser).then(() => {
        setUser(updatedUser);
      });
    }
  };

  const value: AuthContextType = {
    isSignedIn,
    user,
    isFirstTime,
    signIn,
    signOut,
    completeOnboarding,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
