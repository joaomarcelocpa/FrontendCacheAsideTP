import { API_URL } from './api';
import {Student} from "@/shared/students.interface";



export interface StudentListResponse {
  data: Student[];
  meta: {
    source: 'sql';
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

export async function listStudents(): Promise<StudentListResponse> {
  return getStudents<StudentListResponse>('/students');
}

export async function viewStudent(identifier: string): Promise<Student> {
  return getStudents<Student>(`/students/${identifier}`);
}