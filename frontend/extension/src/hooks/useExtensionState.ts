import { useState, useEffect, useCallback } from "react";
import { readFromStorage, writeToStorage } from "../core/storage";
import { ExtensionState, FilterLevel } from "../types";
import { logger, STORAGE_KEYS } from "../utils";

const defaultState: ExtensionState = {
  isEnabled: true,
  filterLevel: "moderate",
  theme: "system",
  language: "en",
  notifications: true,
  autoBlock: false,
};

export const useExtensionState = () => {
  const [state, setState] = useState<ExtensionState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  // Update state in storage
  const updateState = useCallback(
    async (updates: Partial<ExtensionState>) => {
      const newState = { ...state, ...updates };
      setState(newState);
      await Promise.all([
        writeToStorage(STORAGE_KEYS.EXTENSION_STATE, newState),
        writeToStorage(STORAGE_KEYS.EXTENSION_ENABLED, newState.isEnabled),
      ]);

      chrome.runtime.sendMessage({
        type: "UPDATE_STATE",
        payload: newState,
      });
    },
    [state]
  );

  // Toggle extension
  const toggleExtension = useCallback(() => {
    updateState({ isEnabled: !state.isEnabled });
  }, [state.isEnabled, updateState]);

  // Change filter level
  const changeFilterLevel = useCallback(
    (filterLevel: FilterLevel) => {
      updateState({ filterLevel });
    },
    [updateState]
  );

  // Toggle notifications
  const toggleNotifications = useCallback(() => {
    updateState({ notifications: !state.notifications });
  }, [state.notifications, updateState]);

  // Toggle auto block
  const toggleAutoBlock = useCallback(() => {
    updateState({ autoBlock: !state.autoBlock });
  }, [state.autoBlock, updateState]);

  // Initialize state from storage
  useEffect(() => {
    setIsLoading(true);
    readFromStorage<ExtensionState>(STORAGE_KEYS.EXTENSION_STATE)
      .then((savedState) => {
        if (savedState) {
          setState({ ...defaultState, ...savedState });
        }
      })
      .catch((error) => logger.error("Failed to read extension state", error))
      .finally(() => setIsLoading(false));
  }, []);

  // Listen for state changes from other parts of the extension
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "STATE_UPDATED") {
        setState(message.payload);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return {
    state,
    isLoading,
    updateState,
    toggleExtension,
    changeFilterLevel,
    toggleNotifications,
    toggleAutoBlock,

    // Computed values
    isEnabled: state.isEnabled,
    filterLevel: state.filterLevel,
    notifications: state.notifications,
    autoBlock: state.autoBlock,
  };
};
