"use client";

import { Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsPanelProps {
  cacheMetrics: number[];
  sqlMetrics: number[];
}

export function MetricsPanel({ cacheMetrics, sqlMetrics }: MetricsPanelProps) {
  const avgCache = cacheMetrics.length > 0 
    ? Math.round(cacheMetrics.reduce((a, b) => a + b, 0) / cacheMetrics.length) 
    : 0;
  const avgSql = sqlMetrics.length > 0 
    ? Math.round(sqlMetrics.reduce((a, b) => a + b, 0) / sqlMetrics.length) 
    : 0;
  const minCache = cacheMetrics.length > 0 ? Math.min(...cacheMetrics) : 0;
  const maxCache = cacheMetrics.length > 0 ? Math.max(...cacheMetrics) : 0;
  const minSql = sqlMetrics.length > 0 ? Math.min(...sqlMetrics) : 0;
  const maxSql = sqlMetrics.length > 0 ? Math.max(...sqlMetrics) : 0;

  const improvement = avgSql > 0 && avgCache > 0 
    ? Math.round(((avgSql - avgCache) / avgSql) * 100) 
    : 0;

  const hasData = cacheMetrics.length > 0 || sqlMetrics.length > 0;

  if (!hasData) {
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
          Metricas de Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 text-center">
            <p className="text-2xl font-bold text-primary">{avgCache}ms</p>
            <p className="text-xs text-muted-foreground">Media Cache</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 text-center">
            <p className="text-2xl font-bold">{avgSql}ms</p>
            <p className="text-xs text-muted-foreground">Media SQL</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 text-center">
            <p className="text-2xl font-bold text-green-600">{improvement > 0 ? `${improvement}%` : "-"}</p>
            <p className="text-xs text-muted-foreground">Melhoria</p>
          </div>
        </div>

        {/* Tabela de detalhes */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium">Metrica</th>
                <th className="text-center py-2 px-3 font-medium text-primary">Cache Aside</th>
                <th className="text-center py-2 px-3 font-medium">SQL Direto</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 px-3">Minimo</td>
                <td className="text-center py-2 px-3 text-primary">{minCache}ms</td>
                <td className="text-center py-2 px-3">{minSql}ms</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 px-3">Maximo</td>
                <td className="text-center py-2 px-3 text-primary">{maxCache}ms</td>
                <td className="text-center py-2 px-3">{maxSql}ms</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Media</td>
                <td className="text-center py-2 px-3 text-primary font-medium">{avgCache}ms</td>
                <td className="text-center py-2 px-3 font-medium">{avgSql}ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Barra visual */}
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
              <div 
                className="h-full bg-secondary rounded-full"
                style={{ width: "100%" }}
              />
            </div>
            <span className="text-xs w-12 text-right">{avgSql}ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
