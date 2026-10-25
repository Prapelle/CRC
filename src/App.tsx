import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
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
  const [currentPage, setCurrentPage] = useState('executive');

  if (!isAuthenticated) {
    return <Login />;
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
