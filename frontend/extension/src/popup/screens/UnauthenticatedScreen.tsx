import React from 'react';
import { useLanguage } from '../../hooks';

interface UnauthenticatedScreenProps {
  onSignIn?: () => void;
}

const UnauthenticatedScreen: React.FC<UnauthenticatedScreenProps> = ({ onSignIn }) => {
  const { t } = useLanguage();

  return (
    <div className="w-80 h-[460px] relative overflow-hidden rounded-2xl shadow-2xl bg-white/20 backdrop-blur-xl border border-white/30 dark:bg-black/20 dark:border-white/10 flex items-center justify-center">
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold mb-4">{t('auth.signIn', 'Sign In')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{t('auth.username', 'Username')}</p>
        <button
          onClick={onSignIn}
          className="px-4 py-2 rounded bg-emerald-500 text-white"
        >
          {t('auth.signIn', 'Sign In')}
        </button>
      </div>
    </div>
  );
};

export default UnauthenticatedScreen;
