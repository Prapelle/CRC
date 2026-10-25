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

  const handleImport = (rows: Record<string, string>[], sourceFileName = 'import.csv') => {
    // Helper function to get value with multiple possible column names
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');
    const getValue = (r: Record<string, string>, keys: string[]): string => {
      for (const key of keys) if (r[key]?.trim()) return r[key].trim();
      const aliases = keys.map(normalize);
      const found = Object.entries(r).find(([key, value]) => value?.trim() && aliases.some(alias => normalize(key) === alias || normalize(key).startsWith(alias)));
      return found?.[1]?.trim() || '';
    };

    const getNumber = (r: Record<string, string>, keys: string[]): number => {
      const raw = getValue(r, keys).replace(/,/g, '').replace(/%/g, '').trim();
      const num = Number(raw.replace(/[^0-9.\-]/g, ''));
      return raw !== '' && Number.isFinite(num) ? num : 0;
    };

    const items = rows.map(r => ({
      id: '',
      platform: getValue(r, ['platform', 'Platform', 'source', 'Source']) || 'Facebook',
      page_id: getValue(r, ['page_id', 'Page ID', 'pageId']),
      page_name: getValue(r, ['page_name', 'Page Name', 'pageName', 'page', 'Page name']),
      post_id: getValue(r, ['post_id', 'Post ID', 'postId', 'post', 'Post ID']),
      post_url: getValue(r, ['post_url', 'Post URL', 'postUrl', 'url', 'URL', 'Permalink', 'Post link']),
      post_date: getValue(r, ['post_date', 'Post Date', 'postDate', 'date', 'Date', 'Publish time', 'Published']),
      metric_date: getValue(r, ['metric_date', 'Metric Date', 'metricDate']),
      content_type: getValue(r, ['content_type', 'Content Type', 'contentType', 'type', 'Type', 'Media type', 'Post type']),
      content_category: getValue(r, ['content_category', 'Content Category', 'contentCategory', 'category', 'Category', 'Title', 'Post title']),
      reach: getNumber(r, ['reach', 'Reach', 'Post reach', 'Reach (total)']),
      impressions: getNumber(r, ['impressions', 'Impressions', 'Post impressions', 'Views']),
      engagement: getNumber(r, ['engagement', 'Engagement', 'engagements', 'Post engagements', 'Interactions']),
      reactions: getNumber(r, ['reactions', 'Reactions', 'reaction', 'likes', 'Likes', 'Post reactions', 'Reactions, comments and shares']),
      comments: getNumber(r, ['comments', 'Comments', 'comment', 'Post comments']),
      shares: getNumber(r, ['shares', 'Shares', 'share', 'Post shares']),
      link_clicks: getNumber(r, ['link_clicks', 'Link Clicks', 'linkClicks', 'clicks', 'Clicks', 'Post link clicks', 'Link clicks']),
      video_views: getNumber(r, ['video_views', 'Video Views', 'videoViews', 'views', 'Views', '3-second video views', 'Video views']),
      source_file: sourceFileName,
      source_data_json: JSON.stringify(r),
      leads_generated: getNumber(r, ['leads_generated', 'Leads', 'leads', 'lead']),
    }));
    const result = addSocial(items);
    addImportJob({ job_id: `IJ_${Date.now()}`, module: 'Social Content', file_name: sourceFileName, file_size: 0, status: 'Completed', total_rows: rows.length, new_rows: result.new, updated_rows: result.updated, skipped_rows: result.skipped, rejected_rows: result.rejected, errors: result.errors.map(e => ({ row: 0, field: '', message: e })), created_at: new Date().toISOString(), created_by: 'Admin' });
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
