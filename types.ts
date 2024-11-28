export interface MedicalRecord {
  patientId: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  files: FileData[];
}

export interface FileData {
  id: string;
  name: string;
  data: string; // Base64 encoded file data
  type: string;
  mimeType: string;
}

export interface EncryptedData {
  iv: string;
  data: string;
}

export interface User {
  role: 'doctor' | 'patient';
  password: string;
  patientId?: string;
}

export interface LoginCredentials {
  password: string;
  patientId: string;
}