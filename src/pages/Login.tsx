import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const success = await login(email, password);
      if (!success) setError(authError || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง');
    } catch {
      setError('ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่ภายหลัง');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
            <span className="text-white font-bold text-xl">CRC</span>
          </div>
          <h1 className="text-2xl font-bold text-white">CRC Steel Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Marketing &amp; Sales Data Hub</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">เข้าสู่ระบบด้วยอีเมลที่ได้รับคำเชิญจากผู้ดูแลระบบ</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="name@company.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Enter password" required />
            </div>
            {(error || authError) && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} /><span>{error || authError}</span>
              </div>
            )}
            <button type="submit" disabled={busy}
              className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-60">
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-400 text-xs mt-6">
          ระบบจัดเก็บข้อมูลส่วนกลางผ่าน Supabase — หากยังไม่มีบัญชี โปรดติดต่อผู้ดูแลระบบ
        </p>
      </div>
    </div>
  );
}
