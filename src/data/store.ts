import { v4 as uuidv4 } from 'uuid';
import type {
  Campaign, AdvertisingPerformance, SocialContent, WebsiteAnalytics,
  Lead, Quotation, SalesOrder, ImportJob, DataQualityIssue, User
} from '../types';

// ============ DEMO DATA ============
const DEMO_CAMPAIGNS: Campaign[] = [
  { campaign_id: 'C001', campaign_name: 'เหล็กเส้น Promo Q1', platform: 'Facebook Ads', start_date: '2025-01-01', end_date: '2025-03-31', status: 'Completed', budget: 50000, created_at: '2024-12-20' },
  { campaign_id: 'C002', campaign_name: 'เหล็กโครงสร้าง Google', platform: 'Google Ads', start_date: '2025-02-01', end_date: '2025-06-30', status: 'Active', budget: 80000, created_at: '2025-01-15' },
  { campaign_id: 'C003', campaign_name: 'เหล็กแผ่น LINE OA', platform: 'LINE Ads', start_date: '2025-03-01', end_date: '2025-05-31', status: 'Active', budget: 30000, created_at: '2025-02-20' },
  { campaign_id: 'C004', campaign_name: 'เหล็ก H-Beam ผู้รับเหมา', platform: 'Facebook Ads', start_date: '2025-04-01', end_date: '2025-06-30', status: 'Active', budget: 60000, created_at: '2025-03-15' },
];

const DEMO_ADS: AdvertisingPerformance[] = [
  { id: 'A001', campaign_id: 'C001', platform: 'Facebook Ads', report_level: 'Campaign', date: '2025-01-15', spend: 2500, impressions: 15000, reach: 12000, clicks: 450, ctr: 3.0, cpc: 5.56, cpm: 166.67, leads: 12, qualified_leads: 5, source_file: 'fb_jan.csv' },
  { id: 'A002', campaign_id: 'C001', platform: 'Facebook Ads', report_level: 'Campaign', date: '2025-02-15', spend: 3200, impressions: 18000, reach: 14500, clicks: 520, ctr: 2.89, cpc: 6.15, cpm: 177.78, leads: 15, qualified_leads: 7 },
  { id: 'A003', campaign_id: 'C002', platform: 'Google Ads', report_level: 'Campaign', date: '2025-03-15', spend: 5000, impressions: 25000, reach: 20000, clicks: 800, ctr: 3.2, cpc: 6.25, cpm: 200, leads: 22, qualified_leads: 10 },
  { id: 'A004', campaign_id: 'C002', platform: 'Google Ads', report_level: 'Campaign', date: '2025-04-15', spend: 4800, impressions: 23000, reach: 18500, clicks: 750, ctr: 3.26, cpc: 6.4, cpm: 208.7, leads: 20, qualified_leads: 9 },
  { id: 'A005', campaign_id: 'C003', platform: 'LINE Ads', report_level: 'Campaign', date: '2025-03-15', spend: 1500, impressions: 8000, reach: 6500, clicks: 200, ctr: 2.5, cpc: 7.5, cpm: 187.5, leads: 8, qualified_leads: 3 },
  { id: 'A006', campaign_id: 'C004', platform: 'Facebook Ads', report_level: 'Campaign', date: '2025-04-15', spend: 4000, impressions: 20000, reach: 16000, clicks: 600, ctr: 3.0, cpc: 6.67, cpm: 200, leads: 18, qualified_leads: 8 },
  { id: 'A007', campaign_id: 'C004', platform: 'Facebook Ads', report_level: 'Campaign', date: '2025-05-15', spend: 3800, impressions: 19000, reach: 15200, clicks: 570, ctr: 3.0, cpc: 6.67, cpm: 200, leads: 16, qualified_leads: 7 },
];

