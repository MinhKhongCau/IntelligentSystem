import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisibility: 'PUBLIC',
      dataSharing: false,
      analytics: true
    },
    system: {
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      theme: 'light'
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load user settings - replace with actual API call
    const loadSettings = async () => {
      // Mock settings data
      setSettings({
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          profileVisibility: 'PUBLIC',
          dataSharing: false,
          analytics: true
        },
        system: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh',
          theme: 'light'
        }
      });
    };

    loadSettings();
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Cài đặt đã được lưu thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Có lỗi xảy ra khi lưu cài đặt.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định?')) {
      setSettings({
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          profileVisibility: 'PUBLIC',
          dataSharing: false,
          analytics: true
        },
        system: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh',
          theme: 'light'
        }
      });
      setMessage('Cài đặt đã được đặt lại về mặc định.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p className="mt-2 text-gray-600">Quản lý cài đặt tài khoản và hệ thống</p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Thông báo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email thông báo</h4>
                  <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">SMS thông báo</h4>
                  <p className="text-sm text-gray-500">Nhận thông báo qua tin nhắn SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Push thông báo</h4>
                  <p className="text-sm text-gray-500">Nhận thông báo push trên trình duyệt</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quyền riêng tư</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hiển thị hồ sơ
                </label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="PUBLIC">Công khai</option>
                  <option value="PRIVATE">Riêng tư</option>
                  <option value="FRIENDS">Chỉ bạn bè</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Chia sẻ dữ liệu</h4>
                  <p className="text-sm text-gray-500">Cho phép chia sẻ dữ liệu với bên thứ ba</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.dataSharing}
                    onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Phân tích sử dụng</h4>
                  <p className="text-sm text-gray-500">Cho phép thu thập dữ liệu phân tích</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.analytics}
                    onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Hệ thống</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ
                </label>
                <select
                  value={settings.system.language}
                  onChange={(e) => handleSettingChange('system', 'language', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Múi giờ
                </label>
                <select
                  value={settings.system.timezone}
                  onChange={(e) => handleSettingChange('system', 'timezone', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giao diện
                </label>
                <select
                  value={settings.system.theme}
                  onChange={(e) => handleSettingChange('system', 'theme', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                  <option value="auto">Tự động</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Tài khoản</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Đổi mật khẩu</h4>
                  <p className="text-sm text-gray-500">Cập nhật mật khẩu tài khoản</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Đổi mật khẩu
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Xóa tài khoản</h4>
                  <p className="text-sm text-gray-500">Xóa vĩnh viễn tài khoản và dữ liệu</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleResetSettings}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Đặt lại mặc định
          </button>
          
          <div className="flex space-x-4">
            <Link
              to="/profile"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Hủy
            </Link>
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

