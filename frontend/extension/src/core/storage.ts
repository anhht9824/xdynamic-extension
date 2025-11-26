type StorageArea = "local" | "sync";

const getArea = (area: StorageArea): chrome.storage.StorageArea => {
  const storageArea = chrome?.storage?.[area];
  if (!storageArea) {
    throw new Error("Chrome storage API is not available.");
  }
  return storageArea;
};

export const readFromStorage = async <T>(
  key: string,
  area: StorageArea = "local"
): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    const storageArea = getArea(area);
    storageArea.get([key], (result) => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      resolve(result[key] as T | undefined);
    });
  });

export const writeToStorage = async (
  key: string,
  value: unknown,
  area: StorageArea = "local"
): Promise<void> =>
  new Promise((resolve, reject) => {
    const storageArea = getArea(area);
    storageArea.set({ [key]: value }, () => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      resolve();
    });
  });

export const writeManyToStorage = async (
  values: Record<string, unknown>,
  area: StorageArea = "local"
): Promise<void> =>
  new Promise((resolve, reject) => {
    const storageArea = getArea(area);
    storageArea.set(values, () => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      resolve();
    });
  });

export const removeFromStorage = async (
  keys: string | string[],
  area: StorageArea = "local"
): Promise<void> =>
  new Promise((resolve, reject) => {
    const storageArea = getArea(area);
    storageArea.remove(keys, () => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      resolve();
    });
  });
