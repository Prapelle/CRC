import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { KPICard, StatusBadge, ImportModal } from '../components/shared';
import { formatCurrency, formatNumber, formatPercent, formatDate, getQuotationStatusColor } from '../data/store';
import { Upload, FileText, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { QuotationStatus } from '../types';

const QUOTATION_STATUSES: QuotationStatus[] = ['Draft', 'Pending Cost Confirmation', 'Pending Approval', 'Sent', 'Negotiation', 'Accepted', 'Rejected', 'Expired', 'Converted to Order', 'Cancelled'];

export default function QuotationManagement() {
  const { data, updateQuotation, addQuotations, addImportJob } = useData();
  const [showImport, setShowImport] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedQ, setSelectedQ] = useState<string | null>(null);

  const filtered = statusFilter ? data.quotations.filter(q => q.quotation_status === statusFilter) : data.quotations;
  
  const totalValue = data.quotations.reduce((s, q) => s + q.grand_total, 0);
  const openValue = data.quotations.filter(q => ['Sent', 'Negotiation', 'Pending Approval'].includes(q.quotation_status)).reduce((s, q) => s + q.grand_total, 0);
  const convertedCount = data.quotations.filter(q => q.quotation_status === 'Converted to Order').length;
  const conversionRate = data.quotations.length > 0 ? (convertedCount / data.quotations.length) * 100 : 0;
  const expiredCount = data.quotations.filter(q => q.quotation_status === 'Sent' && new Date(q.valid_until) < new Date()).length;

  const handleStatusChange = (id: string, status: QuotationStatus) => {
    updateQuotation(id, { quotation_status: status, updated_at: new Date().toISOString().split('T')[0] });
  };

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
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };

    const items = rows.map(r => ({
      quotation_id: '',
      quotation_number: getValue(r, ['quotation_number', 'Quotation #', 'quotation', 'Quotation', 'quote_number', 'Quote #']),
      lead_id: getValue(r, ['lead_id', 'Lead ID', 'lead', 'Lead']),
      quotation_date: getValue(r, ['quotation_date', 'Date', 'date', 'quotationDate']) || new Date().toISOString().split('T')[0],
      valid_until: getValue(r, ['valid_until', 'Valid Until', 'validUntil', 'expiry', 'Expiry']),
      salesperson: getValue(r, ['salesperson', 'Salesperson', 'sales_person', 'Sales Person', 'assigned_to']),
      quotation_status: (getValue(r, ['status', 'Status', 'quotation_status']) || 'Draft') as QuotationStatus,
      items: [],
      subtotal: getNumber(r, ['subtotal', 'Subtotal', 'sub_total']),
      discount: getNumber(r, ['discount', 'Discount']),
      tax_amount: getNumber(r, ['tax', 'Tax', 'tax_amount', 'vat', 'VAT']),
      shipping_fee: getNumber(r, ['shipping', 'Shipping', 'shipping_fee', 'delivery']),
      grand_total: getNumber(r, ['grand_total', 'Total', 'total', 'amount', 'Amount']),
      currency: 'THB',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const result = addQuotations(items);
    addImportJob({ job_id: `IJ_${Date.now()}`, module: 'Quotations', file_name: 'import.csv', file_size: 0, status: 'Completed', total_rows: rows.length, new_rows: result.new, updated_rows: result.updated, skipped_rows: result.skipped, rejected_rows: result.rejected, errors: result.errors.map(e => ({ row: 0, field: '', message: e })), created_at: new Date().toISOString(), created_by: 'Admin' });
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Track quotations and conversion rates</p>
        <button onClick={() => setShowImport(true)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          <Upload size={16} /> Import CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Total Quotations" value={formatNumber(data.quotations.length)} icon={<FileText size={18} />} />
        <KPICard title="Total Value" value={formatCurrency(totalValue)} icon={<TrendingUp size={18} />} />
        <KPICard title="Open Value" value={formatCurrency(openValue)} color="bg-blue-50" />
        <KPICard title="Conversion Rate" value={formatPercent(conversionRate)} icon={<CheckCircle size={18} />} color="bg-green-50" />
        <KPICard title="Expired" value={expiredCount} icon={<Clock size={18} />} color="bg-red-50" />
      </div>

      {/* Filter */}
      <div className="flex gap-3 p-3 bg-white rounded-lg border">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Status</option>
          {QUOTATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Quotation #</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Lead</th>
                <th className="px-4 py-2 text-left">Salesperson</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
                <th className="px-4 py-2 text-right">Grand Total</th>
                <th className="px-4 py-2 text-left">Valid Until</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => {
                const lead = data.leads.find(l => l.lead_id === q.lead_id);
                return (
                  <tr key={q.quotation_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-blue-600 cursor-pointer" onClick={() => setSelectedQ(q.quotation_id)}>{q.quotation_number}</td>
                    <td className="px-4 py-2">{formatDate(q.quotation_date)}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{lead?.customer_name || q.lead_id}</td>
                    <td className="px-4 py-2">{q.salesperson}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(q.subtotal)}</td>
                    <td className="px-4 py-2 text-right font-bold">{formatCurrency(q.grand_total)}</td>
                    <td className="px-4 py-2 text-xs">
                      <span className={new Date(q.valid_until) < new Date() && q.quotation_status === 'Sent' ? 'text-red-600' : ''}>
                        {formatDate(q.valid_until)}
                      </span>
                    </td>
                    <td className="px-4 py-2"><StatusBadge status={q.quotation_status} colorClass={getQuotationStatusColor(q.quotation_status)} /></td>
                    <td className="px-4 py-2 text-center">
                      <select
                        value={q.quotation_status}
                        onChange={e => handleStatusChange(q.quotation_id, e.target.value as QuotationStatus)}
                        className="text-xs border rounded px-1 py-0.5"
                      >
                        {QUOTATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotation Detail Modal */}
      {selectedQ && (() => {
        const q = data.quotations.find(x => x.quotation_id === selectedQ);
        if (!q) return null;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedQ(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{q.quotation_number}</h3>
                  <p className="text-xs text-gray-500">{formatDate(q.quotation_date)} • Valid until {formatDate(q.valid_until)}</p>
                </div>
                <StatusBadge status={q.quotation_status} colorClass={getQuotationStatusColor(q.quotation_status)} />
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500 text-xs">Salesperson:</span> <span className="font-medium">{q.salesperson}</span></div>
                  <div><span className="text-gray-500 text-xs">Lead:</span> <span className="font-medium">{data.leads.find(l => l.lead_id === q.lead_id)?.customer_name || q.lead_id}</span></div>
                </div>
                {q.items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Items</h4>
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50"><tr><th className="px-3 py-1.5 text-left">Product</th><th className="px-3 py-1.5 text-right">Qty</th><th className="px-3 py-1.5 text-right">Unit Price</th><th className="px-3 py-1.5 text-right">Total</th></tr></thead>
                      <tbody>
                        {q.items.map(item => (
                          <tr key={item.item_id} className="border-t">
                            <td className="px-3 py-1.5">{item.product_name}</td>
                            <td className="px-3 py-1.5 text-right">{item.quantity} {item.unit}</td>
                            <td className="px-3 py-1.5 text-right">{formatCurrency(item.unit_price)}</td>
                            <td className="px-3 py-1.5 text-right font-medium">{formatCurrency(item.line_total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(q.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-{formatCurrency(q.discount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax (7%)</span><span>{formatCurrency(q.tax_amount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatCurrency(q.shipping_fee)}</span></div>
                  <div className="flex justify-between font-bold text-base border-t pt-2"><span>Grand Total</span><span className="text-orange-600">{formatCurrency(q.grand_total)}</span></div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Quotations" moduleName="Quotations" expectedColumns={['quotation_number', 'lead_id', 'date', 'salesperson', 'subtotal', 'grand_total', 'status']} onImport={handleImport} />
    </div>
  );
}
