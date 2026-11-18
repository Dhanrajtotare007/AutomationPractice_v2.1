/**
 * Central API client.
 *
 * All requests go through `/api` (proxied to Express by Vite in development and
 * served by the same Express process in production). Errors are normalised into
 * `ApiError` so UI code can show consistent feedback.
 */
import type { ApiEnvelope, ApiErrorBody, ContactMessage, Employee } from '@shared/types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

export class ApiError extends Error {
  status: number;
  details?: string[];
  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Network error - is the API server running?', 0);
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const body = payload as ApiErrorBody | null;
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status, body?.details);
  }
  return payload as T;
}

export interface EmployeeQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface EmployeeListResult {
  items: Employee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type EmployeeInput = Omit<Employee, 'id'>;

function toQuery(query: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  health: () => request<{ status: string; uptime: number; version: string }>('/health'),

  employees: {
    list: (query: EmployeeQuery = {}) =>
      request<ApiEnvelope<EmployeeListResult>>(
        `/employees${toQuery({
          search: query.search,
          page: query.page,
          pageSize: query.pageSize,
          sortBy: query.sortBy,
          sortDir: query.sortDir,
        })}`,
      ),
    create: (input: EmployeeInput) =>
      request<ApiEnvelope<Employee>>('/employees', { method: 'POST', body: JSON.stringify(input) }),
    update: (id: number, input: EmployeeInput) =>
      request<ApiEnvelope<Employee>>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
    remove: (id: number) => request<ApiEnvelope<{ id: number }>>(`/employees/${id}`, { method: 'DELETE' }),
  },

  contact: {
    submit: (input: { name: string; email: string; subject: string; message: string }) =>
      request<ApiEnvelope<ContactMessage>>('/contact', { method: 'POST', body: JSON.stringify(input) }),
    list: () => request<ApiEnvelope<ContactMessage[]>>('/contact'),
  },

  progress: {
    load: () => request<ApiEnvelope<{ completed: string[]; updatedAt: string | null }>>('/progress'),
    save: (completed: string[]) =>
      request<ApiEnvelope<{ completed: string[]; updatedAt: string }>>('/progress', {
        method: 'PUT',
        body: JSON.stringify({ completed }),
      }),
  },
};
