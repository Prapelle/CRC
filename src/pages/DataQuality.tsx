import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { KPICard, StatusBadge } from '../components/shared';
import { AlertTriangle, ShieldCheck, AlertCircle, Info, CheckCircle } from 'lucide-react';
import type { DataQualityIssue } from '../types';

export default function DataQuality() {
  const { data, getQualityIssues } = useData();
  const [severityFilter, setSeverityFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const issues = getQualityIssues();
  const filtered = issues.filter(i => {
    if (severityFilter && i.severity !== severityFilter) return false;
    if (moduleFilter && i.module !== moduleFilter) return false;
    return true;
  });

  const highCount = issues.filter(i => i.severity === 'High').length;
  const medCount = issues.filter(i => i.severity === 'Medium').length;
  const lowCount = issues.filter(i => i.severity === 'Low').length;
  const modules = [...new Set(issues.map(i => i.module))];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High': return <AlertCircle size={16} className="text-red-500" />;
      case 'Medium': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'Low': return <Info size={16} className="text-blue-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Monitor data quality issues across all modules</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Issues" value={issues.length} icon={<AlertTriangle size={18} />} color="bg-white" />
        <KPICard title="High Severity" value={highCount} icon={<AlertCircle size={18} />} color="bg-red-50" />
        <KPICard title="Medium Severity" value={medCount} icon={<AlertTriangle size={18} />} color="bg-yellow-50" />
        <KPICard title="Low Severity" value={lowCount} icon={<Info size={18} />} color="bg-blue-50" />
      </div>

      {/* Module Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Issues by Module</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {modules.map(mod => {
            const count = issues.filter(i => i.module === mod).length;
            const high = issues.filter(i => i.module === mod && i.severity === 'High').length;
            return (
              <div key={mod} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                  {high > 0 ? <AlertCircle size={18} className="text-red-500" /> : <ShieldCheck size={18} className="text-green-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{mod}</p>
                  <p className="text-xs text-gray-500">{count} issues ({high} high)</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 p-3 bg-white rounded-lg border">
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Modules</option>
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Quality Issues ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Severity</th>
                <th className="px-4 py-2 text-left">Module</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Record</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(issue => (
                <tr key={issue.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(issue.severity)}
                      <StatusBadge status={issue.severity} colorClass={getSeverityColor(issue.severity)} />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs">{issue.module}</td>
                  <td className="px-4 py-2"><span className="text-xs px-2 py-0.5 rounded bg-gray-100">{issue.issue_type}</span></td>
                  <td className="px-4 py-2 text-xs text-gray-600">{issue.record_id}</td>
                  <td className="px-4 py-2 text-xs text-gray-700 max-w-[300px]">{issue.description}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{issue.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No issues found! Data quality is good.</p>
          </div>
        )}
      </div>

      {/* Data Completeness */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Data Completeness Summary</h3>
        <div className="space-y-3">
          {[
            { label: 'Campaigns', total: data.campaigns.length, complete: data.campaigns.filter(c => c.campaign_name && c.platform).length },
            { label: 'Leads', total: data.leads.length, complete: data.leads.filter(l => l.customer_name && l.phone).length },
            { label: 'Quotations', total: data.quotations.length, complete: data.quotations.filter(q => q.quotation_number && q.grand_total > 0).length },
            { label: 'Sales Orders', total: data.sales.length, complete: data.sales.filter(s => s.order_number && s.net_sales > 0).length },
            { label: 'Social Content', total: data.social.length, complete: data.social.filter(s => s.post_id && s.metric_date).length },
            { label: 'Website Analytics', total: data.website.length, complete: data.website.filter(w => w.date && w.source).length },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-32">{item.label}</span>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.total > 0 ? (item.complete / item.total) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-gray-500 w-20 text-right">{item.complete}/{item.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
