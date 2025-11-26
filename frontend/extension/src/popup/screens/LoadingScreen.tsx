import React from 'react';
import { useLanguage } from '../../hooks';

const LoadingScreen: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">{t('common.loading', 'Loading...')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
