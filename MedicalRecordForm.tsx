import React, { useState, useEffect } from 'react';
import { MedicalRecord, FileData } from '../types';
import FileUpload from './FileUpload';

interface MedicalRecordFormProps {
  onSave: (record: MedicalRecord) => void;
  editingRecord?: MedicalRecord;
  patientId: string;
}

export default function MedicalRecordForm({ onSave, editingRecord, patientId }: MedicalRecordFormProps) {
  const [record, setRecord] = useState<MedicalRecord>({
    patientId,
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    prescription: '',
    notes: '',
    files: []
  });

  useEffect(() => {
    if (editingRecord) {
      setRecord(editingRecord);
    }
  }, [editingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record);
    setRecord({
      patientId,
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      prescription: '',
      notes: '',
      files: []
    });
  };

  const handleFilesChange = (files: FileData[]) => {
    setRecord({ ...record, files });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900">
        {editingRecord ? 'Edit Medical Record' : 'Add New Medical Record'}
      </h3>
      
      <div>
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
          Patient ID
        </label>
        <input
          type="text"
          id="patientId"
          value={record.patientId}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={record.date}
          onChange={(e) => setRecord({ ...record, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
          Diagnosis
        </label>
        <input
          type="text"
          id="diagnosis"
          value={record.diagnosis}
          onChange={(e) => setRecord({ ...record, diagnosis: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
          Prescription
        </label>
        <input
          type="text"
          id="prescription"
          value={record.prescription}
          onChange={(e) => setRecord({ ...record, prescription: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={record.notes}
          onChange={(e) => setRecord({ ...record, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medical Files
        </label>
        <FileUpload
          files={record.files}
          onFilesChange={handleFilesChange}
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {editingRecord ? 'Update Record' : 'Save Record'}
      </button>
    </form>
  );
}