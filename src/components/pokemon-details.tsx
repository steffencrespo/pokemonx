"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPokemon } from "@/lib/pokeapi";
import { cn } from "@/lib/utils";
import type { Pokemon } from "@/types/pokemon";

interface PokemonDetailsProps {
  pokemon: Pokemon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const statNames: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

function formatStatName(statName: string): string {
  return statNames[statName] || statName;
}

function StatBar({ 
  label, 
  value, 
  max = 255 
}: { 
  label: string; 
  value: number; 
  max?: number 
}) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 text-sm font-medium">{label}</div>
      <div className="flex-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="w-12 text-right text-sm text-muted-foreground">
        {value}
      </div>
    </div>
  );
}

export function PokemonDetails({
  pokemon,
  open,
  onOpenChange,
}: PokemonDetailsProps) {
  const { data: pokemonData, isLoading } = useQuery({
    queryKey: ["pokemon", pokemon?.id],
    queryFn: () => getPokemon(pokemon!.id),
    enabled: open && !!pokemon,
  });

  const displayPokemon = pokemonData || pokemon;

  if (!displayPokemon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pokemon Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image and Basic Info */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0">
              <div className="flex-shrink-0">
                <img
                  src={
                    displayPokemon.sprites.front_default ||
                    "/placeholder-pokemon.png"
                  }
                  alt={displayPokemon.name}
                  className="h-48 w-48 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-pokemon.png";
                  }}
                />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-sm font-medium text-muted-foreground">
                  #{String(displayPokemon.id).padStart(3, "0")}
                </p>
                <h2 className="text-3xl font-bold capitalize">
                  {displayPokemon.name}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {displayPokemon.types.map((type) => (
                    <span
                      key={type.slot}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium text-white capitalize",
                        typeColors[type.type.name] || typeColors.normal
                      )}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold">Stats</h3>
              <div className="space-y-3">
                {displayPokemon.stats.map((stat) => (
                  <StatBar
                    key={stat.stat.name}
                    label={formatStatName(stat.stat.name)}
                    value={stat.base_stat}
                  />
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold">Abilities</h3>
              <div className="space-y-2">
                {displayPokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg">•</span>
                    <span className="capitalize font-medium">
                      {ability.ability.name}
                    </span>
                    {ability.is_hidden && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

