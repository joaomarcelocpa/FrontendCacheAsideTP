"use client";

import { useRef, useEffect } from "react";
import { Terminal, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function LogsPanel({ logs, onClear }: LogsPanelProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          Logs
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-48 overflow-y-auto bg-secondary/20 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Execute acoes para ver os logs aqui</p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
                  <span className={getLogColor(log.type)}>{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
