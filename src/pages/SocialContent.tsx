import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { KPICard, ImportModal } from '../components/shared';
import { formatNumber } from '../data/store';
import { Upload, Heart, MessageCircle, Share2, Eye, MousePointer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function SocialContent() {
  const { data, addSocial, addImportJob } = useData();
  const [showImport, setShowImport] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = categoryFilter ? data.social.filter(s => s.content_category === categoryFilter) : data.social;
  const totalReach = filtered.reduce((s, i) => s + i.reach, 0);
  const totalEngagement = filtered.reduce((s, i) => s + i.engagement, 0);
  const totalReactions = filtered.reduce((s, i) => s + i.reactions, 0);
  const totalComments = filtered.reduce((s, i) => s + i.comments, 0);
  const totalShares = filtered.reduce((s, i) => s + i.shares, 0);
  const totalLinkClicks = filtered.reduce((s, i) => s + i.link_clicks, 0);
  const totalLeads = filtered.reduce((s, i) => s + i.leads_generated, 0);

  const categoryData = Object.entries(
    filtered.reduce((acc: Record<string, { reach: number; engagement: number; leads: number }>, item) => {
      const cat = item.content_category;
      if (!acc[cat]) acc[cat] = { reach: 0, engagement: 0, leads: 0 };
      acc[cat].reach += item.reach;
      acc[cat].engagement += item.engagement;
      acc[cat].leads += item.leads_generated;
      return acc;
    }, {})
  ).map(([name, d]) => ({ name, ...d }));

  const topContent = [...filtered].sort((a, b) => b.reach - a.reach).slice(0, 5);

  const handleImport = (rows: Record<string, string>[]) => {
    const items = rows.map(r => ({
      id: '',
      platform: r['platform'] || r['Platform'] || 'Facebook',
      page_id: r['page_id'] || r['Page ID'] || '',
      page_name: r['page_name'] || r['Page Name'] || '',
      post_id: r['post_id'] || r['Post ID'] || '',
      post_url: r['post_url'] || r['Post URL'] || '',
      post_date: r['post_date'] || r['Post Date'] || '',
      metric_date: r['metric_date'] || r['Metric Date'] || '',
      content_type: r['content_type'] || r['Content Type'] || '',
      content_category: r['content_category'] || r['Content Category'] || '',
      reach: parseInt(r['reach'] || r['Reach'] || '0'),
      impressions: parseInt(r['impressions'] || r['Impressions'] || '0'),
      engagement: parseInt(r['engagement'] || r['Engagement'] || '0'),
      reactions: parseInt(r['reactions'] || r['Reactions'] || '0'),
      comments: parseInt(r['comments'] || r['Comments'] || '0'),
      shares: parseInt(r['shares'] || r['Shares'] || '0'),
      link_clicks: parseInt(r['link_clicks'] || r['Link Clicks'] || '0'),
      video_views: parseInt(r['video_views'] || r['Video Views'] || '0'),
      leads_generated: parseInt(r['leads_generated'] || r['Leads'] || '0'),
    }));
    const result = addSocial(items);
    addImportJob({ job_id: `IJ_${Date.now()}`, module: 'Social Content', file_name: 'import.csv', file_size: 0, status: 'Completed', total_rows: rows.length, new_rows: result.new, updated_rows: result.updated, skipped_rows: result.skipped, rejected_rows: result.rejected, errors: result.errors.map(e => ({ row: 0, field: '', message: e })), created_at: new Date().toISOString(), created_by: 'Admin' });
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Track content performance across social platforms</p>
        <button onClick={() => setShowImport(true)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          <Upload size={16} /> Import CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <KPICard title="Reach" value={formatNumber(totalReach)} icon={<Eye size={18} />} />
        <KPICard title="Engagement" value={formatNumber(totalEngagement)} icon={<Heart size={18} />} />
        <KPICard title="Reactions" value={formatNumber(totalReactions)} />
        <KPICard title="Comments" value={formatNumber(totalComments)} icon={<MessageCircle size={18} />} />
        <KPICard title="Shares" value={formatNumber(totalShares)} icon={<Share2 size={18} />} />
        <KPICard title="Link Clicks" value={formatNumber(totalLinkClicks)} icon={<MousePointer size={18} />} />
        <KPICard title="Leads" value={formatNumber(totalLeads)} color="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Performance by Content Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="reach" fill="#3b82f6" name="Reach" radius={[4, 4, 0, 0]} />
              <Bar dataKey="engagement" fill="#f97316" name="Engagement" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Content by Reach</h3>
          <div className="space-y-3">
            {topContent.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.content_category}</p>
                  <p className="text-xs text-gray-500">{item.platform} • {item.post_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{formatNumber(item.reach)}</p>
                  <p className="text-xs text-gray-500">reach</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">All Content</h3>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="text-xs border rounded px-2 py-1">
            <option value="">All Categories</option>
            {[...new Set(data.social.map(s => s.content_category))].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Platform</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-right">Reach</th>
                <th className="px-4 py-2 text-right">Engagement</th>
                <th className="px-4 py-2 text-right">Clicks</th>
                <th className="px-4 py-2 text-right">Leads</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.post_date}</td>
                  <td className="px-4 py-2"><span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">{item.platform}</span></td>
                  <td className="px-4 py-2">{item.content_category}</td>
                  <td className="px-4 py-2 text-gray-600">{item.content_type}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatNumber(item.reach)}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(item.engagement)}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(item.link_clicks)}</td>
                  <td className="px-4 py-2 text-right font-medium text-green-600">{item.leads_generated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Social Content Data" moduleName="Social" expectedColumns={['platform', 'post_id', 'post_date', 'metric_date', 'content_category', 'reach', 'engagement', 'leads']} onImport={handleImport} />
    </div>
  );
}