const DEMO_LEADS: Lead[] = [
  { lead_id: 'L001', created_at: '2025-01-10', inquiry_date: '2025-01-10', source: 'Facebook Ads', campaign_id: 'C001', customer_type: 'ผู้รับเหมา', customer_name: 'บริษัท สร้างดี จำกัด', contact_person: 'สมชาย ใจดี', phone: '081-234-5678', email: 'somchai@sangdee.co.th', product_category: 'เหล็กเส้น', steel_type: 'เหล็กเส้นกลม', steel_grade: 'SD30', quantity: 500, unit: 'เส้น', estimated_budget: 150000, delivery_location: 'กรุงเทพฯ', lead_status: 'Won', lead_temperature: 'Hot', assigned_to: 'วิชัย', last_contact_at: '2025-01-25', quotation_id: 'Q001', status_history: [{ date: '2025-01-10', from_status: '', to_status: 'New Lead', changed_by: 'System' }, { date: '2025-01-25', from_status: 'Negotiation', to_status: 'Won', changed_by: 'วิชัย' }] },
  { lead_id: 'L002', created_at: '2025-02-05', inquiry_date: '2025-02-05', source: 'Google Ads', campaign_id: 'C002', customer_type: 'ช่าง', customer_name: 'ช่างประเสริฐ', contact_person: 'ประเสริฐ เก่งงาน', phone: '089-876-5432', product_category: 'เหล็กโครงสร้าง', steel_type: 'เหล็ก I-Beam', size: '200x100', quantity: 50, unit: 'ท่อน', estimated_budget: 200000, delivery_location: 'นครราชสีมา', lead_status: 'Quotation Sent', lead_temperature: 'Hot', assigned_to: 'สมศรี', last_contact_at: '2025-02-20', quotation_id: 'Q002', status_history: [{ date: '2025-02-05', from_status: '', to_status: 'New Lead', changed_by: 'System' }, { date: '2025-02-20', from_status: 'Qualified', to_status: 'Quotation Sent', changed_by: 'สมศรี' }] },
  { lead_id: 'L003', created_at: '2025-03-12', inquiry_date: '2025-03-12', source: 'LINE OA', campaign_id: 'C003', customer_type: 'โรงงาน', customer_name: 'โรงงานเหล็กไทย Metal Co.', contact_person: 'John Smith', phone: '02-123-4567', line_id: '@thaisteel', product_category: 'เหล็กแผ่น', steel_type: 'เหล็กแผ่นรีดร้อน', thickness: '6mm', quantity: 100, unit: 'แผ่น', estimated_weight_kg: 5000, estimated_budget: 350000, delivery_location: 'สมุทรปราการ', lead_status: 'Negotiation', lead_temperature: 'Warm', assigned_to: 'วิชัย', last_contact_at: '2025-03-25', quotation_id: 'Q003', status_history: [{ date: '2025-03-12', from_status: '', to_status: 'New Lead', changed_by: 'System' }] },
  { lead_id: 'L004', created_at: '2025-04-01', inquiry_date: '2025-04-01', source: 'Walk-in', customer_type: 'ลูกค้าทั่วไป', customer_name: 'คุณสมหญิง', contact_person: 'สมหญิง ดีงาม', phone: '062-111-2222', product_category: 'เหล็กเส้น', steel_type: 'เหล็กเส้นข้ออ้อย', steel_grade: 'SD40', size: '12mm', quantity: 200, unit: 'เส้น', estimated_budget: 80000, delivery_location: 'กรุงเทพฯ', lead_status: 'Qualified', lead_temperature: 'Warm', assigned_to: 'สมศรี', next_follow_up_at: '2025-05-01', status_history: [{ date: '2025-04-01', from_status: '', to_status: 'New Lead', changed_by: 'System' }] },
  { lead_id: 'L005', created_at: '2025-04-15', inquiry_date: '2025-04-15', source: 'Facebook Ads', campaign_id: 'C004', customer_type: 'ผู้รับเหมา', customer_name: 'บ. ก่อสร้างมั่นคง', contact_person: 'วีระ มั่นคง', phone: '086-333-4444', product_category: 'เหล็กโครงสร้าง', steel_type: 'เหล็ก H-Beam', size: '300x300', quantity: 100, unit: 'ท่อน', estimated_budget: 500000, delivery_location: 'ชลบุรี', lead_status: 'Contacted', lead_temperature: 'Cold', assigned_to: 'วิชัย', last_contact_at: '2025-04-18', status_history: [{ date: '2025-04-15', from_status: '', to_status: 'New Lead', changed_by: 'System' }, { date: '2025-04-18', from_status: 'New Lead', to_status: 'Contacted', changed_by: 'วิชัย' }] },
  { lead_id: 'L006', created_at: '2025-05-01', inquiry_date: '2025-05-01', source: 'Referral', customer_type: 'ร้านวัสดุก่อสร้าง', customer_name: 'ร้านวัสดุก่อสร้างบ้านช่าง', contact_person: 'ช่างประสิทธิ์', phone: '084-555-6666', product_category: 'เหล็กเส้น', steel_type: 'เหล็กเส้นข้ออ้อย', steel_grade: 'SD40', quantity: 1000, unit: 'เส้น', estimated_budget: 300000, delivery_location: 'ขอนแก่น', lead_status: 'New Lead', lead_temperature: 'Warm', assigned_to: 'สมศรี', status_history: [{ date: '2025-05-01', from_status: '', to_status: 'New Lead', changed_by: 'System' }] },
  { lead_id: 'L007', created_at: '2025-03-20', inquiry_date: '2025-03-20', source: 'Google Ads', campaign_id: 'C002', customer_type: 'ผู้ประกอบการ', customer_name: 'บ. อสังหาริมทรัพย์ ABC', contact_person: 'อรุณี สว่าง', phone: '02-777-8888', email: 'arunee@abc.co.th', product_category: 'เหล็กโครงสร้าง', steel_type: 'เหล็ก I-Beam', quantity: 200, unit: 'ท่อน', estimated_budget: 800000, delivery_location: 'ปทุมธานี', lead_status: 'Lost', lead_temperature: 'Cold', assigned_to: 'วิชัย', lost_reason: 'ราคาสูงเกินไป', last_contact_at: '2025-04-10', status_history: [{ date: '2025-03-20', from_status: '', to_status: 'New Lead', changed_by: 'System' }, { date: '2025-04-10', from_status: 'Negotiation', to_status: 'Lost', changed_by: 'วิชัย', note: 'ราคาสูงเกินไป' }] },
];

