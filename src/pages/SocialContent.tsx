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
    const normalize = (value: string) => value.toLowerCase().replace(/^\\uFEFF/, '').replace(/[^a-z0-9ก-๙]/g, '');
    const getValue = (r: Record<string, string>, aliases: string[]): string => {
      const entries = Object.entries(r).filter(([, value]) => value?.trim());
      const normalizedAliases = aliases.map(normalize);
      for (const alias of normalizedAliases) {
        const exact = entries.find(([key]) => normalize(key) === alias);
        if (exact) return exact[1].trim();
      }
      for (const alias of normalizedAliases) {
        const match = entries.find(([key]) => { const keyName = normalize(key); return keyName.startsWith(alias) || keyName.endsWith(alias); });
        if (match) return match[1].trim();
      }
      for (const alias of normalizedAliases) {
        const match = entries.find(([key]) => normalize(key).includes(alias));
        if (match) return match[1].trim();
      }
      return '';
    };

    const getNumber = (r: Record<string, string>, aliases: string[]): number => {
      const raw = getValue(r, aliases).replace(/,/g, '').replace(/%/g, '').trim();
      const num = Number(raw.replace(/[^0-9.\\-]/g, ''));
      return raw !== '' && Number.isFinite(num) ? num : 0;
    };

    const getDate = (raw: string): string => {
      if (!raw) return '';
      const value = raw.trim();
      const iso = value.match(/^(\\d{4})-(\\d{1,2})-(\\d{1,2})/);
      if (iso) return iso[1] + '-' + iso[2].padStart(2, '0') + '-' + iso[3].padStart(2, '0');
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString().slice(0, 10);
    };

    const items = rows.map(r => {
      const pageName = getValue(r, ['page_name', 'Page Name', 'pageName', 'page', 'Page name', 'Account name']);
      const postUrl = getValue(r, ['post_url', 'Post URL', 'postUrl', 'url', 'URL', 'Permalink', 'Post link', 'Content link']);
      const postDate = getDate(getValue(r, ['post_date', 'Post Date', 'postDate', 'date', 'Date', 'Publish time', 'Published', 'Post publish time', 'Date published']));
      const title = getValue(r, ['content_category', 'Content Category', 'contentCategory', 'category', 'Category', 'Title', 'Post title', 'Content title', 'Post description', 'Description']);
      const rawPostId = getValue(r, ['post_id', 'Post ID', 'postId', 'Post identifier', 'Content ID', 'Post']);
      const postId = rawPostId || postUrl || (postDate + '_' + title);
      const metricDate = getDate(getValue(r, ['metric_date', 'Metric Date', 'metricDate', 'Reporting date', 'Date'])) || postDate;
      return {
        id: '',
        platform: getValue(r, ['platform', 'Platform', 'source', 'Source', 'Network']) || 'Facebook',
        page_id: getValue(r, ['page_id', 'Page ID', 'pageId', 'Account ID']) || pageName || 'Facebook',
        page_name: pageName,
        post_id: postId,
        post_url: postUrl,
        post_date: postDate,
        metric_date: metricDate,
        content_type: getValue(r, ['content_type', 'Content Type', 'contentType', 'type', 'Type', 'Media type', 'Post type', 'Content format']) || 'Post',
        content_category: title || 'Other',
        reach: getNumber(r, ['reach', 'Post reach', 'Reach (total)', 'Lifetime Post Total Reach', 'Total reach', 'Accounts reached']),
        impressions: getNumber(r, ['impressions', 'Post impressions', 'Views', 'Lifetime Post Total Impressions', 'Total impressions']),
        engagement: getNumber(r, ['engagement', 'engagements', 'Post engagements', 'Interactions', 'Content interactions', 'People who engaged', 'Lifetime Engaged Users']),
        reactions: getNumber(r, ['reactions', 'reaction', 'likes', 'Likes', 'Post reactions', 'Reactions, comments and shares', 'Content interactions']),
        comments: getNumber(r, ['comments', 'comment', 'Post comments']),
        shares: getNumber(r, ['shares', 'share', 'Post shares']),
        link_clicks: getNumber(r, ['link_clicks', 'Link Clicks', 'linkClicks', 'clicks', 'Clicks', 'Post link clicks', 'Outbound clicks']),
        video_views: getNumber(r, ['video_views', 'Video Views', 'videoViews', '3-second video views', 'Video views', 'ThruPlays']),
        source_file: sourceFileName,
        source_data_json: JSON.stringify(r),
        leads_generated: getNumber(r, ['leads_generated', 'Leads', 'leads', 'lead']),
      };
    });
    const metricFields: Array<keyof typeof items[number]> = ['reach', 'impressions', 'engagement', 'reactions', 'comments', 'shares', 'link_clicks', 'video_views', 'leads_generated'];
    if (!items.some(item => metricFields.some(field => Number(item[field]) > 0))) {
      window.alert('นำเข้าได้แต่ไม่พบตัวเลขสถิติที่ระบบรู้จัก กรุณาตรวจสอบชื่อคอลัมน์ในไฟล์ CSV และเลือกไฟล์รายงาน Content Performance จาก Meta');
      return { new: 0, updated: 0, skipped: rows.length, rejected: rows.length, errors: ['ไม่พบคอลัมน์ตัวเลขสถิติที่รองรับในไฟล์'] };
    }
    const result = addSocial(items);
    addImportJob({ job_id: 'IJ_' + Date.now(), module: 'Social Content', file_name: sourceFileName, file_size: 0, status: 'Completed', total_rows: rows.length, new_rows: result.new, updated_rows: result.updated, skipped_rows: result.skipped, rejected_rows: result.rejected, errors: result.errors.map(e => ({ row: 0, field: '', message: e })), created_at: new Date().toISOString(), created_by: 'Admin' });
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
