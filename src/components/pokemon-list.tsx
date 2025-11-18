"use client";

import { useInView } from "react-intersection-observer";
import type { Pokemon } from "@/types/pokemon";
import { PokemonCard } from "./pokemon-card";

interface PokemonListProps {
  pokemon: Pokemon[];
  searchQuery: string;
  onPokemonClick: (pokemon: Pokemon) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function PokemonList({
  pokemon,
  searchQuery,
  onPokemonClick,
  onLoadMore,
  hasNextPage = false,
  isFetchingNextPage = false,
}: PokemonListProps) {
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage && onLoadMore) {
        onLoadMore();
      }
    },
  });

  // Pokemon are already filtered by search at the page level
  if (pokemon.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No Pokemon found matching &quot;{searchQuery}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            onClick={() => onPokemonClick(p)}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={ref} className="mt-8 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Loading more Pokemon...</span>
            </div>
          )}
        </div>
      )}

      {!hasNextPage && pokemon.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          All Pokemon loaded
        </div>
      )}
    </div>
  );
}

