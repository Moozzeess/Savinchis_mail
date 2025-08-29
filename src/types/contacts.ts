export interface Contact {
  id?: string;
  email: string;
  name?: string;
  [key: string]: any;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  contactCount: number;
  lastUpdated: string;
  tags?: string[];
}

export interface FileUploadState {
  file: File | null;
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export interface ContactSummary {
  total: number;
  validEmails: number;
  invalidEmails: number;
  duplicates: number;
  sampleEmails: string[];
}

export interface ColumnMapping {
  emailColumn: string;
  nameColumn: string;
}

export interface DatabaseConnection {
  serverType: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  query: string;
}
