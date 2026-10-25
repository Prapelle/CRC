import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { KPICard, ImportModal, FilterBar, FilterSelect, FilterDate } from '../components/shared';
import { formatCurrency, formatNumber, formatPercent } from '../data/store';
import { Upload, DollarSign, MousePointer, Eye, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function MarketingPerformance() {
  const { data, addAds, addImportJob } = useData();
  const [showImport, setShowImport] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('');

  const filteredAds = platformFilter ? data.ads.filter(a => a.platform === platformFilter) : data.ads;
  const totalSpend = filteredAds.reduce((s, a) => s + a.spend, 0);
  const totalImpressions = filteredAds.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = filteredAds.reduce((s, a) => s + a.clicks, 0);
  const totalLeads = filteredAds.reduce((s, a) => s + a.leads, 0);
  const totalQualified = filteredAds.reduce((s, a) => s + a.qualified_leads, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const avgCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
  const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const cpql = totalQualified > 0 ? totalSpend / totalQualified : 0;

  // Platform comparison
  const platformData = ['Facebook Ads', 'Google Ads', 'LINE Ads'].map(p => {
    const ads = data.ads.filter(a => a.platform === p);
    return {
      platform: p.replace(' Ads', ''),
      spend: ads.reduce((s, a) => s + a.spend, 0),
      leads: ads.reduce((s, a) => s + a.leads, 0),
      qualified: ads.reduce((s, a) => s + a.qualified_leads, 0),
      clicks: ads.reduce((s, a) => s + a.clicks, 0),
    };
  });

  const handleImport = (rows: Record<string, string>[]) => {
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
      // Handles exported values such as THB145.28, ฿1,250.00, percentages and comma separators.
      const cleaned = value.replace(/THB|฿|บาท/gi, '').replace(/,/g, '').replace(/%/g, '').replace(/[^0-9.\-]/g, '');
      const num = Number(cleaned);
      return cleaned !== '' && Number.isFinite(num) ? num : 0;
    };
    const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');
    const getByNormalizedName = (r: Record<string, string>, aliases: string[]): string => {
      const aliasKeys = aliases.map(normalizeKey);
      const found = Object.entries(r).find(([key, value]) => value?.trim() && aliasKeys.includes(normalizeKey(key)));
      return found?.[1]?.trim() || '';
    };
    const value = (r: Record<string, string>, aliases: string[]) => getValue(r, aliases) || getByNormalizedName(r, aliases);

    const ads = rows.map(r => {
      const sourceStart = value(r, ['Reporting starts', 'Date', 'Day', 'วันที่', 'วัน/เดือน/ปี']);
      const spend = getNumber(r, ['spend', 'Spend', 'cost', 'Cost', 'amount', 'Amount', 'ค่าใช้จ่าย', 'ต้นทุน']);
      const impressions = getNumber(r, ['impressions', 'Impressions', 'impression', 'Impression', 'การแสดงผล']);
      const clicks = getNumber(r, ['clicks', 'Clicks', 'click', 'Click', 'การคลิก']);
      const campaignName = value(r, ['campaign_id', 'Campaign ID', 'campaign', 'Campaign', 'Campaign name', 'Campaign Name', 'Ad name', 'Ad Name', 'Search']);
      const rawPlatform = value(r, ['platform', 'Platform', 'source', 'Source', 'Campaign type', 'Network']) || '';
      const platform = /google|search/i.test(rawPlatform) || Object.keys(r).some(k => normalizeKey(k) === 'search') ? 'Google Ads'
        : /facebook|meta|instagram/i.test(rawPlatform) || Object.keys(r).some(k => normalizeKey(k) === 'reportingstarts') ? 'Facebook Ads'
        : rawPlatform || 'Other';
      return {
        id: '',
        campaign_id: campaignName || value(r, ['Campaign ID', 'campaign_id']) || 'Imported Campaign',
        platform: platform as any,
        report_level: (value(r, ['report_level', 'Report Level', 'level', 'Level']) || (value(r, ['Ad name', 'Ad Name']) ? 'Ad' : 'Campaign')) as any,
        date: sourceStart || new Date().toISOString().split('T')[0],
        spend,
        impressions,
        reach: getNumber(r, ['reach', 'Reach', 'accounts reached']),
        clicks,
        ctr: getNumber(r, ['ctr', 'CTR', 'click_through_rate', 'Click Through Rate', 'CTR (all)']),
        cpc: getNumber(r, ['cpc', 'CPC', 'cost_per_click', 'Cost Per Click', 'Cost per click (all)']),
        cpm: getNumber(r, ['cpm', 'CPM', 'cost_per_mille', 'Cost Per Mille', 'CPM (cost per 1,000 impressions)']),
        leads: getNumber(r, ['leads', 'Leads', 'lead', 'Lead', 'Conversions', 'Results', 'Messaging conversations started']),
        qualified_leads: getNumber(r, ['qualified_leads', 'Qualified Leads', 'qualified', 'Qualified']),
      };
    }).filter(item => item.campaign_id !== 'Imported Campaign' || item.spend || item.impressions || item.clicks);
    const result = addAds(ads);
    addImportJob({
      job_id: `IJ_${Date.now()}`,
      module: 'Advertising',
      file_name: 'import.csv',
      file_size: 0,
      status: 'Completed',
      total_rows: rows.length,
      new_rows: result.new,
      updated_rows: result.updated,
      skipped_rows: result.skipped,
      rejected_rows: result.rejected,
      errors: result.errors.map(e => ({ row: 0, field: '', message: e })),
      created_at: new Date().toISOString(),
      created_by: 'Admin',
    });
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Analyze advertising performance across all channels</p>
        </div>
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600"
        >
          <Upload size={16} /> Import CSV
        </button>
      </div>

      <FilterBar>
        <FilterSelect
          label="Platform"
          value={platformFilter}
          onChange={setPlatformFilter}
          options={[
            { value: 'Facebook Ads', label: 'Facebook Ads' },
            { value: 'Google Ads', label: 'Google Ads' },
            { value: 'LINE Ads', label: 'LINE Ads' },
          ]}
        />
      </FilterBar>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard title="Total Spend" value={formatCurrency(totalSpend)} icon={<DollarSign size={18} />} />
        <KPICard title="Impressions" value={formatNumber(totalImpressions)} icon={<Eye size={18} />} />
        <KPICard title="Clicks" value={formatNumber(totalClicks)} icon={<MousePointer size={18} />} />
        <KPICard title="CTR" value={formatPercent(avgCTR)} />
        <KPICard title="CPC" value={formatCurrency(avgCPC)} />
        <KPICard title="CPM" value={formatCurrency(avgCPM)} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Leads" value={formatNumber(totalLeads)} icon={<Users size={18} />} color="bg-blue-50" />
        <KPICard title="Qualified Leads" value={formatNumber(totalQualified)} icon={<TrendingUp size={18} />} color="bg-green-50" />
        <KPICard title="CPL" value={formatCurrency(cpl)} />
        <KPICard title="Cost per QL" value={formatCurrency(cpql)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Spend by Platform</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="spend" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Leads by Platform</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#3b82f6" name="Leads" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qualified" fill="#10b981" name="Qualified" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-800">Advertising Performance Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Platform</th>
                <th className="px-4 py-2 text-left">Campaign</th>
                <th className="px-4 py-2 text-right">Spend</th>
                <th className="px-4 py-2 text-right">Impressions</th>
                <th className="px-4 py-2 text-right">Clicks</th>
                <th className="px-4 py-2 text-right">CTR</th>
                <th className="px-4 py-2 text-right">Leads</th>
                <th className="px-4 py-2 text-right">Qualified</th>
                <th className="px-4 py-2 text-right">CPL</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map(ad => {
                const campaign = data.campaigns.find(c => c.campaign_id === ad.campaign_id);
                const adCpl = ad.leads > 0 ? ad.spend / ad.leads : 0;
                return (
                  <tr key={ad.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{ad.date}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        ad.platform === 'Facebook Ads' ? 'bg-blue-100 text-blue-700' :
                        ad.platform === 'Google Ads' ? 'bg-green-100 text-green-700' :
                        'bg-teal-100 text-teal-700'
                      }`}>{ad.platform}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{campaign?.campaign_name || ad.campaign_id}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(ad.spend)}</td>
                    <td className="px-4 py-2 text-right">{formatNumber(ad.impressions)}</td>
                    <td className="px-4 py-2 text-right">{formatNumber(ad.clicks)}</td>
                    <td className="px-4 py-2 text-right">{formatPercent(ad.ctr)}</td>
                    <td className="px-4 py-2 text-right font-medium text-blue-600">{ad.leads}</td>
                    <td className="px-4 py-2 text-right font-medium text-green-600">{ad.qualified_leads}</td>
                    <td className="px-4 py-2 text-right">{adCpl > 0 ? formatCurrency(adCpl) : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Advertising Data"
        moduleName="Advertising"
        expectedColumns={['campaign_id', 'platform', 'date', 'spend', 'impressions', 'clicks', 'leads', 'qualified_leads']}
        onImport={handleImport}
      />
    </div>
  );
}
