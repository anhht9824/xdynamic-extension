import React, { useState } from 'react';
import AnimatedCard from './AnimatedCard';
import RippleButton from './RippleButton';
import FloatingActionButton from './FloatingActionButton';
import ProgressRing from './ProgressRing';
import FormInput from './FormInput';
import QuickSettingsPanel from './QuickSettingsPanel';

/**
 * Phase2Demo - Showcase page for Phase 2 UX/UI improvements
 * 
 * Demonstrates:
 * - AnimatedCard with staggered entrance
 * - RippleButton with Material Design ripple
 * - FloatingActionButton with expandable actions
 * - ProgressRing with smooth animations
 * - FormInput with real-time validation
 * - QuickSettingsPanel sliding panel
 */
const Phase2Demo: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isQuickPanelOpen, setIsQuickPanelOpen] = useState(false);
  const [quickSettings, setQuickSettings] = useState({
    protection: true,
    autoUpdate: true,
    darkMode: false,
    notifications: true,
  });

  // Email validation
  const validateEmail = (value: string): string | null => {
    if (!value) return 'Email là bắt buộc';
    if (!value.includes('@')) return 'Email không hợp lệ';
    if (value.length < 5) return 'Email quá ngắn';
    return null;
  };

  // Password validation
  const validatePassword = (value: string): string | null => {
    if (!value) return 'Mật khẩu là bắt buộc';
    if (value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!/[A-Z]/.test(value)) return 'Phải có ít nhất 1 chữ hoa';
    if (!/[0-9]/.test(value)) return 'Phải có ít nhất 1 chữ số';
    return null;
  };

  const fabActions = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
      label: 'Lưu cài đặt',
      onClick: () => alert('Đã lưu cài đặt!'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      label: 'Xuất dữ liệu',
      onClick: () => alert('Đang xuất dữ liệu...'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Cài đặt nhanh',
      onClick: () => setIsQuickPanelOpen(true),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  const quickSettingsConfig = [
    {
      id: 'protection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: 'Bảo vệ thời gian thực',
      value: quickSettings.protection,
      onChange: (value: boolean) => setQuickSettings({ ...quickSettings, protection: value }),
      color: 'green',
    },
    {
      id: 'autoUpdate',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      label: 'Tự động cập nhật',
      value: quickSettings.autoUpdate,
      onChange: (value: boolean) => setQuickSettings({ ...quickSettings, autoUpdate: value }),
      color: 'blue',
    },
    {
      id: 'darkMode',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      label: 'Chế độ tối',
      value: quickSettings.darkMode,
      onChange: (value: boolean) => setQuickSettings({ ...quickSettings, darkMode: value }),
      color: 'purple',
    },
    {
      id: 'notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      label: 'Thông báo',
      value: quickSettings.notifications,
      onChange: (value: boolean) => setQuickSettings({ ...quickSettings, notifications: value }),
      color: 'yellow',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <AnimatedCard delay={0} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🎨 Phase 2 - UX/UI Showcase</h1>
              <p className="text-blue-100 text-lg">Advanced animations & interactive components</p>
            </div>
            <div className="text-6xl animate-bounce-subtle">✨</div>
          </div>
        </AnimatedCard>

        {/* Progress Rings Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard delay={100} hover className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Dung lượng sử dụng</h3>
            <div className="flex justify-center">
              <ProgressRing percentage={75} showLabel color="#3b82f6" />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              7.5 GB / 10 GB
            </p>
          </AnimatedCard>

          <AnimatedCard delay={200} hover className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Mức độ bảo vệ</h3>
            <div className="flex justify-center">
              <ProgressRing percentage={92} showLabel label="A+" />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Xuất sắc
            </p>
          </AnimatedCard>

          <AnimatedCard delay={300} hover className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Hiệu suất</h3>
            <div className="flex justify-center">
              <ProgressRing percentage={45} showLabel />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Đang tối ưu
            </p>
          </AnimatedCard>
        </div>

        {/* Buttons Showcase */}
        <AnimatedCard delay={400} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Ripple Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <RippleButton variant="primary" onClick={() => alert('Primary clicked!')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Primary
            </RippleButton>

            <RippleButton variant="secondary" onClick={() => alert('Secondary clicked!')}>
              Secondary
            </RippleButton>

            <RippleButton variant="danger" onClick={() => alert('Danger clicked!')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </RippleButton>

            <RippleButton variant="ghost" onClick={() => alert('Ghost clicked!')}>
              Ghost
            </RippleButton>
          </div>
        </AnimatedCard>

        {/* Form Inputs Section */}
        <AnimatedCard delay={500} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Real-time Validation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              required
              validate={validateEmail}
              validateOnChange
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
              hint="Chúng tôi sẽ không chia sẻ email của bạn"
            />

            <FormInput
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
              validate={validatePassword}
              validateOnBlur
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              hint="Ít nhất 8 ký tự, 1 chữ hoa, 1 số"
            />
          </div>
        </AnimatedCard>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard delay={600} hover className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
            </div>
            <p className="text-green-100">Smooth 60fps animations with optimized performance</p>
          </AnimatedCard>

          <AnimatedCard delay={700} hover className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Beautiful Design</h3>
            </div>
            <p className="text-purple-100">Modern, clean interface with attention to detail</p>
          </AnimatedCard>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton actions={fabActions} position="bottom-right" size="lg" />

      {/* Quick Settings Panel */}
      <QuickSettingsPanel
        isOpen={isQuickPanelOpen}
        onClose={() => setIsQuickPanelOpen(false)}
        settings={quickSettingsConfig}
        position="right"
      />
    </div>
  );
};

export default Phase2Demo;
