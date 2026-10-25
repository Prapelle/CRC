/**
 * Google Sheets API Service
 * Handles all communication with Google Sheets via Apps Script
 */

const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';
const SYNC_ENABLED = import.meta.env.VITE_ENABLE_GOOGLE_SHEETS_SYNC === 'true';

export interface ApiResponse<T = any> {
  success?: boolean;
  records?: T[];
  count?: number;
  created?: number;
  updated?: number;
  deleted?: number;
  error?: string;
}

/**
 * Check if Google Sheets sync is enabled
 */
export function isSyncEnabled(): boolean {
  return SYNC_ENABLED && !!API_URL;
}

/**
 * Read all data from a sheet
 */
export async function readSheet<T>(sheetName: string): Promise<T[]> {
  if (!isSyncEnabled()) {
    console.warn(`Google Sheets sync disabled. Cannot read from ${sheetName}`);
    return [];
  }

  try {
    const url = `${API_URL}?action=read&sheet=${sheetName}`;
    const response = await fetch(url);
    const data: ApiResponse<T> = await response.json();

    if (data.error) {
      console.error(`Error reading ${sheetName}:`, data.error);
      return [];
    }

    return data.records || [];
  } catch (error) {
    console.error(`Failed to read ${sheetName}:`, error);
    return [];
  }
}

/**
 * Read all sheets at once
 */
export async function readAllSheets(): Promise<Record<string, any[]>> {
  if (!isSyncEnabled()) {
    console.warn('Google Sheets sync disabled.');
    return {};
  }

  try {
    const url = `${API_URL}?action=readAll`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Error reading all sheets:', data.error);
      return {};
    }

    return data;
  } catch (error) {
    console.error('Failed to read all sheets:', error);
    return {};
  }
}

/**
 * Create new records in a sheet
 */
export async function createRecords<T>(sheetName: string, records: T[]): Promise<ApiResponse> {
  if (!isSyncEnabled()) {
    return { success: false, error: 'Sync disabled' };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'create',
        sheet: sheetName,
        records,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error(`Failed to create records in ${sheetName}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update existing records
 */
export async function updateRecords<T>(sheetName: string, records: T[]): Promise<ApiResponse> {
  if (!isSyncEnabled()) {
    return { success: false, error: 'Sync disabled' };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'update',
        sheet: sheetName,
        records,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error(`Failed to update records in ${sheetName}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Upsert (create or update) records
 */
export async function upsertRecords<T>(sheetName: string, records: T[]): Promise<ApiResponse> {
  if (!isSyncEnabled()) {
    return { success: false, error: 'Sync disabled' };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'upsert',
        sheet: sheetName,
        records,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error(`Failed to upsert records in ${sheetName}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete records
 */
export async function deleteRecords<T>(sheetName: string, records: T[]): Promise<ApiResponse> {
  if (!isSyncEnabled()) {
    return { success: false, error: 'Sync disabled' };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'delete',
        sheet: sheetName,
        records,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error(`Failed to delete records from ${sheetName}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Sync a single module to Google Sheets
 */
export async function syncModule<T>(sheetName: string, records: T[]): Promise<ApiResponse> {
  return upsertRecords(sheetName, records);
}

/**
 * Sync all data to Google Sheets
 */
export async function syncAllData(data: Record<string, any[]>): Promise<Record<string, ApiResponse>> {
  const results: Record<string, ApiResponse> = {};

  for (const [sheetName, records] of Object.entries(data)) {
    if (records && records.length > 0) {
      results[sheetName] = await syncModule(sheetName, records);
    }
  }

  return results;
}