const DEMO_QUOTATIONS: Quotation[] = [
  { quotation_id: 'Q001', quotation_number: 'CRC-2025-001', lead_id: 'L001', quotation_date: '2025-01-15', valid_until: '2025-02-15', salesperson: 'วิชัย', quotation_status: 'Converted to Order', items: [{ item_id: 'QI001', product_name: 'เหล็กเส้นกลม SD30 10mm', steel_type: 'เหล็กเส้นกลม', steel_grade: 'SD30', size: '10mm', quantity: 500, unit: 'เส้น', weight_kg: 308, unit_price: 280, discount_amount: 0, line_total: 140000 }], subtotal: 140000, discount: 0, tax_amount: 9800, shipping_fee: 3000, grand_total: 152800, currency: 'THB', created_at: '2025-01-15', updated_at: '2025-01-25' },
  { quotation_id: 'Q002', quotation_number: 'CRC-2025-002', lead_id: 'L002', quotation_date: '2025-02-10', valid_until: '2025-03-10', salesperson: 'สมศรี', quotation_status: 'Sent', items: [{ item_id: 'QI002', product_name: 'เหล็ก I-Beam 200x100', steel_type: 'เหล็ก I-Beam', size: '200x100', quantity: 50, unit: 'ท่อน', weight_kg: 1100, unit_price: 4200, discount_amount: 5000, line_total: 205000 }], subtotal: 210000, discount: 5000, tax_amount: 14350, shipping_fee: 5000, grand_total: 224350, currency: 'THB', created_at: '2025-02-10', updated_at: '2025-02-20' },
  { quotation_id: 'Q003', quotation_number: 'CRC-2025-003', lead_id: 'L003', quotation_date: '2025-03-18', valid_until: '2025-04-18', salesperson: 'วิชัย', quotation_status: 'Negotiation', items: [{ item_id: 'QI003', product_name: 'เหล็กแผ่นรีดร้อน 6mm', steel_type: 'เหล็กแผ่นรีดร้อน', thickness: '6mm', quantity: 100, unit: 'แผ่น', weight_kg: 2826, unit_price: 3500, discount_amount: 10000, line_total: 340000 }], subtotal: 350000, discount: 10000, tax_amount: 23800, shipping_fee: 8000, grand_total: 371800, currency: 'THB', created_at: '2025-03-18', updated_at: '2025-03-25' },
];

