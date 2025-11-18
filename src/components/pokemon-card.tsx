"use client";

import type { Pokemon } from "@/types/pokemon";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-amber-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const typeColor = typeColors[primaryType] || typeColors.normal;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card p-4 text-left transition-all hover:shadow-lg hover:scale-105",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="relative h-32 w-32 flex-shrink-0">
          {pokemon.sprites.front_default ? (
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-full w-full object-contain transition-transform group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded text-muted-foreground text-xs">
              No Image
            </div>
          )}
        </div>
        <div className="w-full space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            #{String(pokemon.id).padStart(3, "0")}
          </p>
          <h3 className="text-lg font-semibold capitalize">
            {pokemon.name}
          </h3>
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((type) => (
              <span
                key={type.slot}
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium text-white capitalize",
                  typeColors[type.type.name] || typeColors.normal
                )}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

