import React from 'react';
import UserHub from './UserHub';
import { LanguageProvider } from '../providers/LanguageProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AuthProvider } from '../providers/AuthProvider';
import '../styles/global.css';

const Settings: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <UserHub />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default Settings;
