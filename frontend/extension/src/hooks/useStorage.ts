import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils";

type StorageArea = "local" | "sync" | "session";

export const useStorage = <T>(
  key: string,
  defaultValue: T,
  storageArea: StorageArea = "local"
) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storage = chrome.storage[storageArea];

  // Get value from storage
  const getValue = useCallback(async (): Promise<T> => {
    try {
      const result = await storage.get([key]);
      return result[key] !== undefined ? result[key] : defaultValue;
    } catch (err) {
      logger.error(`Failed to get ${key} from ${storageArea} storage`, err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return defaultValue;
    }
  }, [key, defaultValue, storage]);

  // Set value in storage
  const setStorageValue = useCallback(
    async (newValue: T) => {
      try {
        await storage.set({ [key]: newValue });
        setValue(newValue);
        setError(null);
      } catch (err) {
        logger.error(`Failed to set ${key} in ${storageArea} storage`, err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [key, storage]
  );

  // Remove value from storage
  const removeValue = useCallback(async () => {
    try {
      await storage.remove([key]);
      setValue(defaultValue);
      setError(null);
    } catch (err) {
      logger.error(`Failed to remove ${key} from ${storageArea} storage`, err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [key, defaultValue, storage]);

  // Update value (optimistic update)
  const updateValue = useCallback(
    (updater: (prev: T) => T) => {
      setValue((prev) => {
        const newValue = updater(prev);
        setStorageValue(newValue);
        return newValue;
      });
    },
    [setStorageValue]
  );

  // Initialize value from storage
  useEffect(() => {
    let isMounted = true;

    const initializeValue = async () => {
      setIsLoading(true);
      try {
        const storedValue = await getValue();
        if (isMounted) {
          setValue(storedValue);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeValue();

    return () => {
      isMounted = false;
    };
  }, [getValue]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes[key]) {
        setValue(
          changes[key].newValue !== undefined
            ? changes[key].newValue
            : defaultValue
        );
      }
    };

    storage.onChanged.addListener(handleStorageChange);
    return () => storage.onChanged.removeListener(handleStorageChange);
  }, [key, defaultValue, storage]);

  return {
    value,
    setValue: setStorageValue,
    updateValue,
    removeValue,
    isLoading,
    error,

    // Utility methods
    refresh: getValue,
    reset: () => setStorageValue(defaultValue),
  };
};
