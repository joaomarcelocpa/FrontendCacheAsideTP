import { API_URL } from './api';
import {Student} from "@/shared/students.interface";

export interface StudentCacheResponse {
  data: Student[];
  meta: {
    source: 'cache_hit' | 'cache_miss';
    duration_ms: number;
    total: number;
  };
}

async function getStudents<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}

export async function listStudentsCached(): Promise<StudentCacheResponse> {
  return getStudents<StudentCacheResponse>('/students/cached');
}

export async function viewStudentCached(identifier: string): Promise<Student> {
  return getStudents<Student>(`/students/cached/${identifier}`);
}