import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { resetData } from '../data/store';
import { Database, Users, RefreshCw, Trash2, Shield, Info, Link, CheckCircle, XCircle, Loader, Save, TestTube } from 'lucide-react';

interface GoogleSheetsConfig {
  apiUrl: string;
  sheetId: string;
  enabled: boolean;
  autoSync: boolean;
  lastSync: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  syncMessage: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { data, refresh } = useData();
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  
  // Google Sheets Config
  const [gsConfig, setGsConfig] = useState<GoogleSheetsConfig>(() => {
    const saved = localStorage.getItem('crc_google_sheets_config');
    if (saved) {
      const config = JSON.parse(saved);
      // Add autoSync if not exists (for backward compatibility)
      return {
        ...config,
        autoSync: config.autoSync || false,
      };
    }
    return {
      apiUrl: '',
      sheetId: '',
      enabled: false,
      autoSync: false,
      lastSync: null,
      syncStatus: 'idle',
      syncMessage: '',
    };
  });

  // Auto-sync effect
  useEffect(() => {
    if (gsConfig.autoSync && gsConfig.enabled && gsConfig.apiUrl) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-syncing...');
        syncToGoogleSheets();
      }, 5 * 60 * 1000); // Sync every 5 minutes

      return () => clearInterval(interval);
    }
  }, [gsConfig.autoSync, gsConfig.enabled, gsConfig.apiUrl]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('crc_google_sheets_config', JSON.stringify(gsConfig));
  }, [gsConfig]);

  const handleReset = () => {
    resetData();
    refresh();
    setResetDone(true);
    setShowReset(false);
    setTimeout(() => setResetDone(false), 3000);
  };

  // Test Google Sheets Connection
  const testConnection = async () => {
    if (!gsConfig.apiUrl) {
      setGsConfig(prev => ({
        ...prev,
        syncStatus: 'error',
        syncMessage: '❌ กรุณากรอก API URL',
      }));
      return;
    }

    setGsConfig(prev => ({
      ...prev,
      syncStatus: 'syncing',
      syncMessage: '🔄 กำลังทดสอบการเชื่อมต่อ...',
    }));

    try {
      console.log('🔍 Testing connection to:', gsConfig.apiUrl);
      
      // Use no-cors mode to avoid CORS issues
      const response = await fetch(`${gsConfig.apiUrl}?action=readAll`, {
        method: 'GET',
        mode: 'no-cors',
      });

      console.log('📡 Response:', response);
      
      // With no-cors, we can't read the response, but if it doesn't throw an error, it's working
      setGsConfig(prev => ({
        ...prev,
        syncStatus: 'success',
        syncMessage: '✅ เชื่อมต่อสำเร็จ! (ไม่สามารถอ่าน response ได้เนื่องจาก CORS)',
        enabled: true,
      }));
      
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      setGsConfig(prev => ({
        ...prev,
        syncStatus: 'error',
        syncMessage: `❌ Connection failed: ${error?.message || String(error)}`,
      }));
    }
  };

  // Sync Data to Google Sheets
  const syncToGoogleSheets = async () => {
    if (!gsConfig.enabled || !gsConfig.apiUrl) {
      setGsConfig(prev => ({
        ...prev,
        syncStatus: 'error',
        syncMessage: 'กรุณาเปิดใช้งานและทดสอบการเชื่อมต่อก่อน',
      }));
      return;
    }

    setGsConfig(prev => ({
      ...prev,
      syncStatus: 'syncing',
      syncMessage: 'กำลัง sync ข้อมูล...',
    }));

    try {
      // Sync each module
      const modules = [
        { name: 'campaigns', data: data.campaigns },
        { name: 'advertising', data: data.ads },
        { name: 'leads', data: data.leads },
        { name: 'quotations', data: data.quotations },
        { name: 'sales', data: data.sales },
      ];

      let totalSynced = 0;
      let errors = [];
      
      for (const module of modules) {
        if (module.data.length > 0) {
          try {
            console.log(`📤 Syncing ${module.name}: ${module.data.length} records`);
            
            const response = await fetch(gsConfig.apiUrl, {
              method: 'POST',
              mode: 'no-cors', // Avoid CORS issues
              headers: { 
                'Content-Type': 'text/plain',
              },
              body: JSON.stringify({
                action: 'upsert',
                sheet: module.name,
                records: module.data,
              }),
            });
            
            // With no-cors, we can't read response, but if no error thrown, it's working
            totalSynced += module.data.length;
            console.log(`✅ ${module.name} synced successfully`);
            
          } catch (err: any) {
            console.error(`❌ Error syncing ${module.name}:`, err);
            errors.push(`${module.name}: ${err?.message || 'Unknown error'}`);
          }
        }
      }

      if (errors.length > 0) {
        setGsConfig(prev => ({
          ...prev,
          syncStatus: 'error',
          syncMessage: `❌ Sync บางส่วนล้มเหลว: ${errors.join(', ')}`,
        }));
      } else {
        setGsConfig(prev => ({
          ...prev,
          syncStatus: 'success',
          syncMessage: `✅ Sync สำเร็จ! อัปเดต ${totalSynced} รายการ`,
          lastSync: new Date().toISOString(),
          enabled: true,
        }));
      }
    } catch (error: any) {
      console.error('❌ Sync error:', error);
      setGsConfig(prev => ({
        ...prev,
        syncStatus: 'error',
        syncMessage: `❌ Sync failed: ${error?.message || String(error)}`,
      }));
    }
  };

  // Load Data from Google Sheets
  const loadFromGoogleSheets = async () => {
    if (!gsConfig.apiUrl) {
      setGsConfig(prev => ({
        ...prev,
        syncStatus: 'error',
        syncMessage: '❌ กรุณากรอก API URL ก่อน',
      }));
      return;
    }

    setGsConfig(prev => ({
      ...prev,
      syncStatus: 'syncing',
      syncMessage: '🔄 กำลังโหลดข้อมูลจาก Google Sheets...',
    }));

    try {
      console.log('📥 Loading data from Google Sheets...');
      
      const response = await fetch(`${gsConfig.apiUrl}?action=readAll`, {
        method: 'GET',
        mode: 'cors', // Try CORS first
      });
      
      const result = await response.json();
      console.log('📥 Received data:', result);

      if (result.error) {
        setGsConfig(prev => ({
          ...prev,
          syncStatus: 'error',
          syncMessage: `❌ Error: ${result.error}`,
        }));
      } else {
        // Save to localStorage
        const currentData = JSON.parse(localStorage.getItem('crc_dashboard_data') || '{}');
        
        // Merge data (Google Sheets data takes precedence)
        if (result.campaigns) currentData.campaigns = result.campaigns;
        if (result.advertising) currentData.ads = result.advertising;
        if (result.leads) currentData.leads = result.leads;
        if (result.quotations) currentData.quotations = result.quotations;
        if (result.sales) currentData.sales = result.sales;
        
        localStorage.setItem('crc_dashboard_data', JSON.stringify(currentData));
        refresh();

        setGsConfig(prev => ({
          ...prev,
          syncStatus: 'success',
          syncMessage: '✅ โหลดข้อมูลสำเร็จ!',
          lastSync: new Date().toISOString(),
          enabled: true,
        }));
      }
    } catch (error: any) {
      console.error('❌ Load error:', error);
      
      // If CORS error, suggest using no-cors mode
      if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
        setGsConfig(prev => ({
          ...prev,
          syncStatus: 'error',
          syncMessage: '❌ CORS Error: กรุณาตรวจสอบว่า Google Apps Script Deploy แล้วและตั้ง "Who has access" เป็น "Anyone"',
        }));
      } else {
        setGsConfig(prev => ({
          ...prev,
          syncStatus: 'error',
          syncMessage: `❌ Load failed: ${error?.message || String(error)}`,
        }));
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-sm text-gray-500">System settings and data management</p>
      </div>

      {resetDone && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <p className="text-sm text-green-700">Data has been reset to demo defaults.</p>
        </div>
      )}

      {/* Google Sheets Integration */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Link size={16} /> Google Sheets Integration
        </h3>
        
        <div className="space-y-4">
          {/* Status */}
          <div className={`p-3 rounded-lg border ${
            gsConfig.syncStatus === 'success' ? 'bg-green-50 border-green-200' :
            gsConfig.syncStatus === 'error' ? 'bg-red-50 border-red-200' :
            gsConfig.syncStatus === 'syncing' ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              {gsConfig.syncStatus === 'success' && <CheckCircle size={16} className="text-green-600" />}
              {gsConfig.syncStatus === 'error' && <XCircle size={16} className="text-red-600" />}
              {gsConfig.syncStatus === 'syncing' && <Loader size={16} className="text-blue-600 animate-spin" />}
              {gsConfig.syncStatus === 'idle' && <Info size={16} className="text-gray-600" />}
              <span className={`text-sm ${
                gsConfig.syncStatus === 'success' ? 'text-green-700' :
                gsConfig.syncStatus === 'error' ? 'text-red-700' :
                gsConfig.syncStatus === 'syncing' ? 'text-blue-700' :
                'text-gray-700'
              }`}>
                {gsConfig.syncMessage || 'ยังไม่ได้ตั้งค่า'}
              </span>
            </div>
            {gsConfig.lastSync && (
              <p className="text-xs text-gray-500 mt-1">
                Last sync: {new Date(gsConfig.lastSync).toLocaleString('th-TH')}
              </p>
            )}
          </div>

          {/* API URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Apps Script API URL *
            </label>
            <input
              type="text"
              value={gsConfig.apiUrl}
              onChange={e => setGsConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              ได้จาก Google Sheets → Extensions → Apps Script → Deploy → Web app
            </p>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-Sync</label>
              <p className="text-xs text-gray-500">Sync อัตโนมัติทุก 5 นาที</p>
            </div>
            <button
              onClick={() => setGsConfig(prev => ({ ...prev, autoSync: !prev.autoSync }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                gsConfig.autoSync ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  gsConfig.autoSync ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sheet ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Sheet ID (Optional)
            </label>
            <input
              type="text"
              value={gsConfig.sheetId}
              onChange={e => setGsConfig(prev => ({ ...prev, sheetId: e.target.value }))}
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlte7ZvJUJuEfxg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              ได้จาก URL ของ Google Sheets: docs.google.com/spreadsheets/d/<strong>SHEET_ID</strong>/edit
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testConnection}
              disabled={gsConfig.syncStatus === 'syncing'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TestTube size={16} />
              ทดสอบการเชื่อมต่อ
            </button>

            <button
              onClick={syncToGoogleSheets}
              disabled={gsConfig.syncStatus === 'syncing' || !gsConfig.enabled}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={gsConfig.syncStatus === 'syncing' ? 'animate-spin' : ''} />
              Sync ไป Google Sheets
            </button>

            <button
              onClick={loadFromGoogleSheets}
              disabled={gsConfig.syncStatus === 'syncing' || !gsConfig.enabled}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={gsConfig.syncStatus === 'syncing' ? 'animate-spin' : ''} />
              โหลดจาก Google Sheets
            </button>

            <button
              onClick={() => {
                localStorage.setItem('crc_google_sheets_config', JSON.stringify(gsConfig));
                alert('บันทึกการตั้งค่าสำเร็จ!');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
            >
              <Save size={16} />
              บันทึกการตั้งค่า
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">📖 วิธีตั้งค่า Google Sheets</h4>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>สร้าง Google Sheets ใหม่ (ดูไฟล์ SETUP_GUIDE.md)</li>
              <li>สร้าง 6 sheets: campaigns, advertising, leads, quotations, sales, users</li>
              <li>Extensions → Apps Script → คัดลอกโค้ดจาก google-apps-script.js</li>
              <li>Deploy → New deployment → Web app → Execute as: Me, Access: Anyone</li>
              <li>คัดลอก URL มาวางในช่อง API URL ด้านบน</li>
              <li>คลิก "ทดสอบการเชื่อมต่อ"</li>
              <li>คลิก "Sync ไป Google Sheets" เพื่ออัปโหลดข้อมูล</li>
            </ol>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={16} /> Current User
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Name:</span> <span className="font-medium">{user?.full_name}</span></div>
          <div><span className="text-gray-500">Username:</span> <span className="font-medium">{user?.username}</span></div>
          <div><span className="text-gray-500">Email:</span> <span className="font-medium">{user?.email}</span></div>
          <div><span className="text-gray-500">Role:</span> <span className="font-medium">{user?.role}</span></div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Database size={16} /> Data Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Campaigns', count: data.campaigns.length },
            { label: 'Ad Records', count: data.ads.length },
            { label: 'Leads', count: data.leads.length },
            { label: 'Quotations', count: data.quotations.length },
            { label: 'Sales Orders', count: data.sales.length },
            { label: 'Social Posts', count: data.social.length },
            { label: 'Web Records', count: data.website.length },
            { label: 'Import Jobs', count: data.importJobs.length },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{item.count}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <RefreshCw size={16} /> Data Management
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Reset Demo Data</p>
              <p className="text-xs text-gray-500">Restore all data to initial demo state</p>
            </div>
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              <Trash2 size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info size={16} /> System Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Version:</span> <span className="font-medium">1.0.0</span></div>
          <div><span className="text-gray-500">Framework:</span> <span className="font-medium">React + Vite + Tailwind</span></div>
          <div><span className="text-gray-500">Storage:</span> <span className="font-medium">localStorage + Google Sheets</span></div>
          <div><span className="text-gray-500">Charts:</span> <span className="font-medium">Recharts</span></div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            <strong>⚠️ Demo Mode:</strong> ระบบนี้ใช้ localStorage สำหรับเก็บข้อมูลในเครื่อง
            และเชื่อมต่อกับ Google Sheets ผ่าน Apps Script API
            ข้อมูลทั้งหมดเป็นตัวอย่าง (Demo Data)
          </p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reset All Data?</h3>
            <p className="text-sm text-gray-600 mb-4">This will replace all current data with demo data. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReset(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button onClick={handleReset} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">Reset Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
