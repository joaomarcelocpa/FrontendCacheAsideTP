"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserPen, KeyRound, UserMinus, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createStudent,
  updateStudent,
  updateStudentPassword,
  deleteStudent,
} from "@/shared/students.write.service";
import { listStudents } from "@/shared/students.read.service";
import { invalidateStudentsListCache } from "@/shared/students.cache.service";
import type { Student } from "@/shared/students.interface";

type ActiveModal = null | "create" | "update" | "password" | "delete";

interface StudentFormProps {
  onLog: (message: string, type: "info" | "success" | "error") => void;
}

const emptyCreate = {
  name: "", age: "", address: "", course: "", period: "",
  fatherName: "", motherName: "", phone: "", email: "", password: "",
};

const emptyUpdate = {
  name: "", age: "", address: "", course: "", period: "",
  fatherName: "", motherName: "", phone: "", email: "",
};

export function StudentForm({ onLog }: StudentFormProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student picker state (used by update/password/delete)
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Create form
  const [createData, setCreateData] = useState(emptyCreate);

  // Update form
  const [updateData, setUpdateData] = useState(emptyUpdate);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const needsPicker = activeModal === "update" || activeModal === "password" || activeModal === "delete";
  const showPicker = needsPicker && !selectedStudent;
  const showForm = needsPicker && !!selectedStudent;

  useEffect(() => {
    if (showPicker) {
      setLoadingStudents(true);
      listStudents()
        .then((res) => setStudents(res.data))
        .catch(() => onLog("[ALUNOS] Erro ao carregar lista de alunos", "error"))
        .finally(() => setLoadingStudents(false));
    }
  }, [showPicker]);

  useEffect(() => {
    if (selectedStudent && activeModal === "update") {
      setUpdateData({
        name: selectedStudent.name,
        age: String(selectedStudent.age),
        address: selectedStudent.address,
        course: selectedStudent.course,
        period: String(selectedStudent.period),
        fatherName: selectedStudent.fatherName ?? "",
        motherName: selectedStudent.motherName ?? "",
        phone: selectedStudent.phone ?? "",
        email: selectedStudent.email,
      });
    }
  }, [selectedStudent, activeModal]);

  const handleClose = () => {
    setActiveModal(null);
    setSelectedStudent(null);
    setSearchQuery("");
    setStudents([]);
    setCreateData(emptyCreate);
    setUpdateData(emptyUpdate);
    setCurrentPassword("");
    setNewPassword("");
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.registration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---

  const invalidateCache = async () => {
    try {
      await invalidateStudentsListCache();
      onLog("[CACHE] Cache da lista de alunos invalidado", "info");
    } catch (e) {
      onLog(`[CACHE] Erro ao invalidar cache: ${e instanceof Error ? e.message : "Erro desconhecido"}`, "error");
    }
  };

  const handleCreate = async () => {
    const { name, age, address, course, period, email, password } = createData;
    if (!name || !age || !address || !course || !period || !email || !password) {
      onLog("[CADASTRO] Preencha todos os campos obrigatórios", "error");
      return;
    }
    setIsSubmitting(true);
    onLog(`[CADASTRO] Cadastrando aluno: ${name}`, "info");
    try {
      await createStudent({
        name, age: Number(age), address, course, period: Number(period),
        fatherName: createData.fatherName || undefined,
        motherName: createData.motherName || undefined,
        phone: createData.phone || undefined,
        email, password,
      });
      onLog(`[CADASTRO] Aluno "${name}" cadastrado com sucesso!`, "success");
      await invalidateCache();
      handleClose();
    } catch (e) {
      onLog(`[CADASTRO] Erro: ${e instanceof Error ? e.message : "Erro desconhecido"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    onLog(`[ATUALIZAR] Atualizando aluno: ${selectedStudent.name}`, "info");
    try {
      await updateStudent(selectedStudent.identifier, {
        name: updateData.name || undefined,
        age: updateData.age ? Number(updateData.age) : undefined,
        address: updateData.address || undefined,
        course: updateData.course || undefined,
        period: updateData.period ? Number(updateData.period) : undefined,
        fatherName: updateData.fatherName || undefined,
        motherName: updateData.motherName || undefined,
        phone: updateData.phone || undefined,
        email: updateData.email || undefined,
      });
      onLog(`[ATUALIZAR] Aluno "${selectedStudent.name}" atualizado com sucesso!`, "success");
      await invalidateCache();
      handleClose();
    } catch (e) {
      onLog(`[ATUALIZAR] Erro: ${e instanceof Error ? e.message : "Erro desconhecido"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePassword = async () => {
    if (!selectedStudent || !currentPassword || !newPassword) {
      onLog("[SENHA] Informe a senha atual e a nova senha", "error");
      return;
    }
    setIsSubmitting(true);
    onLog(`[SENHA] Alterando senha de: ${selectedStudent.name}`, "info");
    try {
      await updateStudentPassword(selectedStudent.identifier, { currentPassword, newPassword });
      onLog(`[SENHA] Senha de "${selectedStudent.name}" alterada com sucesso!`, "success");
      await invalidateCache();
      handleClose();
    } catch (e) {
      onLog(`[SENHA] Erro: ${e instanceof Error ? e.message : "Erro desconhecido"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    onLog(`[DELETAR] Deletando aluno: ${selectedStudent.name}`, "info");
    try {
      await deleteStudent(selectedStudent.identifier);
      onLog(`[DELETAR] Aluno "${selectedStudent.name}" deletado com sucesso!`, "success");
      await invalidateCache();
      handleClose();
    } catch (e) {
      onLog(`[DELETAR] Erro: ${e instanceof Error ? e.message : "Erro desconhecido"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitles: Record<string, string> = {
    create: "Cadastrar Novo Aluno",
    update: selectedStudent ? `Atualizar: ${selectedStudent.name}` : "Selecionar Aluno para Atualizar",
    password: selectedStudent ? `Mudar Senha: ${selectedStudent.name}` : "Selecionar Aluno para Mudar Senha",
    delete: selectedStudent ? `Deletar: ${selectedStudent.name}` : "Selecionar Aluno para Deletar",
  };

  return (
    <>
      {/* Buttons row */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setActiveModal("create")} className="h-14 px-6 text-base gap-2">
          <UserPlus className="h-5 w-5" />
          Cadastrar Aluno
        </Button>
        <Button onClick={() => setActiveModal("update")} className="h-14 px-6 text-base gap-2 bg-green-600 hover:bg-green-700 text-white">
          <UserPen className="h-5 w-5" />
          Atualizar Aluno
        </Button>
        <Button onClick={() => setActiveModal("password")} className="h-14 px-6 text-base gap-2 bg-yellow-500 hover:bg-yellow-600 text-white">
          <KeyRound className="h-5 w-5" />
          Mudar Senha
        </Button>
        <Button onClick={() => setActiveModal("delete")} variant="destructive" className="h-14 px-6 text-base gap-2">
          <UserMinus className="h-5 w-5" />
          Deletar Aluno
        </Button>
      </div>

      {/* Modal overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-secondary/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>{modalTitles[activeModal]}</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* ── STUDENT PICKER (shared for update/password/delete) ── */}
              {showPicker && (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, email ou matrícula..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {loadingStudents ? (
                    <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Carregando alunos...
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">Nenhum aluno encontrado.</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {filteredStudents.map((student) => (
                        <button
                          key={student.identifier}
                          onClick={() => setSelectedStudent(student)}
                          className="w-full text-left rounded-lg border p-3 hover:bg-accent transition-colors"
                        >
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.email} · Matrícula: {student.registration} · {student.course} — {student.period}º período
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── CREATE FORM ── */}
              {activeModal === "create" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input placeholder="Nome completo" value={createData.name} onChange={(e) => setCreateData((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Idade *</Label>
                      <Input type="number" placeholder="Idade" value={createData.age} onChange={(e) => setCreateData((p) => ({ ...p, age: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço *</Label>
                    <Input placeholder="Endereço completo" value={createData.address} onChange={(e) => setCreateData((p) => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Curso *</Label>
                      <Input placeholder="Curso" value={createData.course} onChange={(e) => setCreateData((p) => ({ ...p, course: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Período *</Label>
                      <Input type="number" placeholder="Período" value={createData.period} onChange={(e) => setCreateData((p) => ({ ...p, period: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" placeholder="email@exemplo.com" value={createData.email} onChange={(e) => setCreateData((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha *</Label>
                    <Input type="password" placeholder="Senha" value={createData.password} onChange={(e) => setCreateData((p) => ({ ...p, password: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Pai</Label>
                      <Input placeholder="Opcional" value={createData.fatherName} onChange={(e) => setCreateData((p) => ({ ...p, fatherName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nome da Mãe</Label>
                      <Input placeholder="Opcional" value={createData.motherName} onChange={(e) => setCreateData((p) => ({ ...p, motherName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input placeholder="(00) 00000-0000" value={createData.phone} onChange={(e) => setCreateData((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleCreate} disabled={isSubmitting}>
                    {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </>
              )}

              {/* ── UPDATE FORM ── */}
              {activeModal === "update" && showForm && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input value={updateData.name} onChange={(e) => setUpdateData((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Idade</Label>
                      <Input type="number" value={updateData.age} onChange={(e) => setUpdateData((p) => ({ ...p, age: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input value={updateData.address} onChange={(e) => setUpdateData((p) => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Curso</Label>
                      <Input value={updateData.course} onChange={(e) => setUpdateData((p) => ({ ...p, course: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Período</Label>
                      <Input type="number" value={updateData.period} onChange={(e) => setUpdateData((p) => ({ ...p, period: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={updateData.email} onChange={(e) => setUpdateData((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Pai</Label>
                      <Input value={updateData.fatherName} onChange={(e) => setUpdateData((p) => ({ ...p, fatherName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nome da Mãe</Label>
                      <Input value={updateData.motherName} onChange={(e) => setUpdateData((p) => ({ ...p, motherName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={updateData.phone} onChange={(e) => setUpdateData((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedStudent(null)}>
                      Voltar
                    </Button>
                    <Button className="flex-1" onClick={handleUpdate} disabled={isSubmitting}>
                      {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </>
              )}

              {/* ── PASSWORD FORM ── */}
              {activeModal === "password" && showForm && (
                <>
                  <div className="space-y-2">
                    <Label>Senha Atual *</Label>
                    <Input
                      type="password"
                      placeholder="Digite a senha atual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nova Senha *</Label>
                    <Input
                      type="password"
                      placeholder="Digite a nova senha (mín. 6 caracteres)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedStudent(null)}>
                      Voltar
                    </Button>
                    <Button className="flex-1" onClick={handlePassword} disabled={isSubmitting}>
                      {isSubmitting ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </div>
                </>
              )}

              {/* ── DELETE CONFIRMATION ── */}
              {activeModal === "delete" && showForm && selectedStudent && (
                <>
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 space-y-1">
                    <p className="font-medium text-destructive">Atenção: esta ação é irreversível.</p>
                    <p className="text-sm text-muted-foreground">
                      O aluno <strong>{selectedStudent.name}</strong> (matrícula: {selectedStudent.registration}) será permanentemente deletado.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedStudent(null)}>
                      Voltar
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={isSubmitting}>
                      {isSubmitting ? "Deletando..." : "Confirmar Deleção"}
                    </Button>
                  </div>
                </>
              )}

            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
