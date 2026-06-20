"use client";

import { useState } from "react";
import { Zap, Database, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listStudents } from "@/shared/students.read.service";
import { listStudentsCached, invalidateStudentsListCache } from "@/shared/students.cache.service";
import {Student} from "@/shared/students.interface";

export interface TestResult {
  type: "cache" | "sql";
  source: "sql" | "cache_hit" | "cache_miss";
  duration_ms: number;
  count: number;
  students: Student[];
}

interface PerformanceTestProps {
  onLog: (message: string, type: "info" | "success" | "error") => void;
  onResult: (result: TestResult) => void;
}

const sourceLabel: Record<TestResult["source"], string> = {
  sql: "sql",
  cache_hit: "cache hit",
  cache_miss: "cache miss",
};

const sourceBadgeClass: Record<TestResult["source"], string> = {
  sql: "",
  cache_hit: "bg-green-500/20 text-green-600 border-green-500/30",
  cache_miss: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
};

export function PerformanceTest({ onLog, onResult }: PerformanceTestProps) {
  const [isTestingCache, setIsTestingCache] = useState(false);
  const [isTestingSql, setIsTestingSql] = useState(false);
  const [isInvalidating, setIsInvalidating] = useState(false);
  const [lastCache, setLastCache] = useState<TestResult | null>(null);
  const [lastSql, setLastSql] = useState<TestResult | null>(null);

  const runCacheTest = async () => {
    setIsTestingCache(true);
    onLog("[CACHE ASIDE] Iniciando teste...", "info");
    try {
      const { data, meta } = await listStudentsCached();
      const result: TestResult = { type: "cache", source: meta.source, duration_ms: meta.duration_ms, count: meta.total, students: data };
      setLastCache(result);
      onResult(result);
      onLog(`[CACHE ASIDE] ${meta.source} — ${meta.duration_ms}ms — ${data.length} alunos`, "success");
    } catch (error) {
      onLog(`[CACHE ASIDE] Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`, "error");
    } finally {
      setIsTestingCache(false);
    }
  };

  const runSqlTest = async () => {
    setIsTestingSql(true);
    onLog("[SQL DIRETO] Iniciando teste...", "info");
    try {
      const { data, meta } = await listStudents();
      const result: TestResult = { type: "sql", source: meta.source, duration_ms: meta.duration_ms, count: meta.total, students: data };
      setLastSql(result);
      onResult(result);
      onLog(`[SQL DIRETO] ${meta.source} — ${meta.duration_ms}ms — ${data.length} alunos`, "success");
    } catch (error) {
      onLog(`[SQL DIRETO] Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`, "error");
    } finally {
      setIsTestingSql(false);
    }
  };

  const runInvalidateCache = async () => {
    setIsInvalidating(true);
    onLog("[CACHE] Invalidando cache da lista...", "info");
    try {
      await invalidateStudentsListCache();
      onLog("[CACHE] Cache da lista invalidado com sucesso!", "success");
    } catch (error) {
      onLog(`[CACHE] Erro ao invalidar cache: ${error instanceof Error ? error.message : "Erro desconhecido"}`, "error");
    } finally {
      setIsInvalidating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 p-6 rounded-xl">
        <Button className="w-full h-16 text-lg gap-3" onClick={runCacheTest} disabled={isTestingCache}>
          <Zap className="h-5 w-5" />
          {isTestingCache ? "Testando..." : "Teste com Cache Redis"}
        </Button>
        {lastCache && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="outline" className={sourceBadgeClass[lastCache.source]}>
              {sourceLabel[lastCache.source]}
            </Badge>
            <span className="text-sm text-muted-foreground">{lastCache.duration_ms}ms · {lastCache.count} alunos</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 rounded-xl">
        <Button variant="secondary" className="w-full h-16 text-lg gap-3" onClick={runSqlTest} disabled={isTestingSql}>
          <Database className="h-5 w-5" />
          {isTestingSql ? "Testando..." : "Teste via SQL"}
        </Button>
        {lastSql && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="secondary">{sourceLabel[lastSql.source]}</Badge>
            <span className="text-sm text-muted-foreground">{lastSql.duration_ms}ms · {lastSql.count} alunos</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 rounded-xl">
        <Button variant="outline" className="w-full h-16 text-lg gap-3" onClick={runInvalidateCache} disabled={isInvalidating}>
          <Trash2 className="h-5 w-5" />
          {isInvalidating ? "Invalidando..." : "Invalidar Cache"}
        </Button>
      </div>
    </div>
  );
}
