"use client";

import { useState } from "react";
import { Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerformanceTestProps {
  onLog: (message: string, type: "info" | "success" | "error") => void;
  onMetric: (type: "cache" | "sql", time: number) => void;
}

export function PerformanceTest({ onLog, onMetric }: PerformanceTestProps) {
  const [isTestingCache, setIsTestingCache] = useState(false);
  const [isTestingSql, setIsTestingSql] = useState(false);
  const [lastCacheTime, setLastCacheTime] = useState<number | null>(null);
  const [lastSqlTime, setLastSqlTime] = useState<number | null>(null);

  const runCacheTest = async () => {
    setIsTestingCache(true);
    onLog("[CACHE ASIDE] Iniciando teste...", "info");
    
    // Simulacao - substitua pela chamada real ao backend
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 50 + 10));
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    setLastCacheTime(responseTime);
    onMetric("cache", responseTime);
    onLog(`[CACHE ASIDE] Tempo de resposta: ${responseTime}ms`, "success");
    setIsTestingCache(false);
  };

  const runSqlTest = async () => {
    setIsTestingSql(true);
    onLog("[SQL DIRETO] Iniciando teste...", "info");
    
    // Simulacao - substitua pela chamada real ao backend
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 150 + 50));
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    setLastSqlTime(responseTime);
    onMetric("sql", responseTime);
    onLog(`[SQL DIRETO] Tempo de resposta: ${responseTime}ms`, "success");
    setIsTestingSql(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 p-6 rounded-xl bg-primary/10 border-2 border-primary/30">
        <Button 
          className="w-full h-16 text-lg gap-3" 
          onClick={runCacheTest} 
          disabled={isTestingCache}
        >
          <Zap className="h-5 w-5" />
          {isTestingCache ? "Testando..." : "Teste com Cache Aside"}
        </Button>
        {lastCacheTime !== null && (
          <p className="text-center mt-3 text-sm text-muted-foreground">
            Ultimo tempo: <span className="font-bold text-primary">{lastCacheTime}ms</span>
          </p>
        )}
      </div>

      <div className="flex-1 p-6 rounded-xl bg-secondary/20 border-2 border-secondary/50">
        <Button 
          variant="secondary"
          className="w-full h-16 text-lg gap-3" 
          onClick={runSqlTest} 
          disabled={isTestingSql}
        >
          <Database className="h-5 w-5" />
          {isTestingSql ? "Testando..." : "Teste via SQL"}
        </Button>
        {lastSqlTime !== null && (
          <p className="text-center mt-3 text-sm text-muted-foreground">
            Ultimo tempo: <span className="font-bold">{lastSqlTime}ms</span>
          </p>
        )}
      </div>
    </div>
  );
}
