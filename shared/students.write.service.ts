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

export async function createStudent(data: StudentCreateDto): Promise<void> {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }
}