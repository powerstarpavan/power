import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { MedicalRecord } from '../types';

interface DeleteConfirmModalProps {
  record: MedicalRecord;
  fileId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ record, fileId, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const file = record.files.find(f => f.id === fileId);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          Delete File
        </h3>
        
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete this file? This action cannot be undone.
        </p>
        
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">File Name:</span> {file?.name}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">File Type:</span> {file?.type.toUpperCase()}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">From Record:</span> {record.date}
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete File
          </button>
        </div>
      </div>
    </div>
  );
}