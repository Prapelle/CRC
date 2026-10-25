import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  LayoutDashboard, Megaphone, Share2, Globe, Users, FileText,
  ShoppingCart, ShieldCheck, Download, Settings, Menu, X, LogOut,
  ChevronRight, AlertTriangle, Bell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'executive', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'marketing', label: 'Marketing Performance', icon: Megaphone },
  { id: 'social', label: 'Social & Content', icon: Share2 },
  { id: 'website', label: 'Website Analytics', icon: Globe },
  { id: 'leads', label: 'Lead Management', icon: Users },
  { id: 'quotations', label: 'Quotation Management', icon: FileText },
  { id: 'sales', label: 'Sales Management', icon: ShoppingCart },
  { id: 'quality', label: 'Data Quality', icon: ShieldCheck },
  { id: 'export', label: 'Export Center', icon: Download },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useAuth();
  const { getQualityIssues } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const issues = getQualityIssues();
  const highIssues = issues.filter(i => i.severity === 'High').length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">CRC</div>
            <div>
              <h1 className="font-bold text-sm">CRC Steel</h1>
              <p className="text-xs text-slate-400">Marketing & Sales</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'quality' && highIssues > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{highIssues}</span>
                )}
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-slate-400">{user?.role || ''}</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-400" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
            </h2>
            <span className="hidden sm:inline-block text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              ⚠️ Demo Data
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              {highIssues > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {highIssues}
                </span>
              )}
            </button>
            {highIssues > 0 && (
              <button
                onClick={() => onNavigate('quality')}
                className="hidden sm:flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md hover:bg-red-100"
              >
                <AlertTriangle size={12} />
                {highIssues} issues
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
