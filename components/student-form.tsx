"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentFormProps {
  onLog: (message: string, type: "info" | "success" | "error") => void;
}

export function StudentForm({ onLog }: StudentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", curso: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email || !formData.curso) {
      onLog("[CADASTRO] Preencha todos os campos", "error");
      return;
    }

    setIsSubmitting(true);
    onLog(`[CADASTRO] Cadastrando aluno: ${formData.nome}`, "info");
    
    // Simulacao - substitua pela chamada real ao backend
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    onLog(`[CADASTRO] Aluno "${formData.nome}" cadastrado com sucesso!`, "success");
    setIsSubmitting(false);
    setIsOpen(false);
    setFormData({ nome: "", email: "", curso: "" });
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="h-14 px-8 text-base gap-3"
      >
        <UserPlus className="h-5 w-5" />
        Cadastrar Aluno
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-secondary/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Cadastrar Novo Aluno</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome do aluno"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="curso">Curso</Label>
                <Input
                  id="curso"
                  placeholder="Curso do aluno"
                  value={formData.curso}
                  onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
