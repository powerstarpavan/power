import React, { useRef } from 'react';
import { Upload, X, FileType } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  readOnly?: boolean;
}

export default function FileUpload({ files, onFilesChange, readOnly }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: FileData[] = await Promise.all(
      selectedFiles.map(async (file) => {
        return new Promise<FileData>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              data: reader.result as string,
              type: file.type.includes('pdf') ? 'pdf' : 'image',
              mimeType: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    onFilesChange([...files, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter(file => file.id !== id));
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
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
            <Upload className="w-8 h-8 text-indigo-600" />
            <span className="mt-2 text-base leading-normal text-gray-600">Upload Files</span>
            <span className="mt-1 text-sm text-gray-500">Images and PDFs supported</span>
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </label>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {files.map((file) => (
            <div key={file.id} className="relative">
              {renderFilePreview(file)}
              {!readOnly && (
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <p className="mt-1 text-sm text-gray-500 truncate">{file.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {file.type.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}