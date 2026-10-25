import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Database, Users, RefreshCw, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Settings() {
  const { user } = useAuth();
  const { data, refresh } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    setMessage('');
    try {
      await refresh();
      setMessage('ส่งคำขอโหลดข้อมูลส่วนกลางแล้ว');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-sm text-gray-500">System settings and data management</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ShieldCheck size={16} /> Database &amp; Security
        </h3>
        <div className={`p-4 rounded-lg border ${isSupabaseConfigured ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2">
            {isSupabaseConfigured ? <CheckCircle2 size={18} className="text-green-600" /> : <Info size={18} className="text-amber-600" />}
            <p className={`text-sm font-medium ${isSupabaseConfigured ? 'text-green-800' : 'text-amber-800'}`}>
              {isSupabaseConfigured ? 'Supabase client configured' : 'Supabase environment variables are missing'}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            ข้อมูลของทุกผู้ใช้ที่เข้าสู่ระบบจะอยู่ในฐานข้อมูลส่วนกลางเดียวกัน ไม่ใช้ Google Sheets หรือข้อมูลตัวอย่างใน browser อีกต่อไป
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ต้องตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_PUBLISHABLE_KEY ใน Netlify และรันไฟล์ supabase/schema.sql ใน Supabase SQL Editor
          </p>
        </div>
        {message && <p className="text-sm text-green-700 mt-3">{message}</p>}
        <button onClick={handleRefresh} disabled={refreshing}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          โหลดข้อมูลส่วนกลางอีกครั้ง
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={16} /> Current User
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Name:</span> <span className="font-medium">{user?.full_name ?? '-'}</span></div>
          <div><span className="text-gray-500">Email:</span> <span className="font-medium">{user?.email ?? '-'}</span></div>
          <div><span className="text-gray-500">Role:</span> <span className="font-medium">{user?.role ?? '-'}</span></div>
        </div>
      </div>

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

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Info size={16} /> System Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Version:</span> <span className="font-medium">1.1.0</span></div>
          <div><span className="text-gray-500">Framework:</span> <span className="font-medium">React + Vite</span></div>
          <div><span className="text-gray-500">Storage:</span> <span className="font-medium">Supabase PostgreSQL</span></div>
          <div><span className="text-gray-500">Imports:</span> <span className="font-medium">CSV / Excel per module</span></div>
        </div>
      </div>
    </div>
  );
}
