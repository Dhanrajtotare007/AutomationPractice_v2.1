export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  status: 'Active' | 'On leave' | 'Inactive';
  joined: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ApiEnvelope<T> {
  data: T;
}

export interface ApiErrorBody {
  message: string;
  status: number;
  details?: string[];
}

export const DEPARTMENTS = [
  'Engineering',
  'Quality Assurance',
  'Product',
  'Design',
  'Marketing',
  'Support',
] as const;

export const EMPLOYEE_ROLES = [
  'SDET',
  'QA Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Product Manager',
  'UX Designer',
  'Support Specialist',
] as const;

export const STATUSES = ['Active', 'On leave', 'Inactive'] as const;

export const EMPLOYEE_LIMITS = {
  name: { min: 2, max: 60 },
  email: { max: 120 },
  salary: { min: 0, max: 1000000 },
  pageSize: { min: 1, max: 50, default: 5 },
} as const;
