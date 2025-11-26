import { useState, useEffect } from 'react';
import { logger, DEFAULTS, STORAGE_KEYS } from '../utils';
import { readFromStorage, writeToStorage } from '../core/storage';

export const useStats = () => {
  const [blockedCount, setBlockedCount] = useState(0);
  const [todayBlocked, setTodayBlocked] = useState(0);
  const [weeklyBlocked, setWeeklyBlocked] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const totalBlocked =
          (await readFromStorage<number>(STORAGE_KEYS.TOTAL_BLOCKED, 'sync')) ??
          DEFAULTS.BLOCKED_COUNT;
        const today =
          (await readFromStorage<number>(STORAGE_KEYS.TODAY_BLOCKED, 'sync')) ??
          0;
        const weekly =
          (await readFromStorage<number>(STORAGE_KEYS.WEEKLY_BLOCKED, 'sync')) ??
          0;
        
        setBlockedCount(totalBlocked);
        setTodayBlocked(today);
        setWeeklyBlocked(weekly);
      } catch (error) {
        logger.error('Failed to load stats from storage', error);
      }
    };

    loadStats();

    // Listen for stats updates from background script
    const handleMessage = (message: any) => {
      if (message.type === 'STATS_UPDATED') {
        setBlockedCount(message.data.total);
        setTodayBlocked(message.data.today);
        setWeeklyBlocked(message.data.weekly);
      }
    };

    if (chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, []);

  const incrementBlocked = async () => {
    const newTotal = blockedCount + 1;
    const newToday = todayBlocked + 1;
    const newWeekly = weeklyBlocked + 1;

    setBlockedCount(newTotal);
    setTodayBlocked(newToday);
    setWeeklyBlocked(newWeekly);

    await writeToStorage(STORAGE_KEYS.TOTAL_BLOCKED, newTotal, 'sync');
    await writeToStorage(STORAGE_KEYS.TODAY_BLOCKED, newToday, 'sync');
    await writeToStorage(STORAGE_KEYS.WEEKLY_BLOCKED, newWeekly, 'sync');
  };

  return {
    blockedCount,
    todayBlocked,
    weeklyBlocked,
    incrementBlocked,
  };
};
