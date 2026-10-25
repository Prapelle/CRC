import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid username. Try: admin, wichai, somsri, or marketing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
            <span className="text-white font-bold text-xl">CRC</span>
          </div>
          <h1 className="text-2xl font-bold text-white">CRC Steel Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Marketing & Sales Data Hub</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Any password for demo"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { user: 'admin', role: 'Admin' },
                { user: 'wichai', role: 'Sales' },
                { user: 'somsri', role: 'Sales' },
                { user: 'marketing', role: 'Marketing' },
              ].map(acc => (
                <button
                  key={acc.user}
                  onClick={() => { setUsername(acc.user); setPassword('demo'); }}
                  className="text-xs text-left bg-gray-50 hover:bg-gray-100 px-2 py-1.5 rounded border border-gray-200"
                >
                  <span className="font-medium text-gray-700">{acc.user}</span>
                  <span className="text-gray-400 ml-1">({acc.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          ⚠️ This is a demo system with sample data. Not connected to real business data.
        </p>
      </div>
    </div>
  );
}
