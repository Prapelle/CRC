import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { KPICard, StatusBadge, ImportModal } from '../components/shared';
import { formatCurrency, formatNumber, formatPercent, formatDate, getOrderStatusColor, getPaymentStatusColor } from '../data/store';
import { Upload, DollarSign, ShoppingCart, Package, TrendingUp, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { OrderStatus, PaymentStatus } from '../types';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function SalesManagement() {
  const { data, updateSales, addSales, addImportJob } = useData();
  const [showImport, setShowImport] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return data.sales.filter(s => {
      if (statusFilter && s.order_status !== statusFilter) return false;
      if (paymentFilter && s.payment_status !== paymentFilter) return false;
      return true;
    });
  }, [data.sales, statusFilter, paymentFilter]);

  const totalSales = data.sales.reduce((s, o) => s + o.net_sales, 0);
  const totalOrders = data.sales.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const totalGrossProfit = data.sales.reduce((s, o) => s + (o.gross_profit || 0), 0);
  const totalWeight = data.sales.reduce((s, o) => s + o.items.reduce((is, i) => is + (i.weight_kg || 0), 0), 0);
  const marketingSales = data.sales.filter(s => s.marketing_source).reduce((s, o) => s + o.net_sales, 0);
  const unpaidAmount = data.sales.filter(s => s.payment_status === 'Unpaid' || s.payment_status === 'Partially Paid').reduce((s, o) => s + o.grand_total, 0);

  // Chart data
  const salesByChannel = Object.entries(
    data.sales.reduce((acc: Record<string, number>, s) => { acc[s.sales_channel] = (acc[s.sales_channel] || 0) + s.net_sales; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const salesByCustomerType = Object.entries(
    data.sales.reduce((acc: Record<string, number>, s) => { acc[s.customer_type] = (acc[s.customer_type] || 0) + s.net_sales; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const salesBySalesperson = Object.entries(
    data.sales.reduce((acc: Record<string, number>, s) => { acc[s.salesperson] = (acc[s.salesperson] || 0) + s.net_sales; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

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

    const items = rows.map(r => {
      const customerName = getValue(r, ['customer_name', 'Customer', 'customer', 'name', 'Name', 'company', 'Company']);
      const subtotal = getNumber(r, ['subtotal', 'Subtotal', 'sub_total']);

      return {
        sales_id: '',
        order_number: getValue(r, ['order_number', 'Order #', 'order', 'Order', 'orderNumber']),
        invoice_number: getValue(r, ['invoice_number', 'Invoice #', 'invoice', 'Invoice']) || undefined,
        quotation_id: getValue(r, ['quotation_id', 'Quotation ID', 'quotation']) || undefined,
        lead_id: getValue(r, ['lead_id', 'Lead ID', 'lead']) || undefined,
        customer_name: customerName,
        customer_type: (getValue(r, ['customer_type', 'Customer Type', 'type', 'Type']) || 'ลูกค้าทั่วไป') as any,
        order_date: getValue(r, ['order_date', 'Date', 'date', 'orderDate']) || new Date().toISOString().split('T')[0],
        sales_channel: getValue(r, ['sales_channel', 'Channel', 'channel', 'source', 'Source']) || 'Direct',
        salesperson: getValue(r, ['salesperson', 'Salesperson', 'sales_person', 'assigned_to']),
        order_status: (getValue(r, ['order_status', 'Status', 'status']) || 'Confirmed') as OrderStatus,
        payment_status: (getValue(r, ['payment_status', 'Payment', 'payment']) || 'Unpaid') as PaymentStatus,
        shipping_fee: getNumber(r, ['shipping_fee', 'Shipping', 'shipping', 'delivery']),
        subtotal: subtotal,
        discount: getNumber(r, ['discount', 'Discount']),
        tax_amount: getNumber(r, ['tax', 'Tax', 'tax_amount', 'vat']),
        grand_total: getNumber(r, ['grand_total', 'Total', 'total', 'amount']),
        net_sales: getNumber(r, ['net_sales', 'Net Sales', 'net']) || subtotal,
        cost_of_goods_sold: getNumber(r, ['cogs', 'COGS', 'cost', 'cost_of_goods_sold']) || undefined,
        gross_profit: getNumber(r, ['gross_profit', 'Profit', 'profit']) || undefined,
        marketing_source: getValue(r, ['marketing_source', 'Source', 'source', 'marketing']) || undefined,
        items: [],
        created_at: new Date().toISOString(),
      };
    });
    const result = addSales(items);
    addImportJob({ job_id: `IJ_${Date.now()}`, module: 'Sales', file_name: 'import.csv', file_size: 0, status: 'Completed', total_rows: rows.length, new_rows: result.new, updated_rows: result.updated, skipped_rows: result.skipped, rejected_rows: result.rejected, errors: result.errors.map(e => ({ row: 0, field: '', message: e })), created_at: new Date().toISOString(), created_by: 'Admin' });
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Track actual sales, orders, and revenue</p>
        <button onClick={() => setShowImport(true)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          <Upload size={16} /> Import CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard title="Total Orders" value={formatNumber(totalOrders)} icon={<ShoppingCart size={18} />} />
        <KPICard title="Net Sales" value={formatCurrency(totalSales)} icon={<DollarSign size={18} />} color="bg-green-50" />
        <KPICard title="Avg Order Value" value={formatCurrency(avgOrderValue)} />
        <KPICard title="Gross Profit" value={totalGrossProfit > 0 ? formatCurrency(totalGrossProfit) : 'N/A'} icon={<TrendingUp size={18} />} color="bg-emerald-50" />
        <KPICard title="Total Weight" value={totalWeight > 0 ? `${formatNumber(totalWeight)} kg` : 'N/A'} icon={<Package size={18} />} />
        <KPICard title="Outstanding" value={formatCurrency(unpaidAmount)} icon={<CreditCard size={18} />} color="bg-red-50" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          <strong>Marketing-attributed Sales:</strong> {formatCurrency(marketingSales)} ({totalSales > 0 ? formatPercent((marketingSales / totalSales) * 100) : '0%'} of total)
          &nbsp;|&nbsp; <strong>Unattributed:</strong> {formatCurrency(totalSales - marketingSales)}
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Sales by Channel</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={salesByChannel} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${(value/1000).toFixed(0)}k`}>
                {salesByChannel.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Sales by Customer Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesByCustomerType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Sales by Salesperson</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesBySalesperson}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 p-3 bg-white rounded-lg border">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Order Status</option>
          {['Draft', 'Confirmed', 'Preparing', 'Partially Delivered', 'Delivered', 'Completed', 'Cancelled', 'Returned'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
          <option value="">All Payment Status</option>
          {['Unpaid', 'Partially Paid', 'Paid', 'Overdue', 'Refunded'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Order #</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Channel</th>
                <th className="px-4 py-2 text-left">Salesperson</th>
                <th className="px-4 py-2 text-right">Net Sales</th>
                <th className="px-4 py-2 text-right">Grand Total</th>
                <th className="px-4 py-2 text-left">Order Status</th>
                <th className="px-4 py-2 text-left">Payment</th>
                <th className="px-4 py-2 text-left">Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.sales_id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(s.sales_id)}>
                  <td className="px-4 py-2 font-medium text-blue-600">{s.order_number}</td>
                  <td className="px-4 py-2">{formatDate(s.order_date)}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{s.customer_name}</div>
                    <div className="text-xs text-gray-500">{s.customer_type}</div>
                  </td>
                  <td className="px-4 py-2 text-xs">{s.sales_channel}</td>
                  <td className="px-4 py-2">{s.salesperson}</td>
                  <td className="px-4 py-2 text-right font-bold text-green-700">{formatCurrency(s.net_sales)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(s.grand_total)}</td>
                  <td className="px-4 py-2"><StatusBadge status={s.order_status} colorClass={getOrderStatusColor(s.order_status)} /></td>
                  <td className="px-4 py-2"><StatusBadge status={s.payment_status} colorClass={getPaymentStatusColor(s.payment_status)} /></td>
                  <td className="px-4 py-2 text-xs text-gray-600">{s.marketing_source || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail */}
      {selectedOrder && (() => {
        const order = data.sales.find(s => s.sales_id === selectedOrder);
        if (!order) return null;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{order.order_number}</h3>
                  <p className="text-xs text-gray-500">{formatDate(order.order_date)} • {order.customer_name}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={order.order_status} colorClass={getOrderStatusColor(order.order_status)} />
                  <StatusBadge status={order.payment_status} colorClass={getPaymentStatusColor(order.payment_status)} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500 text-xs">Salesperson:</span> <span className="font-medium">{order.salesperson}</span></div>
                  <div><span className="text-gray-500 text-xs">Channel:</span> <span className="font-medium">{order.sales_channel}</span></div>
                  <div><span className="text-gray-500 text-xs">Marketing Source:</span> <span className="font-medium">{order.marketing_source || 'N/A'}</span></div>
                  <div><span className="text-gray-500 text-xs">Delivery:</span> <span className="font-medium">{order.delivery_location || 'N/A'}</span></div>
                </div>
                {order.items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Items</h4>
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50"><tr><th className="px-3 py-1.5 text-left">Product</th><th className="px-3 py-1.5 text-left">Type</th><th className="px-3 py-1.5 text-right">Qty</th><th className="px-3 py-1.5 text-right">Weight</th><th className="px-3 py-1.5 text-right">Total</th></tr></thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item.sales_item_id} className="border-t">
                            <td className="px-3 py-1.5">{item.product_name}</td>
                            <td className="px-3 py-1.5 text-gray-600">{item.steel_type} {item.size}</td>
                            <td className="px-3 py-1.5 text-right">{item.quantity} {item.unit}</td>
                            <td className="px-3 py-1.5 text-right">{item.weight_kg ? `${item.weight_kg} kg` : '-'}</td>
                            <td className="px-3 py-1.5 text-right font-medium">{formatCurrency(item.line_total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-{formatCurrency(order.discount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(order.tax_amount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatCurrency(order.shipping_fee)}</span></div>
                  <div className="flex justify-between font-bold text-base border-t pt-2"><span>Grand Total</span><span>{formatCurrency(order.grand_total)}</span></div>
                  <div className="flex justify-between font-bold text-base text-green-700"><span>Net Sales</span><span>{formatCurrency(order.net_sales)}</span></div>
                  {order.gross_profit !== undefined && <div className="flex justify-between text-sm text-gray-600"><span>Gross Profit</span><span>{formatCurrency(order.gross_profit)}</span></div>}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Sales Data" moduleName="Sales" expectedColumns={['order_number', 'customer_name', 'order_date', 'net_sales', 'grand_total', 'order_status', 'payment_status']} onImport={handleImport} />
    </div>
  );
}