const DEMO_SALES: SalesOrder[] = [
  { sales_id: 'S001', order_number: 'ORD-2025-001', invoice_number: 'INV-2025-001', quotation_id: 'Q001', lead_id: 'L001', customer_name: 'บริษัท สร้างดี จำกัด', customer_type: 'ผู้รับเหมา', order_date: '2025-01-25', invoice_date: '2025-01-25', delivery_date: '2025-01-28', sales_channel: 'Direct', salesperson: 'วิชัย', order_status: 'Completed', payment_status: 'Paid', shipping_method: 'รถบรรทุก', delivery_location: 'กรุงเทพฯ', shipping_fee: 3000, subtotal: 140000, discount: 0, tax_amount: 9800, grand_total: 152800, net_sales: 140000, cost_of_goods_sold: 105000, gross_profit: 35000, marketing_source: 'Facebook Ads', campaign_id: 'C001', items: [{ sales_item_id: 'SI001', sales_id: 'S001', product_name: 'เหล็กเส้นกลม SD30 10mm', product_category: 'เหล็กเส้น', steel_type: 'เหล็กเส้นกลม', steel_grade: 'SD30', size: '10mm', quantity: 500, unit: 'เส้น', weight_kg: 308, unit_price: 280, discount_amount: 0, line_total: 140000, unit_cost: 210, line_cost: 105000 }], created_at: '2025-01-25' },
  { sales_id: 'S002', order_number: 'ORD-2025-002', quotation_id: 'Q001', lead_id: 'L001', customer_name: 'บริษัท สร้างดี จำกัด', customer_type: 'ผู้รับเหมา', order_date: '2025-02-20', delivery_date: '2025-02-23', sales_channel: 'Direct', salesperson: 'วิชัย', order_status: 'Delivered', payment_status: 'Partially Paid', shipping_fee: 4000, subtotal: 200000, discount: 5000, tax_amount: 13650, grand_total: 212650, net_sales: 195000, cost_of_goods_sold: 150000, gross_profit: 45000, marketing_source: 'Facebook Ads', campaign_id: 'C001', items: [{ sales_item_id: 'SI002', sales_id: 'S002', product_name: 'เหล็กเส้นข้ออ้อย SD40 16mm', product_category: 'เหล็กเส้น', steel_type: 'เหล็กเส้นข้ออ้อย', steel_grade: 'SD40', size: '16mm', quantity: 800, unit: 'เส้น', weight_kg: 950, unit_price: 250, discount_amount: 5000, line_total: 195000, unit_cost: 187.5, line_cost: 150000 }], created_at: '2025-02-20' },
  { sales_id: 'S003', order_number: 'ORD-2025-003', customer_name: 'ร้านวัสดุก่อสร้างบ้านช่าง', customer_type: 'ร้านวัสดุก่อสร้าง', order_date: '2025-03-15', delivery_date: '2025-03-18', sales_channel: 'Walk-in', salesperson: 'สมศรี', order_status: 'Completed', payment_status: 'Paid', shipping_fee: 0, subtotal: 85000, discount: 0, tax_amount: 5950, grand_total: 90950, net_sales: 85000, cost_of_goods_sold: 63750, gross_profit: 21250, marketing_source: 'Referral', items: [{ sales_item_id: 'SI003', sales_id: 'S003', product_name: 'เหล็กเส้นข้ออ้อย SD40 12mm', product_category: 'เหล็กเส้น', steel_type: 'เหล็กเส้นข้ออ้อย', steel_grade: 'SD40', size: '12mm', quantity: 500, unit: 'เส้น', weight_kg: 370, unit_price: 170, discount_amount: 0, line_total: 85000, unit_cost: 127.5, line_cost: 63750 }], created_at: '2025-03-15' },
  { sales_id: 'S004', order_number: 'ORD-2025-004', customer_name: 'โรงงาน ABC Metal', customer_type: 'โรงงาน', order_date: '2025-04-10', sales_channel: 'Direct', salesperson: 'วิชัย', order_status: 'Preparing', payment_status: 'Unpaid', shipping_fee: 12000, subtotal: 450000, discount: 15000, tax_amount: 30450, grand_total: 465450, net_sales: 435000, marketing_source: 'Google Ads', campaign_id: 'C002', items: [{ sales_item_id: 'SI004', sales_id: 'S004', product_name: 'เหล็ก H-Beam 300x300', product_category: 'เหล็กโครงสร้าง', steel_type: 'เหล็ก H-Beam', size: '300x300', quantity: 30, unit: 'ท่อน', weight_kg: 2700, unit_price: 15000, discount_amount: 15000, line_total: 435000, unit_cost: 11000, line_cost: 330000 }], created_at: '2025-04-10' },
];

