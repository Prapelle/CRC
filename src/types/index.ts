// CRC Marketing & Sales Dashboard - Data Schema

// ============ CAMPAIGNS ============
export interface Campaign {
  campaign_id: string;
  campaign_name: string;
  platform: string;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  budget: number;
  created_at: string;
}

// ============ ADVERTISING PERFORMANCE ============
export interface AdvertisingPerformance {
  id: string;
  campaign_id: string;
  platform: 'Facebook Ads' | 'Google Ads' | 'LINE Ads' | 'TikTok Ads' | 'Other';
  report_level: 'Campaign' | 'Ad Set' | 'Ad';
  date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  leads: number;
  qualified_leads: number;
  source_file?: string;
  import_job_id?: string;
  source_data_json?: string;
}

// ============ SOCIAL CONTENT ============
export interface SocialContent {
  id: string;
  platform: string;
  page_id: string;
  page_name: string;
  post_id: string;
  post_url: string;
  post_date: string;
  metric_date: string;
  content_type: string;
  content_category: string;
  campaign_id?: string;
  reach: number;
  impressions: number;
  engagement: number;
  reactions: number;
  comments: number;
  shares: number;
  link_clicks: number;
  video_views: number;
  leads_generated: number;
  source_file?: string;
  import_job_id?: string;
  source_data_json?: string;
}

// ============ WEBSITE ANALYTICS ============
export interface WebsiteAnalytics {
  id: string;
  date: string;
  source: string;
  medium: string;
  campaign: string;
  landing_page: string;
  sessions: number;
  users: number;
  new_users: number;
  engaged_sessions: number;
  engagement_rate: number;
  page_views: number;
  key_events: number;
  form_submissions: number;
  click_to_call: number;
  line_clicks: number;
  product_inquiry: number;
  boq_upload: number;
  source_file?: string;
  import_job_id?: string;
  source_data_json?: string;
}

// ============ CUSTOMERS / LEADS ============
export type CustomerType = 
  | 'ผู้รับเหมา' | 'ช่าง' | 'ร้านวัสดุก่อสร้าง' | 'โรงงาน' 
  | 'ผู้ผลิต' | 'ผู้ประกอบการ' | 'เจ้าของโครงการ' 
  | 'ลูกค้าทั่วไป' | 'ร้านค้าตัวแทน' | 'ลูกค้ารายใหญ่' | 'อื่น ๆ';

export type LeadStatus = 
  | 'New Lead' | 'Contacting' | 'Contacted' | 'Requirement Gathering'
  | 'Qualified' | 'Quotation Requested' | 'Quotation Sent' 
  | 'Negotiation' | 'Won' | 'Lost' | 'On Hold';

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export interface Lead {
  lead_id: string;
  created_at: string;
  inquiry_date: string;
  source: string;
  campaign_id?: string;
  customer_type: CustomerType;
  customer_name: string;
  contact_person: string;
  phone: string;
  line_id?: string;
  email?: string;
  product_category: string;
  steel_type: string;
  steel_grade?: string;
  product_specification?: string;
  size?: string;
  thickness?: string;
  length?: string;
  quantity?: number;
  unit?: string;
  estimated_weight_kg?: number;
  estimated_budget?: number;
  delivery_location?: string;
  delivery_date?: string;
  customer_requirement?: string;
  lead_status: LeadStatus;
  lead_temperature: LeadTemperature;
  assigned_to: string;
  last_contact_at?: string;
  next_follow_up_at?: string;
  call_status?: string;
  staff_note?: string;
  customer_note?: string;
  lost_reason?: string;
  quotation_id?: string;
  status_history: StatusHistoryEntry[];
  source_file?: string;
  source_data_json?: string;
}

export interface StatusHistoryEntry {
  date: string;
  from_status: string;
  to_status: string;
  note?: string;
  changed_by: string;
}

// ============ QUOTATIONS ============
export type QuotationStatus = 
  | 'Draft' | 'Pending Cost Confirmation' | 'Pending Approval'
  | 'Sent' | 'Negotiation' | 'Accepted' | 'Rejected' 
  | 'Expired' | 'Converted to Order' | 'Cancelled';

export interface Quotation {
  quotation_id: string;
  quotation_number: string;
  lead_id: string;
  quotation_date: string;
  valid_until: string;
  salesperson: string;
  quotation_status: QuotationStatus;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  tax_amount: number;
  shipping_fee: number;
  grand_total: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  item_id: string;
  product_name: string;
  steel_type: string;
  steel_grade?: string;
  size?: string;
  thickness?: string;
  length?: string;
  quantity: number;
  unit: string;
  weight_kg?: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
}

// ============ SALES ============
export type OrderStatus = 
  | 'Draft' | 'Confirmed' | 'Preparing' | 'Partially Delivered'
  | 'Delivered' | 'Completed' | 'Cancelled' | 'Returned';

export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Refunded';

export interface SalesOrder {
  sales_id: string;
  order_number: string;
  invoice_number?: string;
  quotation_id?: string;
  lead_id?: string;
  customer_name: string;
  customer_type: CustomerType;
  order_date: string;
  invoice_date?: string;
  delivery_date?: string;
  sales_channel: string;
  salesperson: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_method?: string;
  delivery_location?: string;
  shipping_fee: number;
  subtotal: number;
  discount: number;
  tax_amount: number;
  grand_total: number;
  net_sales: number;
  cost_of_goods_sold?: number;
  gross_profit?: number;
  marketing_source?: string;
  campaign_id?: string;
  remark?: string;
  source_file?: string;
  source_data_json?: string;
  items: SalesItem[];
  created_at: string;
  source_file?: string;
  source_data_json?: string;
}

export interface SalesItem {
  sales_item_id: string;
  sales_id: string;
  product_name: string;
  product_category: string;
  steel_type: string;
  steel_grade?: string;
  size?: string;
  thickness?: string;
  length?: string;
  quantity: number;
  unit: string;
  weight_kg?: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
  unit_cost?: number;
  line_cost?: number;
}

// ============ IMPORT JOBS ============
export interface ImportJob {
  job_id: string;
  module: string;
  file_name: string;
  file_size: number;
  status: 'Processing' | 'Completed' | 'Failed' | 'Rolled Back';
  total_rows: number;
  new_rows: number;
  updated_rows: number;
  skipped_rows: number;
  rejected_rows: number;
  errors: ImportError[];
  created_at: string;
  created_by: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

// ============ DATA QUALITY ============
export interface DataQualityIssue {
  id: string;
  module: string;
  record_id: string;
  record_type: string;
  issue_type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  field?: string;
  created_at: string;
  resolved: boolean;
}

// ============ USER / AUTH ============
export type UserRole = 'Admin' | 'Marketing' | 'Sales' | 'Management' | 'Data Analyst';

export interface User {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// ============ FILTERS ============
export interface DateFilter {
  start_date: string;
  end_date: string;
}

export interface DashboardFilters {
  dateRange: DateFilter;
  channels: string[];
  campaigns: string[];
  salespersons: string[];
  customerTypes: CustomerType[];
  productCategories: string[];
}

export interface DataStore {
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
