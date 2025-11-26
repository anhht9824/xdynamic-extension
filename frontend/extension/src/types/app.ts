export interface AppContextType {
  currentEntry: 'popup' | 'options' | 'background' | string;
  setCurrentEntry: (entry: string) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}
