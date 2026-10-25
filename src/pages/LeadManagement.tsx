import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge, ImportModal, KPICard } from '../components/shared';
import { getLeadStatusColor, getTemperatureColor, formatDate } from '../data/store';
import { Upload, Plus, Search, Filter, Phone, Mail, Calendar, User, X, ChevronDown, Flame, Thermometer, Snowflake } from 'lucide-react';
import type { Lead, LeadStatus, LeadTemperature, CustomerType } from '../types';

const LEAD_STATUSES: LeadStatus[] = ['New Lead', 'Contacting', 'Contacted', 'Requirement Gathering', 'Qualified', 'Quotation Requested', 'Quotation Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'];
const CUSTOMER_TYPES: CustomerType[] = ['ผู้รับเหมา', 'ช่าง', 'ร้านวัสดุก่อสร้าง', 'โรงงาน', 'ผู้ผลิต', 'ผู้ประกอบการ', 'เจ้าของโครงการ', 'ลูกค้าทั่วไป', 'ร้านค้าตัวแทน', 'ลูกค้ารายใหญ่', 'อื่น ๆ'];

export default function LeadManagement() {
  const { data, addLead, updateLead, addLeads, addImportJob } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    return data.leads.filter(l => {
      if (search && !l.customer_name.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search) && !l.contact_person.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && l.lead_status !== statusFilter) return false;
      if (sourceFilter && l.source !== sourceFilter) return false;
      if (typeFilter && l.customer_type !== typeFilter) return false;
      return true;
    });
  }, [data.leads, search, statusFilter, sourceFilter, typeFilter]);

  const stats = {
    total: data.leads.length,
    newLeads: data.leads.filter(l => l.lead_status === 'New Lead').length,
    hot: data.leads.filter(l => l.lead_temperature === 'Hot').length,
    won: data.leads.filter(l => l.lead_status === 'Won').length,
    overdue: data.leads.filter(l => l.next_follow_up_at && new Date(l.next_follow_up_at) < new Date()).length,
  };

  const handleImport = (rows: Record<string, string>[], sourceFileName = 'import.csv') => {
    const leads: Lead[] = rows.map(r => {
      // Helper function to get value with multiple possible column names
      const getValue = (keys: string[]): string => {
        for (const key of keys) {
          const value = r[key];
          if (value && value.trim() !== '') return value.trim();
        }
        const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');
        const aliases = keys.map(normalize);
        return Object.entries(r).find(([key, value]) => value?.trim() && aliases.includes(normalize(key)))?.[1]?.trim() || '';
      };

      return {
        lead_id: '',
        created_at: new Date().toISOString().split('T')[0],
        inquiry_date: getValue(['inquiry_date', 'Date', 'date', 'Inquiry Date', 'inquiryDate', 'วันที่', 'วัน/เดือน/ปี']) || new Date().toISOString().split('T')[0],
        source: getValue(['source', 'Source', 'lead_source', 'Lead Source', 'แหล่งที่มา', 'ช่องทาง']) || 'Other',
        customer_type: (getValue(['customer_type', 'Customer Type', 'type', 'Type', 'ประเภทลูกค้า']) || 'ลูกค้าทั่วไป') as CustomerType,
        customer_name: getValue(['customer_name', 'Customer Name', 'Company', 'company', 'name', 'Name', 'customer', 'Customer', 'ชื่อลูกค้า', 'ชื่อลูกค้า/บริษัท', 'ชื่อลูกค้า/ชื่อบริษัท']),
        contact_person: getValue(['contact_person', 'Contact', 'contact', 'Contact Person', 'contactPerson']),
        phone: getValue(['phone', 'Phone', 'tel', 'Tel', 'telephone', 'Telephone', 'mobile', 'Mobile', 'โทรศัพท์', 'เบอร์โทร', 'เบอร์โทรศัพท์']),
        email: getValue(['email', 'Email', 'e-mail', 'E-mail', 'อีเมล']),
        product_category: getValue(['product_category', 'Product', 'product', 'category', 'Category', 'หมวดสินค้า', 'สินค้า', 'กลุ่มสินค้า']),
        steel_type: getValue(['steel_type', 'Steel Type', 'steel', 'Steel', 'product_type', 'Product Type', 'ชนิดเหล็ก', 'ประเภทเหล็ก', 'เกรดเหล็ก']),
        lead_status: 'New Lead' as LeadStatus,
        lead_temperature: 'Warm' as LeadTemperature,
        assigned_to: getValue(['assigned_to', 'Assigned To', 'assignee', 'Assignee', 'salesperson', 'Salesperson', 'พนักงานขาย', 'ผู้รับผิดชอบ']) || user?.full_name || '',
        source_file: sourceFileName,
        source_data_json: JSON.stringify(r),
        status_history: [{ date: new Date().toISOString().split('T')[0], from_status: '', to_status: 'New Lead', changed_by: user?.full_name || 'System' }],
      };
    });
    const result = addLeads(leads);
    addImportJob({ job_id: `IJ_${Date.now()}`, module: 'Leads', file_name: sourceFileName, file_size: 0, status: 'Completed', total_rows: rows.length, new_rows: result.new, updated_rows: result.updated, skipped_rows: result.skipped, rejected_rows: result.rejected, errors: result.errors.map(e => ({ row: 0, field: '', message: e })), created_at: new Date().toISOString(), created_by: user?.full_name || 'Admin' });
    return result;
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const lead = data.leads.find(l => l.lead_id === leadId);
    if (!lead) return;
    const history = [...lead.status_history, { date: new Date().toISOString().split('T')[0], from_status: lead.lead_status, to_status: newStatus, changed_by: user?.full_name || 'System' }];
    updateLead(leadId, { lead_status: newStatus, status_history: history });
    if (selectedLead?.lead_id === leadId) {
      setSelectedLead({ ...lead, lead_status: newStatus, status_history: history });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Manage customer leads from inquiry to close</p>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900">
            <Plus size={16} /> Add Lead
          </button>
          <button onClick={() => setShowImport(true)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
            <Upload size={16} /> Import CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Total Leads" value={stats.total} />
        <KPICard title="New Leads" value={stats.newLeads} color="bg-blue-50" />
        <KPICard title="Hot Leads" value={stats.hot} color="bg-red-50" />
        <KPICard title="Won" value={stats.won} color="bg-green-50" />
        <KPICard title="Overdue Follow-up" value={stats.overdue} color="bg-amber-50" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-3 bg-white rounded-lg border">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, company..." className="flex-1 text-sm border-0 focus:ring-0 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Status</option>
          {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Sources</option>
          {[...new Set(data.leads.map(l => l.source))].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Customer Types</option>
          {CUSTOMER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-center">Temp</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Assigned</th>
                <th className="px-4 py-2 text-left">Follow-up</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.lead_id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{lead.customer_name}</div>
                    <div className="text-xs text-gray-500">{lead.contact_person}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{lead.phone}</div>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{lead.customer_type}</td>
                  <td className="px-4 py-2">
                    <div className="text-xs">{lead.steel_type || lead.product_category}</div>
                    {lead.quantity && <div className="text-xs text-gray-500">{lead.quantity} {lead.unit}</div>}
                  </td>
                  <td className="px-4 py-2"><span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{lead.source}</span></td>
                  <td className="px-4 py-2 text-center">
                    {lead.lead_temperature === 'Hot' && <Flame size={16} className="text-red-500 mx-auto" />}
                    {lead.lead_temperature === 'Warm' && <Thermometer size={16} className="text-orange-500 mx-auto" />}
                    {lead.lead_temperature === 'Cold' && <Snowflake size={16} className="text-blue-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-2"><StatusBadge status={lead.lead_status} colorClass={getLeadStatusColor(lead.lead_status)} /></td>
                  <td className="px-4 py-2 text-xs text-gray-600">{lead.assigned_to}</td>
                  <td className="px-4 py-2 text-xs">
                    {lead.next_follow_up_at ? (
                      <span className={new Date(lead.next_follow_up_at) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {formatDate(lead.next_follow_up_at)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      value={lead.lead_status}
                      onChange={e => { e.stopPropagation(); handleStatusChange(lead.lead_id, e.target.value as LeadStatus); }}
                      onClick={e => e.stopPropagation()}
                      className="text-xs border rounded px-1 py-0.5"
                    >
                      {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">No leads found matching your filters</div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedLead.customer_name}</h3>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-gray-500">Contact</span><p className="font-medium">{selectedLead.contact_person}</p></div>
                <div><span className="text-xs text-gray-500">Phone</span><p className="font-medium">{selectedLead.phone}</p></div>
                <div><span className="text-xs text-gray-500">Type</span><p className="font-medium">{selectedLead.customer_type}</p></div>
                <div><span className="text-xs text-gray-500">Source</span><p className="font-medium">{selectedLead.source}</p></div>
                <div><span className="text-xs text-gray-500">Product</span><p className="font-medium">{selectedLead.steel_type} {selectedLead.size}</p></div>
                <div><span className="text-xs text-gray-500">Quantity</span><p className="font-medium">{selectedLead.quantity} {selectedLead.unit}</p></div>
                <div><span className="text-xs text-gray-500">Budget</span><p className="font-medium">{selectedLead.estimated_budget ? `${selectedLead.estimated_budget.toLocaleString()} THB` : 'N/A'}</p></div>
                <div><span className="text-xs text-gray-500">Delivery</span><p className="font-medium">{selectedLead.delivery_location || 'N/A'}</p></div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Status History</h4>
                <div className="space-y-2">
                  {selectedLead.status_history.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">{h.date}</span>
                      <span className="text-gray-600">{h.from_status || 'Created'} → {h.to_status}</span>
                      <span className="text-gray-400">by {h.changed_by}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedLead.quotation_id && (
                <div className="border-t pt-4">
                  <span className="text-xs text-gray-500">Linked Quotation:</span>
                  <span className="ml-2 text-sm font-medium text-blue-600">{selectedLead.quotation_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAdd && (
        <AddLeadModal onClose={() => setShowAdd(false)} onAdd={(lead) => { addLead(lead); setShowAdd(false); }} />
      )}

      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Leads" moduleName="Leads" expectedColumns={['customer_name', 'phone', 'source', 'customer_type', 'product_category', 'steel_type']} onImport={handleImport} />
    </div>
  );
}

function AddLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Lead) => void }) {
  const [form, setForm] = useState({
    customer_name: '', contact_person: '', phone: '', email: '', source: 'Walk-in',
    customer_type: 'ลูกค้าทั่วไป' as CustomerType, product_category: '', steel_type: '',
    quantity: '', unit: 'เส้น', estimated_budget: '', delivery_location: '',
    lead_temperature: 'Warm' as LeadTemperature, assigned_to: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
      lead_id: `L_${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      inquiry_date: new Date().toISOString().split('T')[0],
      source: form.source,
      customer_type: form.customer_type,
      customer_name: form.customer_name,
      contact_person: form.contact_person,
      phone: form.phone,
      email: form.email || undefined,
      product_category: form.product_category,
      steel_type: form.steel_type,
      quantity: form.quantity ? parseInt(form.quantity) : undefined,
      unit: form.unit,
      estimated_budget: form.estimated_budget ? parseInt(form.estimated_budget) : undefined,
      delivery_location: form.delivery_location || undefined,
      lead_status: 'New Lead',
      lead_temperature: form.lead_temperature,
      assigned_to: form.assigned_to,
      status_history: [{ date: new Date().toISOString().split('T')[0], from_status: '', to_status: 'New Lead', changed_by: 'User' }],
    };
    onAdd(lead);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-600">Customer Name *</label><input required value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Contact Person</label><input value={form.contact_person} onChange={e => setForm({...form, contact_person: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Phone *</label><input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Source</label>
              <select value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                {['Facebook Ads', 'Google Ads', 'LINE OA', 'Walk-in', 'Referral', 'Website', 'Other'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium text-gray-600">Customer Type</label>
              <select value={form.customer_type} onChange={e => setForm({...form, customer_type: e.target.value as CustomerType})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                {CUSTOMER_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium text-gray-600">Product Category</label><input value={form.product_category} onChange={e => setForm({...form, product_category: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Steel Type</label><input value={form.steel_type} onChange={e => setForm({...form, steel_type: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Temperature</label>
              <select value={form.lead_temperature} onChange={e => setForm({...form, lead_temperature: e.target.value as LeadTemperature})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                <option value="Hot">🔥 Hot</option><option value="Warm">🌡️ Warm</option><option value="Cold">❄️ Cold</option>
              </select>
            </div>
            <div><label className="text-xs font-medium text-gray-600">Budget (THB)</label><input type="number" value={form.estimated_budget} onChange={e => setForm({...form, estimated_budget: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-600">Assigned To</label><input value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}
