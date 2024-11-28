import React, { useState } from 'react';
import { MedicalRecord } from '../types';
import { Download, FileType, Trash2 } from 'lucide-react';

interface RecordsListProps {
  records: MedicalRecord[];
  isDoctor: boolean;
  onEdit?: (record: MedicalRecord, index: number) => void;
  onDeleteFile?: (data: { record: MedicalRecord, fileId: string }) => void;
}

export default function RecordsList({ records, isDoctor, onEdit, onDeleteFile }: RecordsListProps) {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const toggleExpand = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const handleDownload = (fileData: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFilePreview = (file: FileData) => {
    if (file.type === 'image') {
      return (
        <img
          src={file.data}
          alt={file.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      );
    }
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
        <FileType className="w-16 h-16 text-gray-400" />
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Medical Records</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {records?.map((record, index) => {
            const recordId = `${record.patientId}-${record.date}`;
            const isExpanded = expandedRecord === recordId;

            return (
              <li key={index} className="px-4 py-5 sm:px-6">
                <div 
                  className="cursor-pointer"
                  onClick={() => toggleExpand(recordId)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-indigo-600">{record.date}</h4>
                    {isDoctor && onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(record, index);
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Patient ID:</span> {record.patientId}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="font-medium">Prescription:</span> {record.prescription}
                    </p>
                    {record.notes && (
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </p>
                    )}
                    {record.files?.length > 0 && (
                      <p className="mt-1 text-sm text-indigo-600">
                        {record.files.length} {record.files.length === 1 ? 'file' : 'files'} attached
                      </p>
                    )}
                  </div>
                </div>

                {isExpanded && record.files?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Attached Files</h5>
                    <div className="grid grid-cols-2 gap-4">
                      {record.files.map((file) => (
                        <div key={file.id} className="relative">
                          {renderFilePreview(file)}
                          <div className="absolute bottom-2 right-2 flex space-x-2">
                            <button
                              onClick={() => handleDownload(file.data, file.name)}
                              className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
                              title="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {isDoctor && onDeleteFile && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteFile({ record, fileId: file.id });
                                }}
                                className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                                title="Delete file"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {file.type.toUpperCase()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          {!records?.length && (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No medical records found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}