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

async function parseExcelFile(file: File): Promise<string[][]> {
  if (typeof DecompressionStream === 'undefined') throw new Error('เบราว์เซอร์นี้ไม่รองรับ Excel กรุณาบันทึกเป็น CSV แล้วนำเข้าใหม่');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder('utf-8');
  const entries = new Map<string, Uint8Array>();
  const u16 = (i: number) => view.getUint16(i, true);
  const u32 = (i: number) => view.getUint32(i, true);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (u32(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('ไฟล์ Excel ไม่ใช่ .xlsx ที่ถูกต้อง');
  let offset = u32(eocd + 16);
  const count = u16(eocd + 10);
  for (let n = 0; n < count; n++) {
    if (u32(offset) !== 0x02014b50) break;
    const method = u16(offset + 10), size = u32(offset + 20);
    const nl = u16(offset + 28), el = u16(offset + 30), cl = u16(offset + 32), local = u32(offset + 42);
    const name = decoder.decode(bytes.slice(offset + 46, offset + 46 + nl));
    const dataStart = local + 30 + u16(local + 26) + u16(local + 28);
    const compressed = bytes.slice(dataStart, dataStart + size);
    if (method === 0) entries.set(name, compressed);
    else if (method === 8) {
      const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw' as CompressionFormat));
      entries.set(name, new Uint8Array(await new Response(stream).arrayBuffer()));
    }
    offset += 46 + nl + el + cl;
  }
  const getXml = (name: string) => entries.has(name) ? decoder.decode(entries.get(name)) : '';
  const parser = new DOMParser();
  const stringsXml = getXml('xl/sharedStrings.xml');
  const strings = stringsXml ? Array.from(parser.parseFromString(stringsXml, 'application/xml').getElementsByTagName('si')).map(si =>
    Array.from(si.getElementsByTagName('t')).map(t => t.textContent || '').join('')
  ) : [];
  const sheetName = [...entries.keys()].filter(name => /^xl\/worksheets\/sheet\d+\.xml$/.test(name)).sort()[0];
  if (!sheetName) throw new Error('ไม่พบ worksheet ในไฟล์ Excel');
  const doc = parser.parseFromString(getXml(sheetName), 'application/xml');
  const rows: string[][] = [];
  const columnIndex = (ref: string) => [...((ref.match(/^[A-Z]+/) || ['A'])[0])].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
  Array.from(doc.getElementsByTagName('row')).forEach(rowNode => {
    const row: string[] = [];
    Array.from(rowNode.children).filter(cell => cell.tagName === 'c').forEach(cell => {
      const index = columnIndex(cell.getAttribute('r') || 'A1');
      const type = cell.getAttribute('t') || '';
      const v = cell.getElementsByTagName('v')[0];
      let value = v?.textContent || '';
      if (type === 's') value = strings[Number(value)] || '';
      if (type === 'inlineStr') value = Array.from(cell.getElementsByTagName('t')).map(t => t.textContent || '').join('');
      while (row.length <= index) row.push('');
      row[index] = value;
    });
    if (row.some(value => value !== '')) rows.push(row);
  });
  return rows;
}

function parseDelimitedFile(input: string): string[][] {
  const parse = (delimiter: string): string[][] => {
    const records: string[][] = [];
    let row: string[] = [], cell = '', quoted = false;
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (ch === '"') {
        if (quoted && input[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted;
      } else if (ch === delimiter && !quoted) { row.push(cell.trim()); cell = ''; }
      else if ((ch === '\\n' || ch === '\\r') && !quoted) {
        if (ch === '\\r' && input[i + 1] === '\\n') i++;
        row.push(cell.trim()); if (row.some(v => v !== '')) records.push(row);
        row = []; cell = '';
      } else cell += ch;
    }
    row.push(cell.trim()); if (row.some(v => v !== '')) records.push(row);
    return records;
  };
  return [',', '\\t', ';'].map(delimiter => {
    const rows = parse(delimiter);
    const widths = rows.slice(0, 20).map(row => row.filter(v => v !== '').length);
    return { rows, score: widths.length ? Math.max(...widths) + (new Set(widths).size === 1 ? 2 : 0) : 0 };
  }).sort((a, b) => b.score - a.score)[0]?.rows || [];
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  moduleName: string;
  expectedColumns: string[];
  onImport: (rows: Record<string, string>[], fileName?: string) => { new: number; updated: number; skipped: number; rejected: number; errors: string[] };
}

export function ImportModal({ isOpen, onClose, title, expectedColumns, onImport }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [result, setResult] = useState<{ new: number; updated: number; skipped: number; rejected: number; errors: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const records = /\.xlsx?$/i.test(file.name)
        ? await parseExcelFile(file)
        : parseDelimitedFile((await file.text()).replace(/^\uFEFF/, ''));
      if (records.length < 2) throw new Error('ไม่พบหัวตารางและข้อมูลอย่างน้อย 1 แถว');
      const normalize = (value: string) => value.toLowerCase().replace(/^\uFEFF/, '').replace(/[^a-z0-9ก-๙]+/g, '');
      const expected = expectedColumns.map(normalize);
      let headerIndex = 0, bestScore = -Infinity;
      for (let i = 0; i < Math.min(records.length - 1, 40); i++) {
        const cells = records[i].map(v => v.trim()), populated = cells.filter(Boolean);
        if (populated.length < 2) continue;
        const uniqueRatio = new Set(populated.map(normalize)).size / populated.length;
        const matches = populated.reduce((sum, value) => {
          const key = normalize(value);
          return sum + (expected.some(item => item && (key === item || key.includes(item) || item.includes(key))) ? 1 : 0);
        }, 0);
        const score = populated.length * 2 + uniqueRatio * 3 + matches * 5 - (cells.length - populated.length);
        if (score > bestScore) { bestScore = score; headerIndex = i; }
      }
      const headers = records[headerIndex].map((h, i) => (h || `column_${i + 1}`).replace(/^\uFEFF/, '').trim());
      const rows = records.slice(headerIndex + 1).map(values => {
        const row: Record<string, string> = {};
        headers.forEach((header, i) => { row[header] = (values[i] || '').trim(); });
        return row;
      }).filter(row => Object.values(row).some(value => value !== ''));
      if (!rows.length) throw new Error('พบหัวตาราง แต่ไม่พบแถวข้อมูล');
      setParsedData(rows);
      setStep('preview');
    } catch (error) {
      console.error('File import parsing failed:', error);
      window.alert(`อ่านไฟล์ไม่สำเร็จ: ${error instanceof Error ? error.message : 'รูปแบบไฟล์ไม่ถูกต้อง'}`);
      setFileName('');
    } finally {
      e.target.value = '';
    }
  };

  const handleImport = () => {
    const res = onImport(parsedData, fileName);
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
                <p className="text-gray-600 mb-2">Drop CSV or Excel file here or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">Supported: CSV / TSV / Excel (.xlsx); detects report header rows automatically</p>
                <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,.xlsx" onChange={handleFile} className="hidden" />
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
