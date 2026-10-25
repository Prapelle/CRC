import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

// ============ KPI CARD ============
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: string;
}

export function KPICard({ title, value, subtitle, icon, trend, color = 'bg-white' }: KPICardProps) {
  return (
    <div className={`${color} rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-400">vs prev</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STATUS BADGE ============
interface StatusBadgeProps {
  status: string;
  colorClass?: string;
}

export function StatusBadge({ status, colorClass }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

// ============ IMPORT MODAL ============
interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  moduleName: string;
  expectedColumns: string[];
  onImport: (rows: Record<string, string>[]) => { new: number; updated: number; skipped: number; rejected: number; errors: string[] };
}

export function ImportModal({ isOpen, onClose, title, expectedColumns, onImport }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [result, setResult] = useState<{ new: number; updated: number; skipped: number; rejected: number; errors: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) return;
      
      // Parse CSV with proper handling of quoted values
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
      
      // Debug: Log detected headers
      console.log('📋 Detected CSV Headers:', headers);
      console.log('📊 First row sample:', parseCSVLine(lines[1]));
      
      const rows = lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const row: Record<string, string> = {};
        headers.forEach((h, i) => { 
          const value = values[i] ? values[i].replace(/"/g, '').trim() : '';
          row[h] = value;
        });
        return row;
      });
      
      console.log('📝 Parsed rows:', rows.length);
      console.log('🔍 First row data:', rows[0]);
      
      setParsedData(rows);
      setStep('preview');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const res = onImport(parsedData);
    setResult(res);
    setStep('result');
  };

  const handleClose = () => {
    setStep('upload');
    setFileName('');
    setParsedData([]);
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs text-gray-500">Expected: {expectedColumns.slice(0, 5).join(', ')}...</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-orange-400 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">Drop CSV file here or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">Supported: CSV files with headers</p>
                <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600"
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm font-medium">{fileName}</span>
                <span className="text-xs text-gray-500">({parsedData.length} rows)</span>
              </div>
              
              {/* Show detected columns */}
              {parsedData.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-800 mb-2">📋 Detected Columns:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(parsedData[0]).map((col, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-blue-300 text-blue-700">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">#</th>
                      {Object.keys(parsedData[0] || {}).map(h => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="px-3 py-2 text-gray-700 max-w-[150px] truncate">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && <p className="text-xs text-gray-500 mt-2">Showing first 10 of {parsedData.length} rows</p>}
            </div>
          )}

          {step === 'result' && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="font-medium">Import completed</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{result.new}</p>
                  <p className="text-xs text-green-600">New</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{result.updated}</p>
                  <p className="text-xs text-blue-600">Updated</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-700">{result.skipped}</p>
                  <p className="text-xs text-yellow-600">Skipped (Duplicate)</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-700">{result.rejected}</p>
                  <p className="text-xs text-red-600">Rejected</p>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm font-medium text-red-700">Errors</span>
                  </div>
                  <ul className="text-xs text-red-600 space-y-1">
                    {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          {step === 'upload' && (
            <button onClick={handleClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          )}
          {step === 'preview' && (
            <>
              <button onClick={() => setStep('upload')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Back</button>
              <button onClick={handleImport} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
                Confirm Import
              </button>
            </>
          )}
          {step === 'result' && (
            <button onClick={handleClose} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============
export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      {icon || <FileText size={48} className="mb-3" />}
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ============ FILTER BAR ============
interface FilterBarProps {
  children: React.ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-white rounded-lg border border-gray-200">
      {children}
    </div>
  );
}

export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <option value="">All</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function FilterDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
}