const DEMO_SOCIAL: SocialContent[] = [
  { id: 'SC001', platform: 'Facebook', page_id: 'CRC_Steel', page_name: 'CRC เหล็กคุณภาพ', post_id: 'P001', post_url: 'https://facebook.com/post/001', post_date: '2025-01-05', metric_date: '2025-01-31', content_type: 'Image', content_category: 'ความรู้เรื่องเหล็ก', reach: 5000, impressions: 8000, engagement: 350, reactions: 280, comments: 45, shares: 25, link_clicks: 120, video_views: 0, leads_generated: 3 },
  { id: 'SC002', platform: 'Facebook', page_id: 'CRC_Steel', page_name: 'CRC เหล็กคุณภาพ', post_id: 'P002', post_url: 'https://facebook.com/post/002', post_date: '2025-02-10', metric_date: '2025-02-28', content_type: 'Video', content_category: 'แนะนำสินค้า', reach: 12000, impressions: 18000, engagement: 800, reactions: 650, comments: 90, shares: 60, link_clicks: 250, video_views: 5000, leads_generated: 8 },
  { id: 'SC003', platform: 'Facebook', page_id: 'CRC_Steel', page_name: 'CRC เหล็กคุณภาพ', post_id: 'P003', post_url: 'https://facebook.com/post/003', post_date: '2025-03-15', metric_date: '2025-03-31', content_type: 'Image', content_category: 'ราคาและโปรโมชั่น', reach: 8000, impressions: 12000, engagement: 500, reactions: 400, comments: 60, shares: 40, link_clicks: 300, video_views: 0, leads_generated: 12 },
  { id: 'SC004', platform: 'LINE', page_id: 'CRC_LINE', page_name: 'CRC Steel LINE OA', post_id: 'LP001', post_url: '', post_date: '2025-04-01', metric_date: '2025-04-30', content_type: 'Rich Message', content_category: 'คอนเทนต์สร้างแบรนด์', reach: 3000, impressions: 3000, engagement: 200, reactions: 150, comments: 30, shares: 20, link_clicks: 80, video_views: 0, leads_generated: 5 },
];

const DEMO_WEBSITE: WebsiteAnalytics[] = [
  { id: 'WA001', date: '2025-01-31', source: 'Google', medium: 'organic', campaign: '', landing_page: '/products/steel-bars', sessions: 450, users: 380, new_users: 120, engaged_sessions: 280, engagement_rate: 62.2, page_views: 890, key_events: 25, form_submissions: 8, click_to_call: 12, line_clicks: 5, product_inquiry: 15, boq_upload: 2 },
  { id: 'WA002', date: '2025-01-31', source: 'Facebook', medium: 'cpc', campaign: 'เหล็กเส้น Promo Q1', landing_page: '/products/steel-bars', sessions: 320, users: 290, new_users: 250, engaged_sessions: 200, engagement_rate: 62.5, page_views: 580, key_events: 18, form_submissions: 5, click_to_call: 8, line_clicks: 3, product_inquiry: 10, boq_upload: 1 },
  { id: 'WA003', date: '2025-02-28', source: 'Google', medium: 'organic', campaign: '', landing_page: '/products/steel-beams', sessions: 520, users: 440, new_users: 150, engaged_sessions: 340, engagement_rate: 65.4, page_views: 1020, key_events: 30, form_submissions: 10, click_to_call: 15, line_clicks: 8, product_inquiry: 20, boq_upload: 3 },
  { id: 'WA004', date: '2025-02-28', source: 'Google', medium: 'cpc', campaign: 'เหล็กโครงสร้าง Google', landing_page: '/products/steel-beams', sessions: 280, users: 260, new_users: 230, engaged_sessions: 180, engagement_rate: 64.3, page_views: 500, key_events: 15, form_submissions: 4, click_to_call: 6, line_clicks: 2, product_inquiry: 8, boq_upload: 1 },
  { id: 'WA005', date: '2025-03-31', source: '(direct)', medium: '(none)', campaign: '', landing_page: '/', sessions: 180, users: 160, new_users: 40, engaged_sessions: 120, engagement_rate: 66.7, page_views: 400, key_events: 10, form_submissions: 3, click_to_call: 5, line_clicks: 2, product_inquiry: 6, boq_upload: 0 },
];

