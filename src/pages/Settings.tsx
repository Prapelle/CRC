import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { resetData } from '../data/store';
import { Database, Users, RefreshCw, Trash2, Shield, Info } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { data, refresh } = useData();
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetData();
    refresh();
    setResetDone(true);
    setShowReset(false);
    setTimeout(() => setResetDone(false), 3000);
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
            { label: 'Social Posts', count: data.social.length },
            { label: 'Web Records', count: data.website.length },
            { label: 'Leads', count: data.leads.length },
            { label: 'Quotations', count: data.quotations.length },
            { label: 'Sales Orders', count: data.sales.length },
            { label: 'Import Jobs', count: data.importJobs.length },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{item.count}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permissions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield size={16} /> Role Permissions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Module</th>
                <th className="px-3 py-2 text-center">Admin</th>
                <th className="px-3 py-2 text-center">Management</th>
                <th className="px-3 py-2 text-center">Marketing</th>
                <th className="px-3 py-2 text-center">Sales</th>
                <th className="px-3 py-2 text-center">Analyst</th>
              </tr>
            </thead>
            <tbody>
              {[
                { module: 'Executive Overview', roles: [true, true, true, true, true] },
                { module: 'Marketing Performance', roles: [true, true, true, false, true] },
                { module: 'Social & Content', roles: [true, true, true, false, true] },
                { module: 'Website Analytics', roles: [true, true, true, false, true] },
                { module: 'Lead Management', roles: [true, true, true, true, true] },
                { module: 'Quotation Management', roles: [true, true, false, true, true] },
                { module: 'Sales Management', roles: [true, true, false, true, true] },
                { module: 'Data Quality', roles: [true, true, true, true, true] },
                { module: 'Export Center', roles: [true, true, true, true, true] },
                { module: 'Settings', roles: [true, true, false, false, true] },
              ].map(row => (
                <tr key={row.module} className="border-t">
                  <td className="px-3 py-2 font-medium text-gray-700">{row.module}</td>
                  {row.roles.map((has, i) => (
                    <td key={i} className="px-3 py-2 text-center">
                      {has ? <span className="text-green-500">✓</span> : <span className="text-gray-300">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Status Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Lead Status Pipeline</h3>
        <div className="flex flex-wrap gap-2">
          {['New Lead', 'Contacting', 'Contacted', 'Requirement Gathering', 'Qualified', 'Quotation Requested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'].map((status, i) => (
            <div key={status} className="flex items-center gap-1">
              <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">{i + 1}. {status}</span>
              {i < 10 && <span className="text-gray-300">→</span>}
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
          <div><span className="text-gray-500">Storage:</span> <span className="font-medium">localStorage (Demo)</span></div>
          <div><span className="text-gray-500">Charts:</span> <span className="font-medium">Recharts</span></div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            <strong>⚠️ Demo Mode:</strong> This system uses localStorage for data persistence.
            All data is sample/demo data. In production, this would connect to Supabase database
            with Google Sheets integration and Looker Studio connectivity.
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
