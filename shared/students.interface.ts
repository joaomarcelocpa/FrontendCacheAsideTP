export interface Student {
  identifier: string;
  name: string;
  registration: string;
  age: number;
  address: string;
  course: string;
  period: number;
  fatherName?: string | null;
  motherName?: string | null;
  phone?: string | null;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
