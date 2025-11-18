"use client";

import { useInView } from "react-intersection-observer";
import type { Pokemon } from "@/types/pokemon";
import { PokemonCardASCII } from "./pokemon-card-ascii";

interface PokemonListASCIIProps {
  pokemon: Pokemon[];
  searchQuery: string;
  onPokemonClick: (pokemon: Pokemon) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function PokemonListASCII({
  pokemon,
  searchQuery,
  onPokemonClick,
  onLoadMore,
  hasNextPage = false,
  isFetchingNextPage = false,
}: PokemonListASCIIProps) {
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage && onLoadMore) {
        onLoadMore();
      }
    },
  });

  if (pokemon.length === 0 && searchQuery) {
    return (
      <div className="font-mono flex flex-col items-center justify-center py-12 text-center">
        <div className="border border-foreground p-4 bg-muted/20">
          <p className="text-lg">
            No Pokemon found matching "{searchQuery}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-mono">
      {/* Grid of Pokemon cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pokemon.map((p) => (
          <PokemonCardASCII
            key={p.id}
            pokemon={p}
            onClick={() => onPokemonClick(p)}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={ref} className="mt-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
              <span>[...]</span>
              <span>Loading more Pokemon...</span>
            </div>
          )}
        </div>
      )}

      {!hasNextPage && pokemon.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center font-mono">
          All Pokemon loaded
        </div>
      )}
    </div>
  );
}

