/**
 * CRC Marketing & Sales Dashboard - Google Apps Script API
 * 
 * วิธีใช้งาน:
 * 1. เปิด Google Sheets ของคุณ
 * 2. คลิก Extensions → Apps Script
 * 3. วางโค้ดนี้ทั้งหมด
 * 4. Deploy → New deployment → Web app
 * 5. Execute as: Me, Who has access: Anyone
 * 6. คัดลอก URL ไปใช้ใน .env
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

/**
 * Handle GET requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheet = e.parameter.sheet;
    
    if (!action || !sheet) {
      return jsonResponse({ error: 'Missing action or sheet parameter' }, 400);
    }

    switch (action) {
      case 'read':
        return handleRead(sheet);
      case 'readAll':
        return handleReadAll();
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const sheet = data.sheet;
    const records = data.records;

    if (!action || !sheet) {
      return jsonResponse({ error: 'Missing action or sheet' }, 400);
    }

    switch (action) {
      case 'create':
        return handleCreate(sheet, records);
      case 'update':
        return handleUpdate(sheet, records);
      case 'delete':
        return handleDelete(sheet, records);
      case 'upsert':
        return handleUpsert(sheet, records);
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Read all data from a sheet
 */
function handleRead(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return jsonResponse({ error: `Sheet "${sheetName}" not found` }, 404);
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return jsonResponse({ records: [], count: 0 });
  }

  const headers = data[0];
  const records = data.slice(1).map(row => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index];
    });
    return record;
  });

  return jsonResponse({ records, count: records.length });
}

/**
 * Read all sheets
 */
function handleReadAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {};

  Object.values(SHEETS).forEach(sheetName => {
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
    }
  });

  return jsonResponse(result);
}

/**
 * Create new records
 */
function handleCreate(sheetName, records) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return jsonResponse({ error: `Sheet "${sheetName}" not found` }, 404);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let created = 0;

  records.forEach(record => {
    const row = headers.map(header => record[header] || '');
    sheet.appendRow(row);
    created++;
  });

  return jsonResponse({ success: true, created });
}

/**
 * Update existing records
 */
function handleUpdate(sheetName, records) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return jsonResponse({ error: `Sheet "${sheetName}" not found` }, 404);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColumn = headers[0]; // Assume first column is ID
  
  let updated = 0;

  records.forEach(record => {
    const id = record[idColumn];
    const rowIndex = data.findIndex(row => row[0] === id);
    
    if (rowIndex > 0) {
      const row = headers.map(header => record[header] !== undefined ? record[header] : data[rowIndex][headers.indexOf(header)]);
      sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);
      updated++;
    }
  });

  return jsonResponse({ success: true, updated });
}

/**
 * Delete records
 */
function handleDelete(sheetName, records) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return jsonResponse({ error: `Sheet "${sheetName}" not found` }, 404);
  }

  const data = sheet.getDataRange().getValues();
  const idColumn = data[0][0];
  
  let deleted = 0;

  // Delete from bottom to top to avoid index shifting
  const rowsToDelete = [];
  records.forEach(record => {
    const id = record[idColumn];
    const rowIndex = data.findIndex(row => row[0] === id);
    if (rowIndex > 0) {
      rowsToDelete.push(rowIndex + 1);
    }
  });

  rowsToDelete.sort((a, b) => b - a).forEach(rowIndex => {
    sheet.deleteRow(rowIndex);
    deleted++;
  });

  return jsonResponse({ success: true, deleted });
}

/**
 * Upsert (create or update) records
 */
function handleUpsert(sheetName, records) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return jsonResponse({ error: `Sheet "${sheetName}" not found` }, 404);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColumn = headers[0];
  
  let created = 0;
  let updated = 0;

  records.forEach(record => {
    const id = record[idColumn];
    const rowIndex = data.findIndex(row => row[0] === id);
    
    if (rowIndex > 0) {
      // Update existing
      const row = headers.map(header => record[header] !== undefined ? record[header] : data[rowIndex][headers.indexOf(header)]);
      sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);
      updated++;
    } else {
      // Create new
      const row = headers.map(header => record[header] || '');
      sheet.appendRow(row);
      created++;
    }
  });

  return jsonResponse({ success: true, created, updated });
}

/**
 * Helper: Return JSON response
 */
function jsonResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - Run this to test the API
 */
function testAPI() {
  const testSheet = SHEETS.CAMPAIGNS;
  
  // Test read
  const readResult = handleRead(testSheet);
  Logger.log('Read result:', readResult.getContent());
  
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
  
  const createResult = handleCreate(testSheet, [testRecord]);
  Logger.log('Create result:', createResult.getContent());
}
