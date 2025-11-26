import React, { createContext, useContext, ReactNode } from "react";
import { useExtensionState } from "../hooks/useExtensionState";
import { ExtensionState, FilterLevel } from "../types";

interface ExtensionContextType {
  state: ExtensionState;
  isLoading: boolean;
  updateState: (updates: Partial<ExtensionState>) => void;
  toggleExtension: () => void;
  changeFilterLevel: (filterLevel: FilterLevel) => void;
  toggleNotifications: () => void;
  toggleAutoBlock: () => void;
  isEnabled: boolean;
  filterLevel: FilterLevel;
  notifications: boolean;
  autoBlock: boolean;
}

const ExtensionContext = createContext<ExtensionContextType | undefined>(
  undefined
);

interface ExtensionProviderProps {
  children: ReactNode;
}

export const ExtensionProvider: React.FC<ExtensionProviderProps> = ({
  children,
}) => {
  const extensionHook = useExtensionState();

  return (
    <ExtensionContext.Provider value={extensionHook}>
      {children}
    </ExtensionContext.Provider>
  );
};

export const useExtensionContext = (): ExtensionContextType => {
  const context = useContext(ExtensionContext);
  if (context === undefined) {
    throw new Error(
      "useExtensionContext must be used within an ExtensionProvider"
    );
  }
  return context;
};
