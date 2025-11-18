"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPokemon } from "@/lib/pokeapi";
import { textToASCIIArt, textToASCIISimple } from "@/lib/ascii-art";
import type { Pokemon } from "@/types/pokemon";

interface PokemonDetailsASCIIProps {
  pokemon: Pokemon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

function ASCIIStatBar({
  label,
  value,
  max = 255,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const filled = Math.floor((percentage / 100) * 20); // 20 chars max
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-2">
        <div className="w-24">{label.padEnd(12)}</div>
        <div className="flex-1">
          <span className="text-foreground">[{bar}]</span>
        </div>
        <div className="w-12 text-right">{value}</div>
      </div>
    </div>
  );
}

export function PokemonDetailsASCII({
  pokemon,
  open,
  onOpenChange,
}: PokemonDetailsASCIIProps) {
  const { data: pokemonData, isLoading } = useQuery({
    queryKey: ["pokemon", pokemon?.id],
    queryFn: () => getPokemon(pokemon!.id),
    enabled: open && !!pokemon,
  });

  const displayPokemon = pokemonData || pokemon;
  const [nameASCII, setNameASCII] = useState<string>(displayPokemon?.name.toUpperCase() || "");
  const [isLoadingName, setIsLoadingName] = useState(false);

  useEffect(() => {
    if (displayPokemon) {
      setIsLoadingName(true);
      textToASCIIArt(displayPokemon.name, "Standard")
        .then((result) => {
          setNameASCII(result);
          setIsLoadingName(false);
        })
        .catch(() => {
          setNameASCII(textToASCIISimple(displayPokemon.name));
          setIsLoadingName(false);
        });
    }
  }, [displayPokemon?.name]);

  if (!displayPokemon) return null;

  const typeBadge = displayPokemon.types
    .map((t) => t.type.name.toUpperCase())
    .join("/");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-mono max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono">Pokemon Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 font-mono">
            <div className="text-lg">[...] Loading...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Border box for main content */}
            <div className="border border-foreground">
              {/* Header */}
              <div className="border-b border-foreground px-4 py-2 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    #{String(displayPokemon.id).padStart(3, "0")}
                  </span>
                  <span className="text-xs">[{typeBadge}]</span>
                </div>
                {isLoadingName ? (
                  <div className="text-xs text-muted-foreground">[...]</div>
                ) : (
                  <pre className="text-xs font-mono whitespace-pre leading-tight">
                    {nameASCII}
                  </pre>
                )}
              </div>

              {/* Image area */}
              <div className="border-b border-foreground p-4 bg-muted/10">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">[IMG]</div>
                    <div className="text-xs text-muted-foreground">
                      {displayPokemon.sprites.front_default ? "● Image" : "○ No Image"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats section */}
              <div className="border-b border-foreground p-4">
                <div className="mb-3 text-sm font-semibold">Stats:</div>
                <div className="space-y-2">
                  {displayPokemon.stats.map((stat) => (
                    <ASCIIStatBar
                      key={stat.stat.name}
                      label={formatStatName(stat.stat.name)}
                      value={stat.base_stat}
                    />
                  ))}
                </div>
              </div>

              {/* Abilities section */}
              <div className="p-4">
                <div className="mb-3 text-sm font-semibold">Abilities:</div>
                <div className="space-y-1">
                  {displayPokemon.abilities.map((ability) => (
                    <div key={ability.ability.name} className="text-sm">
                      <span className="mr-2">•</span>
                      <span className="uppercase">{ability.ability.name}</span>
                      {ability.is_hidden && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (hidden)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

