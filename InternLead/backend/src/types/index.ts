export interface RegisterStudentDto {
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
  campaignSlug?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  location?: string;
  collegeName?: string;
  campaignType: string;
}

export interface UpdateStudentDto {
  fullName?: string;
  phone?: string;
  email?: string;
  collegeName?: string;
  course?: string;
  branch?: string;
  currentYear?: string;
  preferredMode?: string;
  message?: string;
  interests?: string[];
}

export interface AddNoteDto {
  note: string;
}

export interface UpdateStatusDto {
  status: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
