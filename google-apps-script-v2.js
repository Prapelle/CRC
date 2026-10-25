/**
 * CRC Marketing & Sales Dashboard - Google Apps Script API (v2)
 * รองรับ CORS และ Auto-create sheets
 * 
 * วิธีใช้งาน:
 * 1. เปิด Google Sheets
 * 2. Extensions → Apps Script
 * 3. วางโค้ดนี้ทั้งหมด
 * 4. Deploy → New deployment → Web app
 * 5. Execute as: Me, Who has access: Anyone
 * 6. คัดลอก URL ไปใช้ใน Dashboard
 */

// Sheet Names
const SHEETS = {
  CAMPAIGNS: 'campaigns',
  ADVERTISING: 'advertising',
  SOCIAL: 'social',
  WEBSITE: 'website',
  LEADS: 'leads',
  QUOTATIONS: 'quotations',
  SALES: 'sales',
  USERS: 'users',
};

// Headers for each sheet
const HEADERS = {
  campaigns: ['campaign_id', 'campaign_name', 'platform', 'start_date', 'end_date', 'status', 'budget'],
  advertising: ['id', 'campaign_id', 'platform', 'report_level', 'date', 'spend', 'impressions', 'reach', 'clicks', 'ctr', 'cpc', 'cpm', 'leads', 'qualified_leads'],
  social: ['id', 'platform', 'page_id', 'page_name', 'post_id', 'post_url', 'post_date', 'metric_date', 'content_type', 'content_category', 'reach', 'impressions', 'engagement', 'reactions', 'comments', 'shares', 'link_clicks', 'video_views', 'leads_generated'],
  website: ['id', 'date', 'source', 'medium', 'campaign', 'landing_page', 'sessions', 'users', 'new_users', 'engaged_sessions', 'engagement_rate', 'page_views', 'key_events', 'form_submissions', 'click_to_call', 'line_clicks', 'product_inquiry', 'boq_upload'],
  leads: ['lead_id', 'created_at', 'inquiry_date', 'source', 'customer_type', 'customer_name', 'contact_person', 'phone', 'email', 'product_category', 'steel_type', 'quantity', 'unit', 'estimated_budget', 'lead_status', 'lead_temperature', 'assigned_to'],
  quotations: ['quotation_id', 'quotation_number', 'lead_id', 'quotation_date', 'valid_until', 'salesperson', 'quotation_status', 'subtotal', 'discount', 'tax_amount', 'shipping_fee', 'grand_total'],
  sales: ['sales_id', 'order_number', 'invoice_number', 'order_date', 'customer_name', 'customer_type', 'sales_channel', 'salesperson', 'order_status', 'payment_status', 'subtotal', 'discount', 'tax_amount', 'grand_total', 'net_sales', 'gross_profit', 'marketing_source'],
  users: ['user_id', 'username', 'password', 'full_name', 'email', 'role'],
};

/**
 * Handle GET requests - รองรับ CORS
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheet = e.parameter.sheet;
    
    let result;
    
    if (action === 'read' && sheet) {
      result = handleRead(sheet);
    } else if (action === 'readAll') {
      result = handleReadAll();
    } else if (action === 'test') {
      result = { success: true, message: 'API is working!', timestamp: new Date().toISOString() };
    } else {
      result = { error: 'Invalid action. Use: read, readAll, or test' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests - รองรับ CORS
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const sheet = data.sheet;
    const records = data.records || [];

    let result;

    switch (action) {
      case 'create':
        result = handleCreate(sheet, records);
        break;
      case 'update':
        result = handleUpdate(sheet, records);
        break;
      case 'upsert':
        result = handleUpsert(sheet, records);
        break;
      case 'delete':
        result = handleDelete(sheet, records);
        break;
      default:
        result = { error: 'Invalid action. Use: create, update, upsert, or delete' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Ensure sheet exists with correct headers
 */
function ensureSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headers = HEADERS[sheetName] || [];
    if (headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
  }
  
  return sheet;
}

