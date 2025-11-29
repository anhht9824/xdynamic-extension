import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  Settings as SettingsIcon, 
  Brain,
  Bell,
  Shield,
  Save,
  RotateCcw,
  Download,
  Calendar,
  CheckCircle
} from 'lucide-react';

type TabType = 'general' | 'ai-model' | 'notifications' | 'security';

import { adminService, SystemSettingItem } from '../services/admin.service';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const [isLoading, setIsLoading] = useState(false);
  const { toasts, success, error } = useToast();

  // Local state for form inputs (initialized from settings)
  const [autoModerate, setAutoModerate] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [threshold, setThreshold] = useState(80);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSystemSettings();
        const settingsMap: Record<string, string> = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });

        
        // Initialize local state
        if (settingsMap['auto_moderate']) setAutoModerate(settingsMap['auto_moderate'] === 'true');
        if (settingsMap['api_key']) setApiKey(settingsMap['api_key']);
        if (settingsMap['threshold']) setThreshold(Number(settingsMap['threshold']));
        if (settingsMap['email_notifications']) setEmailNotifications(settingsMap['email_notifications'] === 'true');
        if (settingsMap['slack_notifications']) setSlackNotifications(settingsMap['slack_notifications'] === 'true');
        if (settingsMap['two_factor_auth']) setTwoFactorAuth(settingsMap['two_factor_auth'] === 'true');
        
      } catch (err) {
        console.error('Failed to fetch settings', err);
        error('Failed to load settings');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    const updatedSettings: SystemSettingItem[] = [
      { key: 'auto_moderate', value: String(autoModerate), description: 'Auto-moderate content' },
      { key: 'api_key', value: apiKey, description: 'API Key for external services' },
      { key: 'threshold', value: String(threshold), description: 'Detection threshold percentage' },
      { key: 'email_notifications', value: String(emailNotifications), description: 'Enable email notifications' },
      { key: 'slack_notifications', value: String(slackNotifications), description: 'Enable Slack notifications' },
      { key: 'two_factor_auth', value: String(twoFactorAuth), description: 'Enable 2FA' },
    ];

    try {
      await adminService.updateSystemSettings(updatedSettings);
      success('Settings saved successfully');
    } catch (err) {
      error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general' as TabType, label: 'General', icon: SettingsIcon },
    { id: 'ai-model' as TabType, label: 'AI Model', icon: Brain },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'security' as TabType, label: 'Security', icon: Shield },
  ];

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure your XDynamic system preferences</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">99.9%</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  All systems operational
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last System Update</p>
                <p className="text-xl font-bold text-gray-900 mt-2">October 3, 2025</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Version 1.5.2
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Tabs and Content */}
        <div className="card overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-1 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-white'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  
                  {/* Auto-Moderate Toggle */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-900">Auto-Moderate Content</label>
                      <p className="text-sm text-gray-500 mt-1">
                        Automatically moderate content using AI detection
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoModerate(!autoModerate)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoModerate ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoModerate ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* API Key Input */}
                  <div className="py-4 border-b border-gray-200">
                    <label className="text-sm font-medium text-gray-900 block mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="input max-w-md"
                      placeholder="Enter your API key"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Your API key for integrating with XDynamic services
                    </p>
                  </div>

                  {/* Detection Threshold Slider */}
                  <div className="py-4">
                    <label className="text-sm font-medium text-gray-900 block mb-2">
                      Detection Threshold: {threshold}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full max-w-md h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Set the sensitivity level for content detection (higher = stricter)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Model Tab */}
            {activeTab === 'ai-model' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Configuration</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Current Model</p>
                      <p className="text-sm text-blue-700 mt-1">XDynamic AI v2.5 - Advanced Content Detection</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Model Version</span>
                    <span className="text-sm text-gray-600">v2.5.1</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Accuracy Rate</span>
                    <span className="text-sm font-semibold text-green-600">96.3%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Processing Speed</span>
                    <span className="text-sm text-gray-600">~180ms avg</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-gray-900">Last Training Date</span>
                    <span className="text-sm text-gray-600">September 28, 2025</span>
                  </div>
                </div>

                <button className="btn btn-primary">
                  Retrain Model with New Data
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive email alerts for flagged content and system updates
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailNotifications ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">Slack Integration</label>
                    <p className="text-sm text-gray-500 mt-1">
                      Send notifications to your Slack workspace
                    </p>
                  </div>
                  <button
                    onClick={() => setSlackNotifications(!slackNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      slackNotifications ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        slackNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-4">
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    Notification Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@xdynamic.com"
                    className="input max-w-md"
                    placeholder="Enter notification email"
                  />
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">Two-Factor Authentication</label>
                    <p className="text-sm text-gray-500 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      twoFactorAuth ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="input max-w-xs"
                    min="5"
                    max="120"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Auto-logout after period of inactivity
                  </p>
                </div>

                <div className="py-4">
                  <button className="btn btn-secondary">
                    View Security Logs
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="btn btn-secondary flex items-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Default</span>
              </button>
              <button className="btn btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Config</span>
              </button>
            </div>
            <button 
              className="btn btn-primary flex items-center space-x-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
