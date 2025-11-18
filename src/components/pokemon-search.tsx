"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PokemonSearchProps {
  onSearchChange: (query: string) => void;
  debounceMs?: number;
}

export function PokemonSearch({
  onSearchChange,
  debounceMs = 300,
}: PokemonSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearchChange, debounceMs]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Pokemon..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

