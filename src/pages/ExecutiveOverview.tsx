import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { KPICard, FilterBar, FilterSelect, FilterDate } from '../components/shared';
import { formatCurrency, formatNumber, formatPercent } from '../data/store';
import {
  DollarSign, Users, FileText, ShoppingCart, TrendingUp, Target,
  ArrowRight, BarChart3, PieChart as PieIcon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, FunnelChart, Funnel, LabelList
} from 'recharts';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899'];

export default function ExecutiveOverview() {
  const { data } = useData();
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [channelFilter, setChannelFilter] = useState('');

  // Calculate KPIs
  const totalAdSpend = data.ads.reduce((s, a) => s + a.spend, 0);
  const totalLeads = data.leads.length;
  const qualifiedLeads = data.leads.filter(l => ['Qualified', 'Quotation Requested', 'Quotation Sent', 'Negotiation', 'Won'].includes(l.lead_status)).length;
  const totalQuotations = data.quotations.length;
  const quotationValue = data.quotations.reduce((s, q) => s + q.grand_total, 0);
  const totalOrders = data.sales.length;
  const totalSales = data.sales.reduce((s, o) => s + o.net_sales, 0);
  const totalGrossProfit = data.sales.reduce((s, o) => s + (o.gross_profit || 0), 0);
  const marketingRevenue = data.sales.filter(s => s.marketing_source).reduce((s, o) => s + o.net_sales, 0);
  const cpl = totalLeads > 0 ? totalAdSpend / totalLeads : 0;
  const leadToQuotationRate = totalLeads > 0 ? (totalQuotations / totalLeads) * 100 : 0;
  const quotationToOrderRate = totalQuotations > 0 ? (totalOrders / totalQuotations) * 100 : 0;
  const roas = totalAdSpend > 0 ? marketingRevenue / totalAdSpend : 0;

  // Chart data
  const monthlySales = [
    { month: 'Jan', sales: 140000, leads: 12 },
    { month: 'Feb', sales: 280000, leads: 15 },
    { month: 'Mar', sales: 170000, leads: 22 },
    { month: 'Apr', sales: 450000, leads: 18 },
    { month: 'May', sales: 0, leads: 16 },
  ];

  const channelData = [
    { name: 'Facebook Ads', value: data.ads.filter(a => a.platform === 'Facebook Ads').reduce((s, a) => s + a.leads, 0) },
    { name: 'Google Ads', value: data.ads.filter(a => a.platform === 'Google Ads').reduce((s, a) => s + a.leads, 0) },
    { name: 'LINE Ads', value: data.ads.filter(a => a.platform === 'LINE Ads').reduce((s, a) => s + a.leads, 0) },
    { name: 'Walk-in', value: data.leads.filter(l => l.source === 'Walk-in').length },
    { name: 'Referral', value: data.leads.filter(l => l.source === 'Referral').length },
  ].filter(c => c.value > 0);

  const funnelData = [
    { name: 'Leads', value: totalLeads, fill: '#3b82f6' },
    { name: 'Qualified', value: qualifiedLeads, fill: '#8b5cf6' },
    { name: 'Quotations', value: totalQuotations, fill: '#f97316' },
    { name: 'Orders', value: totalOrders, fill: '#10b981' },
  ];

  const quotationStatusData = [
    { name: 'Converted', value: data.quotations.filter(q => q.quotation_status === 'Converted to Order').length },
    { name: 'Sent', value: data.quotations.filter(q => q.quotation_status === 'Sent').length },
    { name: 'Negotiation', value: data.quotations.filter(q => q.quotation_status === 'Negotiation').length },
    { name: 'Draft', value: data.quotations.filter(q => q.quotation_status === 'Draft').length },
  ].filter(d => d.value > 0);

  const topProducts = [
    { name: 'เหล็กเส้น', revenue: 225000 },
    { name: 'เหล็ก I-Beam', revenue: 210000 },
    { name: 'เหล็ก H-Beam', revenue: 435000 },
    { name: 'เหล็กแผ่น', revenue: 85000 },
  ];

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
        <span className="text-amber-600 text-sm">⚠️</span>
        <p className="text-xs text-amber-700">
          <strong>Demo Data:</strong> This dashboard displays sample data for demonstration purposes. Data period: Jan 2025 - May 2025.
        </p>
      </div>

      {/* Filters */}
      <FilterBar>
        <FilterDate label="From" value={startDate} onChange={setStartDate} />
        <FilterDate label="To" value={endDate} onChange={setEndDate} />
        <FilterSelect
          label="Channel"
          value={channelFilter}
          onChange={setChannelFilter}
          options={[
            { value: 'Facebook Ads', label: 'Facebook Ads' },
            { value: 'Google Ads', label: 'Google Ads' },
            { value: 'LINE Ads', label: 'LINE Ads' },
            { value: 'Walk-in', label: 'Walk-in' },
            { value: 'Referral', label: 'Referral' },
          ]}
        />
      </FilterBar>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard title="Ad Spend" value={formatCurrency(totalAdSpend)} icon={<DollarSign size={20} />} trend={{ value: 12, positive: false }} />
        <KPICard title="Total Leads" value={formatNumber(totalLeads)} icon={<Users size={20} />} trend={{ value: 18, positive: true }} />
        <KPICard title="Qualified Leads" value={formatNumber(qualifiedLeads)} icon={<Target size={20} />} />
        <KPICard title="CPL" value={formatCurrency(cpl)} icon={<TrendingUp size={20} />} />
        <KPICard title="Quotations" value={formatNumber(totalQuotations)} subtitle={formatCurrency(quotationValue)} icon={<FileText size={20} />} />
        <KPICard title="Orders" value={formatNumber(totalOrders)} icon={<ShoppingCart size={20} />} />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard title="Total Sales" value={formatCurrency(totalSales)} color="bg-green-50" icon={<DollarSign size={20} />} />
        <KPICard title="Gross Profit" value={totalGrossProfit > 0 ? formatCurrency(totalGrossProfit) : 'N/A'} color="bg-emerald-50" />
        <KPICard title="Lead→Quote Rate" value={formatPercent(leadToQuotationRate)} />
        <KPICard title="Quote→Order Rate" value={formatPercent(quotationToOrderRate)} />
        <KPICard title="Marketing Revenue" value={formatCurrency(marketingRevenue)} subtitle="Attributed to marketing" />
        <KPICard title="ROAS" value={roas > 0 ? `${roas.toFixed(1)}x` : 'N/A'} subtitle="Return on Ad Spend" color="bg-blue-50" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={16} /> Monthly Sales & Leads Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number, name: string) => [name === 'sales' ? formatCurrency(value) : value, name === 'sales' ? 'Sales' : 'Leads']} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} name="Sales (THB)" dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} name="Leads" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieIcon size={16} /> Leads by Source
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {channelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Sales Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-20 text-xs font-medium text-gray-600">{item.name}</div>
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.value / totalLeads) * 100}%`, backgroundColor: item.fill }}
                  >
                    <span className="text-xs text-white font-bold">{item.value}</span>
                  </div>
                </div>
                {i > 0 && (
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {formatPercent((item.value / funnelData[i-1].value) * 100)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quotation Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Quotation Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={quotationStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {quotationStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attribution Note */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">📊 KPI Definitions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-500">
          <div><strong>CPL:</strong> Total Ad Spend ÷ Total Leads</div>
          <div><strong>ROAS:</strong> Marketing-attributed Revenue ÷ Ad Spend</div>
          <div><strong>Lead→Quote Rate:</strong> Quotations ÷ Total Leads</div>
          <div><strong>Quote→Order Rate:</strong> Orders ÷ Total Quotations</div>
          <div><strong>Marketing Revenue:</strong> Sales with confirmed marketing source</div>
          <div><strong>Gross Profit:</strong> Net Sales - COGS (when available)</div>
        </div>
      </div>
    </div>
  );
}
