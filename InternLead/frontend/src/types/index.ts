export interface Student {
  id: string;
  registrationId: string;
  fullName: string;
  phone: string;
  email?: string;
  collegeName: string;
  course: string;
  branch: string;
  currentYear: string;
  preferredMode: string;
  message?: string;
  leadStatus: string;
  campaignId?: string;
  createdAt: string;
  updatedAt: string;
  interests: StudentInterest[];
  campaign?: Campaign;
  notes?: LeadNote[];
  statusHistory?: LeadStatusHistory[];
}

export interface StudentInterest {
  id: string;
  interest: Interest;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description?: string;
  location?: string;
  collegeName?: string;
  campaignType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    students: number;
  };
  qrCodes?: QRCode[];
}

export interface QRCode {
  id: string;
  campaignId: string;
  uniqueCode: string;
  registrationUrl: string;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  studentId: string;
  note: string;
  createdAt: string;
  admin: {
    name: string;
    email: string;
  };
}

export interface LeadStatusHistory {
  id: string;
  studentId: string;
  oldStatus?: string;
  newStatus: string;
  createdAt: string;
  admin: {
    name: string;
  };
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  new: number;
  contacted: number;
  interested: number;
  enrolled: number;
  rejected: number;
  followUp: number;
  todayRegistrations: number;
  weekRegistrations: number;
  monthRegistrations: number;
}

export interface RegistrationFormData {
  fullName: string;
  phone: string;
  email?: string;
  collegeName: string;
  course: string;
  branch: string;
  currentYear: string;
  preferredMode: string;
  message?: string;
  interests: string[];
  consent: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CampaignFormData {
  name: string;
  description?: string;
  location?: string;
  collegeName?: string;
  campaignType: string;
}
