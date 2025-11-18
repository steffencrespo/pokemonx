"use client";

import type { Pokemon } from "@/types/pokemon";

interface PokemonCardASCIIProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export function PokemonCardASCII({ pokemon, onClick }: PokemonCardASCIIProps) {
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const typeBadge = pokemon.types.map((t) => t.type.name.toUpperCase()).join("/");

  return (
    <button
      onClick={onClick}
      className="font-mono text-left focus:outline-none focus:ring-2 focus:ring-foreground"
    >
      <div className="border-2 border-foreground bg-background">
        {/* Top border */}
        <div className="border-b-2 border-foreground px-2 py-1">
          <div className="flex items-center justify-between">
            <span className="text-xs">#{String(pokemon.id).padStart(3, "0")}</span>
            <span className="text-xs">[{typeBadge}]</span>
          </div>
        </div>
        
        {/* Image area */}
        <div className="flex items-center justify-center border-b-2 border-foreground p-4 min-h-[120px] bg-muted/20">
          <div className="text-center">
            {pokemon.sprites.front_default ? (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="h-20 w-20 object-contain mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.parentElement?.querySelector('.img-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = "block";
                }}
              />
            ) : null}
            <div className="text-4xl img-fallback font-mono" style={{ display: pokemon.sprites.front_default ? "none" : "block" }}>
              [IMG]
            </div>
          </div>
        </div>
        
        {/* Name */}
        <div className="px-2 py-2 border-b-2 border-foreground">
          <div className="font-semibold uppercase text-sm">
            {pokemon.name}
          </div>
        </div>
        
        {/* Bottom border */}
        <div className="px-2 py-1 text-xs text-muted-foreground">
          Click for details
        </div>
      </div>
    </button>
  );
}

