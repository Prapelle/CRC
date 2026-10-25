import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import ExecutiveOverview from './pages/ExecutiveOverview';
import MarketingPerformance from './pages/MarketingPerformance';
import SocialContent from './pages/SocialContent';
import WebsiteAnalytics from './pages/WebsiteAnalytics';
import LeadManagement from './pages/LeadManagement';
import QuotationManagement from './pages/QuotationManagement';
import SalesManagement from './pages/SalesManagement';
import DataQuality from './pages/DataQuality';
import ExportCenter from './pages/ExportCenter';
import Settings from './pages/Settings';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { dataLoading, dataLoadError, dataReady, refresh } = useData();
  const [currentPage, setCurrentPage] = useState('executive');

  if (!isAuthenticated) {
    return <Login />;
  }

  if (dataLoading || (!dataReady && !dataLoadError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="font-medium text-slate-800">กำลังโหลดข้อมูล CRC จากฐานข้อมูลส่วนกลาง</p>
          <p className="mt-1 text-sm text-slate-500">กรุณารอสักครู่ก่อนเริ่มแก้ไขข้อมูล</p>
        </div>
      </div>
    );
  }

  if (dataLoadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">เชื่อมต่อข้อมูลส่วนกลางไม่สำเร็จ</h2>
          <p className="mt-2 break-words text-sm text-slate-600">{dataLoadError}</p>
          <p className="mt-2 text-sm text-slate-500">
            ข้อมูลยังไม่พร้อมใช้งาน ระบบจึงปิดการแก้ไขชั่วคราวเพื่อป้องกันการบันทึกทับข้อมูลเดิม
          </p>
          <button
            onClick={() => void refresh()}
            className="mt-5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            ลองเชื่อมต่ออีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'executive': return <ExecutiveOverview />;
      case 'marketing': return <MarketingPerformance />;
      case 'social': return <SocialContent />;
      case 'website': return <WebsiteAnalytics />;
      case 'leads': return <LeadManagement />;
      case 'quotations': return <QuotationManagement />;
      case 'sales': return <SalesManagement />;
      case 'quality': return <DataQuality />;
      case 'export': return <ExportCenter />;
      case 'settings': return <Settings />;
      default: return <ExecutiveOverview />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
