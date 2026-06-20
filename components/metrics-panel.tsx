"use client";

import { Clock, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestResult } from "./performance-test";

interface MetricsPanelProps {
  results: TestResult[];
}

const sourceBadgeClass: Record<TestResult["source"], string> = {
  sql: "",
  cache_hit: "bg-green-500/20 text-green-600 border-green-500/30",
  cache_miss: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
};

export function MetricsPanel({ results }: MetricsPanelProps) {
  const cacheResults = results.filter((r) => r.type === "cache");
  const sqlResults = results.filter((r) => r.type === "sql");

  const avg = (arr: TestResult[]) =>
    arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b.duration_ms, 0) / arr.length) : 0;
  const min = (arr: TestResult[]) =>
    arr.length > 0 ? Math.min(...arr.map((r) => r.duration_ms)) : 0;
  const max = (arr: TestResult[]) =>
    arr.length > 0 ? Math.max(...arr.map((r) => r.duration_ms)) : 0;

  const avgCache = avg(cacheResults);
  const avgSql = avg(sqlResults);
  const improvement = avgSql > 0 && avgCache > 0
    ? Math.round(((avgSql - avgCache) / avgSql) * 100)
    : 0;

  const lastResult = results.at(-1);

  if (results.length === 0) {
    return (
      <Card className="border border-border">
        <CardContent className="py-12 text-center text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p>Execute os testes para ver as metricas aqui</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Métricas de Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          {/* Metricas */}
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 text-center">
                <p className="text-2xl font-bold text-primary">{cacheResults.length}</p>
                <p className="text-xs text-muted-foreground">Requisições Cache Redis</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 text-center">
                <p className="text-2xl font-bold">{sqlResults.length}</p>
                <p className="text-xs text-muted-foreground">Requisições SQL</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 text-center">
                <p className="text-2xl font-bold text-primary">{cacheResults.at(-1)?.duration_ms ?? 0}ms</p>
                <p className="text-xs text-muted-foreground">Último Cache</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 text-center">
                <p className="text-2xl font-bold">{sqlResults.at(-1)?.duration_ms ?? 0}ms</p>
                <p className="text-xs text-muted-foreground">Último SQL</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 text-center">
                <p className="text-2xl font-bold text-green-600">{improvement > 0 ? `${improvement}%` : "-"}</p>
                <p className="text-xs text-muted-foreground">Melhoria</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium">Métrica</th>
                    <th className="text-center py-2 px-3 font-medium text-primary">Cache Redis</th>
                    <th className="text-center py-2 px-3 font-medium">Consulta SQL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3">Mínimo</td>
                    <td className="text-center py-2 px-3 text-primary">{min(cacheResults)}ms</td>
                    <td className="text-center py-2 px-3">{min(sqlResults)}ms</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3">Máximo</td>
                    <td className="text-center py-2 px-3 text-primary">{max(cacheResults)}ms</td>
                    <td className="text-center py-2 px-3">{max(sqlResults)}ms</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3">Média</td>
                    <td className="text-center py-2 px-3 text-primary font-medium">{avgCache}ms</td>
                    <td className="text-center py-2 px-3 font-medium">{avgSql}ms</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Último source</td>
                    <td className="text-center py-2 px-3">
                      {cacheResults.at(-1) && (
                        <Badge variant="outline" className={sourceBadgeClass[cacheResults.at(-1)!.source]}>
                          {cacheResults.at(-1)!.source}
                        </Badge>
                      )}
                    </td>
                    <td className="text-center py-2 px-3">
                      {sqlResults.at(-1) && (
                        <Badge variant="secondary">{sqlResults.at(-1)!.source}</Badge>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs w-16">Cache</span>
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${avgSql > 0 ? Math.min((avgCache / avgSql) * 100, 100) : 0}%` }}
                  />
                </div>
                <span className="text-xs w-12 text-right">{avgCache}ms</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs w-16">SQL</span>
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: "100%" }} />
                </div>
                <span className="text-xs w-12 text-right">{avgSql}ms</span>
              </div>
            </div>
          </div>

          {/* Lista discreta de alunos */}
          <div className="col-span-1 border-l border-border pl-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Último retorno</span>
              {lastResult && (
                <Badge variant="outline" className="ml-auto text-xs">{lastResult.count}</Badge>
              )}
            </div>
            {lastResult && lastResult.students.length > 0 ? (
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {lastResult.students.map((student, i) => (
                  <div key={student.identifier ?? i} className="p-2 rounded-md bg-muted/40 text-xs">
                    <p className="font-medium truncate">{student.name}</p>
                    <p className="text-muted-foreground truncate">{student.course} · P{student.period}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhum aluno retornado</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
