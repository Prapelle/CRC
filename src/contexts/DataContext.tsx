import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  Campaign, AdvertisingPerformance, SocialContent, WebsiteAnalytics,
  Lead, Quotation, SalesOrder, ImportJob, DataQualityIssue, DataStore
} from '../types';
import { loadData, saveData, generateId } from '../data/store';

interface ImportResult {
  new: number;
  updated: number;
  skipped: number;
  rejected: number;
  errors: string[];
}

interface DataContextType {
  data: DataStore;
  refresh: () => void;
  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, c: Partial<Campaign>) => void;
  addAds: (ads: AdvertisingPerformance[]) => ImportResult;
  addSocial: (items: SocialContent[]) => ImportResult;
  addWebsite: (items: WebsiteAnalytics[]) => ImportResult;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  addLeads: (leads: Lead[]) => ImportResult;
  addQuotation: (q: Quotation) => void;
  updateQuotation: (id: string, q: Partial<Quotation>) => void;
  addQuotations: (items: Quotation[]) => ImportResult;
  addSales: (items: SalesOrder[]) => ImportResult;
  updateSales: (id: string, s: Partial<SalesOrder>) => void;
  addImportJob: (job: ImportJob) => void;
  getQualityIssues: () => DataQualityIssue[];
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataStore>(loadData);

  const refresh = useCallback(() => {
    setData(loadData());
  }, []);

  const persist = (newData: DataStore) => {
    saveData(newData);
    setData({ ...newData });
  };

  const addCampaign = (c: Campaign) => {
    persist({ ...data, campaigns: [...data.campaigns, c] });
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    persist({
      ...data,
      campaigns: data.campaigns.map((c: Campaign) => c.campaign_id === id ? { ...c, ...updates } : c)
    });
  };

  const addAds = (ads: AdvertisingPerformance[]): ImportResult => {
    let newCount = 0, updatedCount = 0, skipped = 0, rejected = 0;
    const errors: string[] = [];
    const existingIds = new Set(data.ads.map((a: AdvertisingPerformance) => `${a.campaign_id}_${a.date}_${a.report_level}`));
    const newAds = [...data.ads];

    ads.forEach((ad, idx) => {
      // Auto-fill missing fields with fallbacks
      const finalAd = { ...ad };
      if (!finalAd.campaign_id) finalAd.campaign_id = `CAMPAIGN_${idx + 1}`;
      if (!finalAd.date) finalAd.date = new Date().toISOString().split('T')[0];
      if (!finalAd.platform) finalAd.platform = 'Other';
      if (!finalAd.report_level) finalAd.report_level = 'Campaign';

      const key = `${finalAd.campaign_id}_${finalAd.date}_${finalAd.report_level}`;
      if (existingIds.has(key)) {
        const existIdx = newAds.findIndex((a: AdvertisingPerformance) => `${a.campaign_id}_${a.date}_${a.report_level}` === key);
        if (existIdx >= 0) {
          newAds[existIdx] = { ...newAds[existIdx], ...finalAd };
          updatedCount++;
        }
        skipped++;
      } else {
        newAds.push({ ...finalAd, id: finalAd.id || generateId('A_') });
        existingIds.add(key);
        newCount++;
      }
    });

    persist({ ...data, ads: newAds });
    return { new: newCount, updated: updatedCount, skipped, rejected, errors };
  };

  const addSocial = (items: SocialContent[]): ImportResult => {
    let newCount = 0, updatedCount = 0, skipped = 0, rejected = 0;
    const errors: string[] = [];
    const existingKeys = new Set(data.social.map((s: SocialContent) => `${s.page_id}_${s.post_id}_${s.metric_date}`));
    const newItems = [...data.social];

    items.forEach((item, idx) => {
      // Auto-fill missing fields with fallbacks
      const finalItem = { ...item };
      if (!finalItem.post_id) finalItem.post_id = `POST_${idx + 1}`;
      if (!finalItem.metric_date) finalItem.metric_date = new Date().toISOString().split('T')[0];
      if (!finalItem.page_id) finalItem.page_id = 'PAGE_DEFAULT';
      if (!finalItem.platform) finalItem.platform = 'Facebook';
      if (!finalItem.content_type) finalItem.content_type = 'Post';
      if (!finalItem.content_category) finalItem.content_category = 'Other';

      const key = `${finalItem.page_id}_${finalItem.post_id}_${finalItem.metric_date}`;
      if (existingKeys.has(key)) {
        skipped++;
      } else {
        newItems.push({ ...finalItem, id: finalItem.id || generateId('SC_') });
        existingKeys.add(key);
        newCount++;
      }
    });

    persist({ ...data, social: newItems });
    return { new: newCount, updated: updatedCount, skipped, rejected, errors };
  };

  const addWebsite = (items: WebsiteAnalytics[]): ImportResult => {
    let newCount = 0, updatedCount = 0, skipped = 0, rejected = 0;
    const errors: string[] = [];
    const existingKeys = new Set(data.website.map((w: WebsiteAnalytics) => `${w.date}_${w.source}_${w.medium}_${w.landing_page}`));
    const newItems = [...data.website];

    items.forEach((item, idx) => {
      // Auto-fill missing fields with fallbacks
      const finalItem = { ...item };
      if (!finalItem.date) finalItem.date = new Date().toISOString().split('T')[0];
      if (!finalItem.source) finalItem.source = 'Unknown';
      if (!finalItem.medium) finalItem.medium = '(none)';
      if (!finalItem.landing_page) finalItem.landing_page = '/';

      const key = `${finalItem.date}_${finalItem.source}_${finalItem.medium}_${finalItem.landing_page}`;
      if (existingKeys.has(key)) {
        skipped++;
      } else {
        newItems.push({ ...finalItem, id: finalItem.id || generateId('WA_') });
        existingKeys.add(key);
        newCount++;
      }
    });

    persist({ ...data, website: newItems });
    return { new: newCount, updated: updatedCount, skipped, rejected, errors };
  };

  const addLead = (lead: Lead) => {
    persist({ ...data, leads: [...data.leads, lead] });
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    persist({
      ...data,
      leads: data.leads.map((l: Lead) => l.lead_id === id ? { ...l, ...updates } : l)
    });
  };

  const addLeads = (leads: Lead[]): ImportResult => {
    let newCount = 0, updatedCount = 0, skipped = 0, rejected = 0;
    const errors: string[] = [];
    const existingPhones = new Set(data.leads.map((l: Lead) => l.phone).filter(p => p));
    const newLeads = [...data.leads];

    leads.forEach((lead, idx) => {
      // Auto-fill missing customer_name with fallback
      const finalLead = { ...lead };
      if (!finalLead.customer_name) {
        // Try to use contact_person or phone as fallback
        finalLead.customer_name = finalLead.contact_person || finalLead.phone || `Lead_${idx + 1}`;
      }
      if (!finalLead.contact_person) {
        finalLead.contact_person = finalLead.customer_name;
      }
      if (!finalLead.phone) {
        finalLead.phone = `N/A_${idx + 1}`;
      }
      if (!finalLead.source) {
        finalLead.source = 'Other';
      }
      if (!finalLead.product_category) {
        finalLead.product_category = 'อื่น ๆ';
      }
      if (!finalLead.steel_type) {
        finalLead.steel_type = 'อื่น ๆ';
      }
      if (!finalLead.customer_type) {
        finalLead.customer_type = 'ลูกค้าทั่วไป';
      }
      if (!finalLead.assigned_to) {
        finalLead.assigned_to = 'Unassigned';
      }

      // Skip duplicate by phone (only if phone is real)
      if (finalLead.phone && !finalLead.phone.startsWith('N/A_') && existingPhones.has(finalLead.phone)) {
        skipped++;
      } else {
        newLeads.push({ ...finalLead, lead_id: finalLead.lead_id || generateId('L_') });
        if (finalLead.phone && !finalLead.phone.startsWith('N/A_')) existingPhones.add(finalLead.phone);
        newCount++;
      }
    });

    persist({ ...data, leads: newLeads });
    return { new: newCount, updated: updatedCount, skipped, rejected, errors };
  };

  const addQuotation = (q: Quotation) => {
    persist({ ...data, quotations: [...data.quotations, q] });
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    persist({
      ...data,
      quotations: data.quotations.map((q: Quotation) => q.quotation_id === id ? { ...q, ...updates } : q)
    });
  };

  const addQuotations = (items: Quotation[]): ImportResult => {
    let newCount = 0, updatedCount = 0, skipped = 0, rejected = 0;
    const errors: string[] = [];
    const existingNums = new Set(data.quotations.map((q: Quotation) => q.quotation_number));
    const newItems = [...data.quotations];

    items.forEach((item, idx) => {
      // Auto-fill missing fields with fallbacks
      const finalItem = { ...item };
      if (!finalItem.quotation_number) finalItem.quotation_number = `QT-${Date.now()}-${idx + 1}`;
      if (!finalItem.quotation_date) finalItem.quotation_date = new Date().toISOString().split('T')[0];
      if (!finalItem.valid_until) finalItem.valid_until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      if (!finalItem.salesperson) finalItem.salesperson = 'Unassigned';
      if (!finalItem.quotation_status) finalItem.quotation_status = 'Draft';
      if (!finalItem.currency) finalItem.currency = 'THB';

      if (existingNums.has(finalItem.quotation_number)) {
        skipped++;
      } else {
        newItems.push({ ...finalItem, quotation_id: finalItem.quotation_id || generateId('Q_') });
        existingNums.add(finalItem.quotation_number);
        newCount++;
      }
    });

    persist({ ...data, quotations: newItems });
    return { new: newCount, updated: updatedCount, skipped, rejected, errors };
  };

  const addSales = (items: SalesOrder[]): ImportResult => {
    let newCount = 0, updatedCount = 0, skipped = 0, rejected = 0;
    const errors: string[] = [];
    const existingOrders = new Set(data.sales.map((s: SalesOrder) => s.order_number));
    const newItems = [...data.sales];

    items.forEach((item, idx) => {
      // Auto-fill missing fields with fallbacks
      const finalItem = { ...item };
      if (!finalItem.order_number) finalItem.order_number = `ORD-${Date.now()}-${idx + 1}`;
      if (!finalItem.customer_name) finalItem.customer_name = `Customer_${idx + 1}`;
      if (!finalItem.order_date) finalItem.order_date = new Date().toISOString().split('T')[0];
      if (!finalItem.sales_channel) finalItem.sales_channel = 'Direct';
      if (!finalItem.salesperson) finalItem.salesperson = 'Unassigned';
      if (!finalItem.order_status) finalItem.order_status = 'Confirmed';
      if (!finalItem.payment_status) finalItem.payment_status = 'Unpaid';
      if (!finalItem.customer_type) finalItem.customer_type = 'ลูกค้าทั่วไป';

      if (existingOrders.has(finalItem.order_number)) {
        skipped++;
      } else {
        newItems.push({ ...finalItem, sales_id: finalItem.sales_id || generateId('S_') });
        existingOrders.add(finalItem.order_number);
        newCount++;
      }
    });

    persist({ ...data, sales: newItems });
    return { new: newCount, updated: updatedCount, skipped, rejected, errors };
  };

  const updateSales = (id: string, updates: Partial<SalesOrder>) => {
    persist({
      ...data,
      sales: data.sales.map((s: SalesOrder) => s.sales_id === id ? { ...s, ...updates } : s)
    });
  };

  const addImportJob = (job: ImportJob) => {
    persist({ ...data, importJobs: [job, ...data.importJobs] });
  };

  const getQualityIssues = (): DataQualityIssue[] => {
    const issues: DataQualityIssue[] = [];

    data.leads.forEach((l: Lead) => {
      if (!l.phone) issues.push({ id: generateId(), module: 'Leads', record_id: l.lead_id, record_type: 'Lead', issue_type: 'Missing Phone', severity: 'High', description: `Lead "${l.customer_name}" has no phone number`, created_at: l.created_at, resolved: false });
      if (!l.assigned_to) issues.push({ id: generateId(), module: 'Leads', record_id: l.lead_id, record_type: 'Lead', issue_type: 'No Assignee', severity: 'Medium', description: `Lead "${l.customer_name}" has no assigned salesperson`, created_at: l.created_at, resolved: false });
      if (l.next_follow_up_at && new Date(l.next_follow_up_at) < new Date()) issues.push({ id: generateId(), module: 'Leads', record_id: l.lead_id, record_type: 'Lead', issue_type: 'Overdue Follow-up', severity: 'High', description: `Lead "${l.customer_name}" follow-up overdue`, created_at: l.created_at, resolved: false });
    });

    data.quotations.forEach((q: Quotation) => {
      if (q.quotation_status === 'Sent' && new Date(q.valid_until) < new Date()) {
        issues.push({ id: generateId(), module: 'Quotations', record_id: q.quotation_id, record_type: 'Quotation', issue_type: 'Expired', severity: 'Medium', description: `Quotation ${q.quotation_number} expired on ${q.valid_until}`, created_at: q.created_at, resolved: false });
      }
    });

    data.sales.forEach((s: SalesOrder) => {
      if (!s.items || s.items.length === 0) issues.push({ id: generateId(), module: 'Sales', record_id: s.sales_id, record_type: 'SalesOrder', issue_type: 'No Items', severity: 'High', description: `Order ${s.order_number} has no line items`, created_at: s.created_at, resolved: false });
      if (!s.lead_id && !s.quotation_id) issues.push({ id: generateId(), module: 'Sales', record_id: s.sales_id, record_type: 'SalesOrder', issue_type: 'No Attribution', severity: 'Low', description: `Order ${s.order_number} not linked to any Lead or Quotation`, created_at: s.created_at, resolved: false });
    });

    return issues;
  };

  return (
    <DataContext.Provider value={{
      data, refresh, addCampaign, updateCampaign, addAds, addSocial, addWebsite,
      addLead, updateLead, addLeads, addQuotation, updateQuotation, addQuotations,
      addSales, updateSales, addImportJob, getQualityIssues,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
