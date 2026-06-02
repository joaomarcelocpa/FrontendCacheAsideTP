"use client";

import { Database } from "lucide-react";

export function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-balance">Sistema de Alunos</h1>
            <p className="text-sm text-muted-foreground">Performance Test - Cache vs SQL</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Backend: Aguardando conexão</span>
        </div>
      </div>
    </header>
  );
}
