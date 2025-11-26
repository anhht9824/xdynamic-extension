export interface User {
  id?: string;
  email: string;
  fullName: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  hasCompletedOnboarding?: boolean;
}

export interface AuthContextType {
  isSignedIn: boolean;
  user: User | null;
  isFirstTime: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  completeOnboarding: () => void;
  updateUser: (userData: Partial<User>) => void;
}
