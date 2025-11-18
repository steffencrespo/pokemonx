"use client";

import { useEffect, useState } from "react";

interface PokemonSearchASCIIProps {
  onSearchChange: (query: string) => void;
  debounceMs?: number;
}

export function PokemonSearchASCII({
  onSearchChange,
  debounceMs = 300,
}: PokemonSearchASCIIProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearchChange, debounceMs]);

  return (
    <div className="font-mono">
      <div className="border border-foreground bg-background">
        <div className="flex items-center border-b border-foreground">
          <div className="px-2 py-1 border-r border-foreground bg-muted">
            [🔍]
          </div>
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-2 py-1 bg-background text-foreground focus:outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}

