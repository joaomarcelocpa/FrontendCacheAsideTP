"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { StudentForm } from "@/components/student-form";
import { PerformanceTest } from "@/components/performance-test";
import type { TestResult } from "@/components/performance-test";
import { MetricsPanel } from "@/components/metrics-panel";
import { LogsPanel, LogEntry } from "@/components/logs-panel";

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);

  const addLog = useCallback((message: string, type: "info" | "success" | "error") => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit" 
    });
    
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp: `[${timestamp}]`,
        message,
        type,
      },
    ]);
  }, []);

  const addResult = useCallback((result: TestResult) => {
    setResults((prev) => [...prev, result]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Testes de Performance */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Testes de Performance</h2>
          <PerformanceTest onLog={addLog} onResult={addResult} />
        </section>

        {/* Metricas */}
        <section>
          <MetricsPanel results={results} />
        </section>

        {/* Cadastro de Aluno */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Alunos</h2>
          <StudentForm onLog={addLog} />
        </section>

        {/* Logs */}
        <section>
          <LogsPanel logs={logs} onClear={clearLogs} />
        </section>
      </main>
    </div>
  );
}
