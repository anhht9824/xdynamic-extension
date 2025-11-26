import { useState, useEffect } from 'react';
import { logger, STORAGE_KEYS } from '../utils';
import { readFromStorage, writeToStorage } from '../core/storage';

export interface FilterState {
  sensitive: boolean;
  violence: boolean;
  toxicity: boolean;
  vice: boolean;
}

export interface ContentTypeState {
  image: boolean;
  video: boolean;
}

export const useFilterState = () => {
  const [filters, setFilters] = useState<FilterState>({
    sensitive: true,
    violence: true,
    toxicity: true,
    vice: true,
  });

  const [contentTypes, setContentTypes] = useState<ContentTypeState>({
    image: true,
    video: true,
  });

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedFilters = await readFromStorage<FilterState>(
          STORAGE_KEYS.FILTERS,
          'sync'
        );
        const savedContentTypes = await readFromStorage<ContentTypeState>(
          STORAGE_KEYS.CONTENT_TYPES,
          'sync'
        );
        
        if (savedFilters) {
          setFilters(savedFilters);
        }
        
        if (savedContentTypes) {
          setContentTypes(savedContentTypes);
        }
      } catch (error) {
        logger.error('Failed to load filter state from storage', error);
      }
    };

    loadState();
  }, []);

  // Save state when changed
  useEffect(() => {
    writeToStorage(STORAGE_KEYS.FILTERS, filters, 'sync');
  }, [filters]);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.CONTENT_TYPES, contentTypes, 'sync');
  }, [contentTypes]);

  const toggleFilter = (filterName: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const toggleContentType = (contentType: keyof ContentTypeState) => {
    setContentTypes(prev => ({
      ...prev,
      [contentType]: !prev[contentType],
    }));
  };

  return {
    filters,
    contentTypes,
    toggleFilter,
    toggleContentType,
    setFilters,
    setContentTypes,
  };
};
