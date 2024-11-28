import React, { useState, useEffect } from 'react';
import { FileKey, AlertTriangle } from 'lucide-react';
import { MedicalRecord, LoginCredentials, FileData } from './types';
import { getKeyFromPassword, encryptData, decryptData } from './utils/crypto';
import LoginForm from './components/LoginForm';
import MedicalRecordForm from './components/MedicalRecordForm';
import RecordsList from './components/RecordsList';
import Toast from './components/Toast';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const USERS = [
  { role: 'doctor', password: 'medicalstaff123' },
  { role: 'patient', password: 'medicalstaff123', patientId: 'PATIENT001' }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [currentKey, setCurrentKey] = useState<CryptoKey | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string>('');
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | undefined>();
  const [fileToDelete, setFileToDelete] = useState<{record: MedicalRecord, fileId: string} | undefined>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadEncryptedData = async () => {
      if (!currentKey) return;

      try {
        const encryptedData = localStorage.getItem('medicalRecords');
        if (!encryptedData) {
          const emptyRecords: MedicalRecord[] = [];
          const encrypted = await encryptData(JSON.stringify(emptyRecords), currentKey);
          localStorage.setItem('medicalRecords', JSON.stringify(encrypted));
          setRecords([]);
          return;
        }

        const decrypted = await decryptData(JSON.parse(encryptedData), currentKey);
        const allRecords: MedicalRecord[] = JSON.parse(decrypted);
        const filteredRecords = isDoctor 
          ? allRecords 
          : allRecords.filter(record => record.patientId === currentPatientId);
        setRecords(filteredRecords);
      } catch (error) {
        setError('Unable to load medical records. Please try logging in again.');
        setIsAuthenticated(false);
        setCurrentKey(null);
      }
    };

    if (currentKey) {
      loadEncryptedData();
    }
  }, [currentKey, currentPatientId, isDoctor]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const key = await getKeyFromPassword(credentials.password);
      const isDoctor = credentials.password === 'medicalstaff123' && !credentials.patientId;
      
      setCurrentKey(key);
      setIsDoctor(isDoctor);
      setCurrentPatientId(credentials.patientId);
      setIsAuthenticated(true);
      setError('');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentKey(null);
    setRecords([]);
    setIsDoctor(false);
    setCurrentPatientId('');
    setEditingRecord(undefined);
    setFileToDelete(undefined);
    setError('');
  };

  const handleSaveRecord = async (newRecord: MedicalRecord) => {
    if (!currentKey) {
      setError('Session expired. Please log in again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const encryptedData = localStorage.getItem('medicalRecords');
      let allRecords: MedicalRecord[] = [];
      
      if (encryptedData) {
        const decrypted = await decryptData(JSON.parse(encryptedData), currentKey);
        allRecords = JSON.parse(decrypted);
      }

      const updatedRecords = editingRecord
        ? allRecords.map(record => 
            record.patientId === editingRecord.patientId && 
            record.date === editingRecord.date ? newRecord : record
          )
        : [...allRecords, newRecord];

      const encryptedNewData = await encryptData(
        JSON.stringify(updatedRecords),
        currentKey
      );
      
      localStorage.setItem('medicalRecords', JSON.stringify(encryptedNewData));
      
      const displayRecords = isDoctor 
        ? updatedRecords 
        : updatedRecords.filter(record => record.patientId === currentPatientId);
      setRecords(displayRecords);
      setEditingRecord(undefined);
    } catch (error) {
      setError('Failed to save record. Please try again.');
    }
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setEditingRecord(record);
  };

  const handleDeleteFile = async () => {
    if (!currentKey || !fileToDelete) return;

    try {
      const encryptedData = localStorage.getItem('medicalRecords');
      if (!encryptedData) return;

      const decrypted = await decryptData(JSON.parse(encryptedData), currentKey);
      const allRecords: MedicalRecord[] = JSON.parse(decrypted);

      const updatedRecords = allRecords.map(record => {
        if (record.patientId === fileToDelete.record.patientId && 
            record.date === fileToDelete.record.date) {
          return {
            ...record,
            files: record.files.filter(file => file.id !== fileToDelete.fileId)
          };
        }
        return record;
      });

      const encryptedNewData = await encryptData(
        JSON.stringify(updatedRecords),
        currentKey
      );
      
      localStorage.setItem('medicalRecords', JSON.stringify(encryptedNewData));
      setRecords(isDoctor ? updatedRecords : updatedRecords.filter(r => r.patientId === currentPatientId));
      setFileToDelete(undefined);
    } catch (error) {
      setError('Failed to delete file. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm onLogin={handleLogin} users={USERS} />
        {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FileKey className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Secure Medical Records
              </span>
              <span className="ml-4 px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-full">
                {isDoctor ? 'Doctor Access' : 'Patient Access'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {isDoctor && (
              <div>
                <MedicalRecordForm 
                  onSave={handleSaveRecord}
                  editingRecord={editingRecord}
                  patientId={currentPatientId || 'PATIENT001'}
                />
              </div>
            )}
            <div className={isDoctor ? '' : 'md:col-span-2'}>
              <RecordsList 
                records={records}
                isDoctor={isDoctor}
                onEdit={isDoctor ? handleEditRecord : undefined}
                onDeleteFile={isDoctor ? setFileToDelete : undefined}
              />
            </div>
          </div>
        </div>
      </main>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {fileToDelete && (
        <DeleteConfirmModal
          record={fileToDelete.record}
          fileId={fileToDelete.fileId}
          onConfirm={handleDeleteFile}
          onCancel={() => setFileToDelete(undefined)}
        />
      )}
    </div>
  );
}

export default App;