/**
 * Read all data from a sheet
 */
function handleRead(sheetName) {
  const sheet = ensureSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  
  if (data.length < 2) {
    return { records: [], count: 0 };
  }

  const headers = data[0];
  const records = data.slice(1).map(row => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index];
    });
    return record;
  });

  return { records, count: records.length };
}

/**
 * Read all sheets
 */
function handleReadAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {};

  Object.keys(HEADERS).forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      if (data.length >= 2) {
        const headers = data[0];
        result[sheetName] = data.slice(1).map(row => {
          const record = {};
          headers.forEach((header, index) => {
            record[header] = row[index];
          });
          return record;
        });
      } else {
        result[sheetName] = [];
      }
    } else {
      result[sheetName] = [];
    }
  });

  return result;
}

/**
 * Create new records
 */
function handleCreate(sheetName, records) {
  const sheet = ensureSheet(sheetName);
  const headers = HEADERS[sheetName] || sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  let created = 0;

  records.forEach(record => {
    const row = headers.map(header => {
      const value = record[header];
      return value !== undefined ? value : '';
    });
    sheet.appendRow(row);
    created++;
  });

  return { success: true, created };
}

/**
 * Upsert (create or update) records
 */
function handleUpsert(sheetName, records) {
  const sheet = ensureSheet(sheetName);
  const headers = HEADERS[sheetName] || sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idColumn = headers[0]; // First column is ID
  
  const data = sheet.getDataRange().getValues();
  
  let created = 0;
  let updated = 0;

  records.forEach(record => {
    const id = record[idColumn];
    
    // Find existing row
    let rowIndex = -1;
    if (id) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === id) {
          rowIndex = i;
          break;
        }
      }
    }
    
    const row = headers.map(header => {
      const value = record[header];
      return value !== undefined ? value : '';
    });
    
    if (rowIndex > 0) {
      // Update existing
      sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);
      updated++;
    } else {
      // Create new
      sheet.appendRow(row);
      created++;
    }
  });

  return { success: true, created, updated };
}

/**
 * Update existing records
 */
function handleUpdate(sheetName, records) {
  const sheet = ensureSheet(sheetName);
  const headers = HEADERS[sheetName] || sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idColumn = headers[0];
  
  const data = sheet.getDataRange().getValues();
  let updated = 0;

  records.forEach(record => {
    const id = record[idColumn];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        const row = headers.map(header => {
          const value = record[header];
          return value !== undefined ? value : data[i][headers.indexOf(header)];
        });
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
        updated++;
        break;
      }
    }
  });

  return { success: true, updated };
}

/**
 * Delete records
 */
function handleDelete(sheetName, records) {
  const sheet = ensureSheet(sheetName);
  const headers = HEADERS[sheetName] || sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idColumn = headers[0];
  
  const data = sheet.getDataRange().getValues();
  let deleted = 0;

  // Collect rows to delete (from bottom to top)
  const rowsToDelete = [];
  records.forEach(record => {
    const id = record[idColumn];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowsToDelete.push(i + 1);
        break;
      }
    }
  });

  // Delete from bottom to top
  rowsToDelete.sort((a, b) => b - a).forEach(rowIndex => {
    sheet.deleteRow(rowIndex);
    deleted++;
  });

  return { success: true, deleted };
}

/**
 * Test function - Run this to test the API
 */
function testAPI() {
  // Test readAll
  const readResult = handleReadAll();
  Logger.log('Read all result:', JSON.stringify(readResult));
  
  // Test create
  const testRecord = {
    campaign_id: 'TEST_' + new Date().getTime(),
    campaign_name: 'Test Campaign',
    platform: 'Facebook Ads',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    status: 'Active',
    budget: 50000
  };
  
  const createResult = handleCreate('campaigns', [testRecord]);
  Logger.log('Create result:', JSON.stringify(createResult));
  
  // Test upsert
  const upsertResult = handleUpsert('campaigns', [testRecord]);
  Logger.log('Upsert result:', JSON.stringify(upsertResult));
}
