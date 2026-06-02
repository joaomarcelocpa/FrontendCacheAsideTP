import { API_URL } from './api';

export interface StudentCreateDto {
  name: string;
  age: number;
  address: string;
  course: string;
  period: number;
  fatherName?: string;
  motherName?: string;
  phone?: string;
  email: string;
  password: string;
}

export interface StudentUpdateDto {
  name?: string;
  age?: number;
  address?: string;
  course?: string;
  period?: number;
  fatherName?: string;
  motherName?: string;
  phone?: string;
  email?: string;
}

export interface StudentUpdatePasswordDto {
  password: string;
}

async function sendRequest(url: string, method: string, data?: unknown): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }
}

export async function createStudent(data: StudentCreateDto): Promise<void> {
  return sendRequest(`${API_URL}/students`, 'POST', data);
}

export async function updateStudent(identifier: string, data: StudentUpdateDto): Promise<void> {
  return sendRequest(`${API_URL}/students/${identifier}`, 'PUT', data);
}

export async function updateStudentPassword(identifier: string, data: StudentUpdatePasswordDto): Promise<void> {
  return sendRequest(`${API_URL}/students/${identifier}/password`, 'PATCH', data);
}

export async function deleteStudent(identifier: string): Promise<void> {
  return sendRequest(`${API_URL}/students/${identifier}`, 'DELETE');
}