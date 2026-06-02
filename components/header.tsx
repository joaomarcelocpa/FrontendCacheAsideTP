"use client";

import { Database } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white text-secondary-foreground py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-black" />
          <div>
            <h1 className="text-xl font-bold text-black">Trabalho de Arquitetura de Software</h1>
            <p className="text-sm text-muted-foreground">Cache Aside e Performance de APIs</p>
          </div>
        </div>
      </div>
    </header>
  );
}
