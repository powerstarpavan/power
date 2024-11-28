import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { User, LoginCredentials } from '../types';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => void;
  users: User[];
}

export default function LoginForm({ onLogin, users }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    password: '',
    patientId: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDoctor = credentials.password === 'medicalstaff123';
    const isPatient = credentials.password === 'medicalstaff123' && 
                     credentials.patientId === 'PATIENT001';
    
    if (isDoctor || isPatient) {
      onLogin(credentials);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Secure Medical Records
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Access Password
            </label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter access password"
            />
          </div>

          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID
            </label>
            <input
              type="text"
              id="patientId"
              value={credentials.patientId}
              onChange={(e) => setCredentials({ ...credentials, patientId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter patient ID (if patient)"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Access Records
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Access is restricted to authorized personnel only.</p>
          <p className="mt-2">All data is end-to-end encrypted.</p>
        </div>
      </div>
    </div>
  );
}