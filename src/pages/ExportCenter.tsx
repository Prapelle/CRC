import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Download, FileText, Table, CheckCircle } from 'lucide-react';

const EXPORT_DATASETS = [
  { id: 'campaigns', label: 'Campaign Performance', description: 'All campaigns with budget and status' },
  { id: 'advertising', label: 'Paid Media', description: 'Advertising performance data by platform' },
  { id: 'social', label: 'Social Content', description: 'Social media content metrics' },
  { id: 'website', label: 'Website Analytics', description: 'Website traffic and conversion data' },
  { id: 'leads', label: 'Lead Register', description: 'All leads with status and details' },
  { id: 'quotations', label: 'Quotation Register', description: 'All quotations with items and totals' },
  { id: 'sales', label: 'Sales Register', description: 'All sales orders with items' },
  { id: 'sales_items', label: 'Sales Line Items', description: 'Detailed product-level sales data' },
  { id: 'import_history', label: 'Import History', description: 'Record of all data imports' },
  { id: 'quality_report', label: 'Data Quality Report', description: 'Current data quality issues' },
];

export default function ExportCenter() {
  const { data, getQualityIssues } = useData();
  const [exported, setExported] = useState<string[]>([]);

  const exportToCSV = (datasetId: string) => {
    let csvContent = '';
    let filename = '';

    switch (datasetId) {
      case 'campaigns':
        csvContent = 'campaign_id,campaign_name,platform,start_date,end_date,status,budget\n';
        csvContent += data.campaigns.map(c => `${c.campaign_id},"${c.campaign_name}",${c.platform},${c.start_date},${c.end_date},${c.status},${c.budget}`).join('\n');
        filename = 'Campaign_Performance.csv';
        break;
      case 'advertising':
        csvContent = 'id,campaign_id,platform,report_level,date,spend,impressions,reach,clicks,ctr,cpc,cpm,leads,qualified_leads\n';
        csvContent += data.ads.map(a => `${a.id},${a.campaign_id},${a.platform},${a.report_level},${a.date},${a.spend},${a.impressions},${a.reach},${a.clicks},${a.ctr},${a.cpc},${a.cpm},${a.leads},${a.qualified_leads}`).join('\n');
        filename = 'Paid_Media.csv';
        break;
      case 'social':
        csvContent = 'id,platform,page_id,post_id,post_date,metric_date,content_type,content_category,reach,impressions,engagement,reactions,comments,shares,link_clicks,video_views,leads_generated\n';
        csvContent += data.social.map(s => `${s.id},${s.platform},${s.page_id},${s.post_id},${s.post_date},${s.metric_date},${s.content_type},"${s.content_category}",${s.reach},${s.impressions},${s.engagement},${s.reactions},${s.comments},${s.shares},${s.link_clicks},${s.video_views},${s.leads_generated}`).join('\n');
        filename = 'Social_Content.csv';
        break;
      case 'website':
        csvContent = 'id,date,source,medium,campaign,landing_page,sessions,users,new_users,engaged_sessions,engagement_rate,page_views,form_submissions,click_to_call,line_clicks,product_inquiry\n';
        csvContent += data.website.map(w => `${w.id},${w.date},${w.source},${w.medium},"${w.campaign}","${w.landing_page}",${w.sessions},${w.users},${w.new_users},${w.engaged_sessions},${w.engagement_rate},${w.page_views},${w.form_submissions},${w.click_to_call},${w.line_clicks},${w.product_inquiry}`).join('\n');
        filename = 'Website_Analytics.csv';
        break;
      case 'leads':
        csvContent = 'lead_id,created_at,inquiry_date,source,customer_type,customer_name,contact_person,phone,email,product_category,steel_type,quantity,unit,estimated_budget,lead_status,lead_temperature,assigned_to\n';
        csvContent += data.leads.map(l => `${l.lead_id},${l.created_at},${l.inquiry_date},${l.source},"${l.customer_type}","${l.customer_name}","${l.contact_person}",${l.phone},${l.email || ''},${l.product_category},"${l.steel_type}",${l.quantity || ''},${l.unit || ''},${l.estimated_budget || ''},${l.lead_status},${l.lead_temperature},"${l.assigned_to}"`).join('\n');
        filename = 'Lead_Register.csv';
        break;
      case 'quotations':
        csvContent = 'quotation_id,quotation_number,lead_id,quotation_date,valid_until,salesperson,status,subtotal,discount,tax,shipping,grand_total\n';
        csvContent += data.quotations.map(q => `${q.quotation_id},${q.quotation_number},${q.lead_id},${q.quotation_date},${q.valid_until},"${q.salesperson}",${q.quotation_status},${q.subtotal},${q.discount},${q.tax_amount},${q.shipping_fee},${q.grand_total}`).join('\n');
        filename = 'Quotation_Register.csv';
        break;
      case 'sales':
        csvContent = 'sales_id,order_number,invoice_number,order_date,customer_name,customer_type,sales_channel,salesperson,order_status,payment_status,subtotal,discount,tax,grand_total,net_sales,gross_profit,marketing_source\n';
        csvContent += data.sales.map(s => `${s.sales_id},${s.order_number},${s.invoice_number || ''},${s.order_date},"${s.customer_name}","${s.customer_type}",${s.sales_channel},"${s.salesperson}",${s.order_status},${s.payment_status},${s.subtotal},${s.discount},${s.tax_amount},${s.grand_total},${s.net_sales},${s.gross_profit || ''},${s.marketing_source || ''}`).join('\n');
        filename = 'Sales_Register.csv';
        break;
      case 'sales_items':
        csvContent = 'sales_item_id,sales_id,order_number,product_name,product_category,steel_type,size,quantity,unit,weight_kg,unit_price,line_total\n';
        const items: string[] = [];
        data.sales.forEach(s => {
          s.items.forEach(item => {
            items.push(`${item.sales_item_id},${s.sales_id},${s.order_number},"${item.product_name}","${item.product_category}","${item.steel_type}","${item.size || ''}",${item.quantity},${item.unit},${item.weight_kg || ''},${item.unit_price},${item.line_total}`);
          });
        });
        csvContent += items.join('\n');
        filename = 'Sales_Items.csv';
        break;
      case 'import_history':
        csvContent = 'job_id,module,file_name,status,total_rows,new_rows,updated_rows,skipped_rows,rejected_rows,created_at,created_by\n';
        csvContent += data.importJobs.map(j => `${j.job_id},${j.module},"${j.file_name}",${j.status},${j.total_rows},${j.new_rows},${j.updated_rows},${j.skipped_rows},${j.rejected_rows},${j.created_at},"${j.created_by}"`).join('\n');
        filename = 'Import_History.csv';
        break;
      case 'quality_report':
        const issues = getQualityIssues();
        csvContent = 'module,record_id,record_type,issue_type,severity,description,created_at\n';
        csvContent += issues.map(i => `${i.module},${i.record_id},${i.record_type},"${i.issue_type}",${i.severity},"${i.description}",${i.created_at}`).join('\n');
        filename = 'Data_Quality_Report.csv';
        break;
    }

    // Download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);

    setExported(prev => [...prev, datasetId]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Export Center</h3>
        <p className="text-sm text-gray-500">Export data for use in Google Sheets, Looker Studio, or other tools</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-1">📋 For Google Sheets & Looker Studio</h4>
        <p className="text-xs text-blue-700">
          Export data as CSV and import to Google Sheets. Then connect Google Sheets to Looker Studio for live dashboards.
          Column names are standardized for easy mapping.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORT_DATASETS.map(ds => {
          const isExported = exported.includes(ds.id);
          return (
            <div key={ds.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Table size={18} className="text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{ds.label}</h4>
                  <p className="text-xs text-gray-500">{ds.description}</p>
                </div>
              </div>
              <button
                onClick={() => exportToCSV(ds.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isExported ? 'bg-green-100 text-green-700' : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isExported ? <><CheckCircle size={14} /> Exported</> : <><Download size={14} /> Export</>}
              </button>
            </div>
          );
        })}
      </div>

      {/* Schema Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">📐 Data Schema Reference</h3>
        <p className="text-xs text-gray-600 mb-3">Standard column names used across all exports for consistent integration:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { table: 'Campaigns', cols: 'campaign_id, campaign_name, platform, start_date, end_date, status, budget' },
            { table: 'Advertising', cols: 'campaign_id, platform, report_level, date, spend, impressions, clicks, leads' },
            { table: 'Social Content', cols: 'page_id, post_id, post_date, metric_date, content_category, reach, engagement' },
            { table: 'Website', cols: 'date, source, medium, campaign, landing_page, sessions, users, conversions' },
            { table: 'Leads', cols: 'lead_id, inquiry_date, source, customer_type, customer_name, phone, lead_status' },
            { table: 'Quotations', cols: 'quotation_id, quotation_number, lead_id, date, salesperson, status, grand_total' },
            { table: 'Sales', cols: 'sales_id, order_number, order_date, customer_name, net_sales, order_status, payment_status' },
          ].map(s => (
            <div key={s.table} className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-700 mb-1">{s.table}</p>
              <p className="text-gray-500 font-mono text-[10px]">{s.cols}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
