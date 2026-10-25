import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { KPICard, ImportModal } from '../components/shared';
import { formatNumber, formatPercent } from '../data/store';
import { Upload, Globe, Users, MousePointer, FileText, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function WebsiteAnalytics() {
  const { data, addWebsite, addImportJob } = useData();
  const [showImport, setShowImport] = useState(false);

  const totalSessions = data.website.reduce((s, w) => s + w.sessions, 0);
  const totalUsers = data.website.reduce((s, w) => s + w.users, 0);
  const totalNewUsers = data.website.reduce((s, w) => s + w.new_users, 0);
  const totalPageViews = data.website.reduce((s, w) => s + w.page_views, 0);
  const totalFormSubmissions = data.website.reduce((s, w) => s + w.form_submissions, 0);
  const totalClickToCall = data.website.reduce((s, w) => s + w.click_to_call, 0);
  const totalLineClicks = data.website.reduce((s, w) => s + w.line_clicks, 0);
  const totalProductInquiry = data.website.reduce((s, w) => s + w.product_inquiry, 0);
  const avgEngagementRate = data.website.length > 0 ? data.website.reduce((s, w) => s + w.engagement_rate, 0) / data.website.length : 0;

  const sourceData = Object.entries(
    data.website.reduce((acc: Record<string, number>, w) => {
      const key = `${w.source}/${w.medium}`;
      acc[key] = (acc[key] || 0) + w.sessions;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const landingPageData = Object.entries(
    data.website.reduce((acc: Record<string, { sessions: number; conversions: number }>, w) => {
      if (!acc[w.landing_page]) acc[w.landing_page] = { sessions: 0, conversions: 0 };
      acc[w.landing_page].sessions += w.sessions;
      acc[w.landing_page].conversions += w.form_submissions + w.click_to_call;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.sessions - a.sessions);

  const handleImport = (rows: Record<string, string>[], sourceFileName = 'import.csv') => {
    // Helper function to get value with multiple possible column names
    const getValue = (r: Record<string, string>, keys: string[]): string => {
      for (const key of keys) {
        const value = r[key];
        if (value && value.trim() !== '') {
          return value.trim();
        }
      }
      return '';
    };

    const getNumber = (r: Record<string, string>, keys: string[]): number => {
      const value = getValue(r, keys);
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };

    const items = rows.map(r => ({
      id: '',
      date: getValue(r, ['date', 'Date', 'day', 'Day']),
      source: getValue(r, ['source', 'Source', 'traffic_source']),
      medium: getValue(r, ['medium', 'Medium']),
      campaign: getValue(r, ['campaign', 'Campaign']),
      landing_page: getValue(r, ['landing_page', 'Landing Page', 'landingPage', 'page', 'Page', 'url', 'URL']),
      sessions: getNumber(r, ['sessions', 'Sessions', 'session']),
      users: getNumber(r, ['users', 'Users', 'user']),
      new_users: getNumber(r, ['new_users', 'New Users', 'newUsers']),
      engaged_sessions: getNumber(r, ['engaged_sessions', 'Engaged Sessions', 'engagedSessions']),
      engagement_rate: getNumber(r, ['engagement_rate', 'Engagement Rate', 'engagementRate']),
      page_views: getNumber(r, ['page_views', 'Page Views', 'pageViews', 'views', 'Views']),
      key_events: getNumber(r, ['key_events', 'Key Events', 'keyEvents', 'events', 'Events']),
      form_submissions: getNumber(r, ['form_submissions', 'Form Submissions', 'formSubmissions', 'forms', 'submissions']),
      click_to_call: getNumber(r, ['click_to_call', 'Click to Call', 'clickToCall', 'calls', 'Calls']),
      line_clicks: getNumber(r, ['line_clicks', 'LINE Clicks', 'lineClicks', 'line', 'LINE']),
      product_inquiry: getNumber(r, ['product_inquiry', 'Product Inquiry', 'productInquiry', 'inquiries', 'Inquiries']),
      source_file: sourceFileName,
      source_data_json: JSON.stringify(r),
      boq_upload: getNumber(r, ['boq_upload', 'BOQ Upload', 'boqUpload', 'uploads', 'Uploads']),
    }));
    const result = addWebsite(items);
    addImportJob({ job_id: `IJ_${Date.now()}`, module: 'Website Analytics', file_name: sourceFileName, file_size: 0, status: 'Completed', total_rows: rows.length, new_rows: result.new, updated_rows: result.updated, skipped_rows: result.skipped, rejected_rows: result.rejected, errors: result.errors.map(e => ({ row: 0, field: '', message: e })), created_at: new Date().toISOString(), created_by: 'Admin' });
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Analyze website traffic and conversion performance</p>
        <button onClick={() => setShowImport(true)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          <Upload size={16} /> Import CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <KPICard title="Sessions" value={formatNumber(totalSessions)} icon={<Globe size={18} />} />
        <KPICard title="Users" value={formatNumber(totalUsers)} icon={<Users size={18} />} />
        <KPICard title="New Users" value={formatNumber(totalNewUsers)} />
        <KPICard title="Page Views" value={formatNumber(totalPageViews)} />
        <KPICard title="Engagement Rate" value={formatPercent(avgEngagementRate)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Form Submissions" value={formatNumber(totalFormSubmissions)} icon={<FileText size={18} />} color="bg-blue-50" />
        <KPICard title="Click to Call" value={formatNumber(totalClickToCall)} icon={<Phone size={18} />} color="bg-green-50" />
        <KPICard title="LINE Clicks" value={formatNumber(totalLineClicks)} color="bg-teal-50" />
        <KPICard title="Product Inquiry" value={formatNumber(totalProductInquiry)} icon={<MousePointer size={18} />} color="bg-purple-50" />
        <KPICard title="BOQ Uploads" value={formatNumber(data.website.reduce((s, w) => s + w.boq_upload, 0))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Traffic by Source/Medium</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Landing Pages</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={landingPageData.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
              <Tooltip />
              <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b"><h3 className="text-sm font-semibold text-gray-800">Website Analytics Data</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Medium</th>
                <th className="px-4 py-2 text-left">Landing Page</th>
                <th className="px-4 py-2 text-right">Sessions</th>
                <th className="px-4 py-2 text-right">Users</th>
                <th className="px-4 py-2 text-right">Eng. Rate</th>
                <th className="px-4 py-2 text-right">Forms</th>
                <th className="px-4 py-2 text-right">Calls</th>
              </tr>
            </thead>
            <tbody>
              {data.website.map(w => (
                <tr key={w.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{w.date}</td>
                  <td className="px-4 py-2">{w.source}</td>
                  <td className="px-4 py-2 text-gray-600">{w.medium}</td>
                  <td className="px-4 py-2 text-gray-600 max-w-[200px] truncate">{w.landing_page}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatNumber(w.sessions)}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(w.users)}</td>
                  <td className="px-4 py-2 text-right">{formatPercent(w.engagement_rate)}</td>
                  <td className="px-4 py-2 text-right text-blue-600">{w.form_submissions}</td>
                  <td className="px-4 py-2 text-right text-green-600">{w.click_to_call}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Website Analytics" moduleName="Website" expectedColumns={['date', 'source', 'medium', 'landing_page', 'sessions', 'users', 'form_submissions']} onImport={handleImport} />
    </div>
  );
}
