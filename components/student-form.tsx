"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createStudent } from "@/shared/students.write.service";

interface StudentFormProps {
  onLog: (message: string, type: "info" | "success" | "error") => void;
}

export function StudentForm({ onLog }: StudentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    course: "",
    period: "",
    fatherName: "",
    motherName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.address || !formData.course || !formData.period || !formData.email || !formData.password) {
      onLog("[CADASTRO] Preencha todos os campos obrigatórios", "error");
      return;
    }

    setIsSubmitting(true);
    onLog(`[CADASTRO] Cadastrando aluno: ${formData.name}`, "info");

    try {
      await createStudent({
        name: formData.name,
        age: Number(formData.age),
        address: formData.address,
        course: formData.course,
        period: Number(formData.period),
        fatherName: formData.fatherName || undefined,
        motherName: formData.motherName || undefined,
        phone: formData.phone || undefined,
        email: formData.email,
        password: formData.password,
      });
      onLog(`[CADASTRO] Aluno "${formData.name}" cadastrado com sucesso!`, "success");
      handleClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao cadastrar aluno";
      onLog(`[CADASTRO] Erro: ${message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ name: "", age: "", address: "", course: "", period: "", fatherName: "", motherName: "", phone: "", email: "", password: "" });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="h-14 px-8 text-base gap-3">
        <UserPlus className="h-5 w-5" />
        Cadastrar Aluno
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-secondary/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Cadastrar Novo Aluno</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input id="name" placeholder="Nome completo" value={formData.name} onChange={handleChange("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade *</Label>
                  <Input id="age" type="number" placeholder="Idade" value={formData.age} onChange={handleChange("age")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input id="address" placeholder="Endereço completo" value={formData.address} onChange={handleChange("address")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Curso *</Label>
                  <Input id="course" placeholder="Curso" value={formData.course} onChange={handleChange("course")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Período *</Label>
                  <Input id="period" type="number" placeholder="Período" value={formData.period} onChange={handleChange("period")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleChange("email")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input id="password" type="password" placeholder="Senha" value={formData.password} onChange={handleChange("password")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Nome do Pai</Label>
                  <Input id="fatherName" placeholder="Opcional" value={formData.fatherName} onChange={handleChange("fatherName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Nome da Mãe</Label>
                  <Input id="motherName" placeholder="Opcional" value={formData.motherName} onChange={handleChange("motherName")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleChange("phone")} />
              </div>

              <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}