const DEMO_IMPORT_JOBS: ImportJob[] = [
  { job_id: 'IJ001', module: 'Advertising', file_name: 'fb_ads_jan2025.csv', file_size: 24500, status: 'Completed', total_rows: 30, new_rows: 28, updated_rows: 2, skipped_rows: 0, rejected_rows: 0, errors: [], created_at: '2025-02-01T10:30:00', created_by: 'Admin' },
  { job_id: 'IJ002', module: 'Leads', file_name: 'leads_export.csv', file_size: 18200, status: 'Completed', total_rows: 15, new_rows: 12, updated_rows: 2, skipped_rows: 1, rejected_rows: 0, errors: [{ row: 8, field: 'phone', message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง', value: '081-abc-5678' }], created_at: '2025-03-01T14:20:00', created_by: 'Admin' },
];

const DEMO_USERS: User[] = [
  { user_id: 'U001', username: 'admin', full_name: 'ผู้ดูแลระบบ CRC', email: 'admin@crc-steel.com', role: 'Admin' },
  { user_id: 'U002', username: 'wichai', full_name: 'วิชัย ขายเก่ง', email: 'wichai@crc-steel.com', role: 'Sales' },
  { user_id: 'U003', username: 'somsri', full_name: 'สมศรี ดีเด่น', email: 'somsri@crc-steel.com', role: 'Sales' },
  { user_id: 'U004', username: 'marketing', full_name: 'ทีมการตลาด CRC', email: 'marketing@crc-steel.com', role: 'Marketing' },
];

// ============ DATA STORE ============
const STORAGE_KEY = 'crc_dashboard_data';

interface DataStore {
  campaigns: Campaign[];
  ads: AdvertisingPerformance[];
  social: SocialContent[];
  website: WebsiteAnalytics[];
  leads: Lead[];
  quotations: Quotation[];
  sales: SalesOrder[];
  importJobs: ImportJob[];
  users: User[];
  initialized: boolean;
}

function getDefaultStore(): DataStore {
  return {
    campaigns: [], ads: [], social: [], website: [], leads: [],
    quotations: [], sales: [], importJobs: [], users: [], initialized: true,
  };
}

// Local demo data is intentionally not loaded or migrated. The shared database is the source of truth.
export function loadData(): DataStore {
  return getDefaultStore();
}

export function saveData(_data: DataStore): void {
  // Persistence is handled by DataContext through Supabase.
}

export function resetData(): DataStore {
  return getDefaultStore();
}

export function generateId(prefix: string = ''): string {
  return prefix + uuidv4().slice(0, 8);
}

// ============ UTILITY FUNCTIONS ============
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num);
}

export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getLeadStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'New Lead': 'bg-blue-100 text-blue-800',
    'Contacting': 'bg-yellow-100 text-yellow-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Requirement Gathering': 'bg-purple-100 text-purple-800',
    'Qualified': 'bg-indigo-100 text-indigo-800',
    'Quotation Requested': 'bg-orange-100 text-orange-800',
    'Quotation Sent': 'bg-orange-100 text-orange-800',
    'Negotiation': 'bg-amber-100 text-amber-800',
    'Won': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800',
    'On Hold': 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getQuotationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Pending Cost Confirmation': 'bg-yellow-100 text-yellow-800',
    'Pending Approval': 'bg-yellow-100 text-yellow-800',
    'Sent': 'bg-blue-100 text-blue-800',
    'Negotiation': 'bg-amber-100 text-amber-800',
    'Accepted': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Expired': 'bg-gray-100 text-gray-600',
    'Converted to Order': 'bg-emerald-100 text-emerald-800',
    'Cancelled': 'bg-red-100 text-red-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-yellow-100 text-yellow-800',
    'Partially Delivered': 'bg-orange-100 text-orange-800',
    'Delivered': 'bg-indigo-100 text-indigo-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Returned': 'bg-red-100 text-red-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Unpaid': 'bg-red-100 text-red-800',
    'Partially Paid': 'bg-yellow-100 text-yellow-800',
    'Paid': 'bg-green-100 text-green-800',
    'Overdue': 'bg-red-100 text-red-800',
    'Refunded': 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getTemperatureColor(temp: string): string {
  switch (temp) {
    case 'Hot': return 'text-red-500';
    case 'Warm': return 'text-orange-500';
    case 'Cold': return 'text-blue-400';
    default: return 'text-gray-500';
  }
}
