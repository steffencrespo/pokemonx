"use client";

import { useState, useMemo } from "react";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { getPokemonList, getPokemon, getAllPokemonNames } from "@/lib/pokeapi";
import { PokemonSearch } from "@/components/pokemon-search";
import { PokemonList } from "@/components/pokemon-list";
import { PokemonDetails } from "@/components/pokemon-details";
import { PokemonSearchASCII } from "@/components/ascii/pokemon-search-ascii";
import { PokemonListASCII } from "@/components/ascii/pokemon-list-ascii";
import { PokemonDetailsASCII } from "@/components/ascii/pokemon-details-ascii";
import { useUIMode } from "@/contexts/ui-mode-context";
import { Button } from "@/components/ui/button";
import { useASCIIArt } from "@/hooks/use-ascii-art";
import type { Pokemon } from "@/types/pokemon";

const POKEMON_PER_PAGE = 20;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { mode, toggleMode } = useUIMode();

  const isSearchMode = searchQuery.trim().length > 0;
  const isASCIIMode = mode === "ascii";
  
  // Split title into two words and generate ASCII art for each separately
  const { asciiText: pokemonASCII, isLoading: isLoadingPokemonTitle } = useASCIIArt(
    "POKEMON",
    isASCIIMode
  );
  const { asciiText: explorerASCII, isLoading: isLoadingExplorerTitle } = useASCIIArt(
    "EXPLORER",
    isASCIIMode
  );
  
  // Combine both ASCII art strings side by side
  const titleASCII = useMemo(() => {
    if (!isASCIIMode) return "";
    if (isLoadingPokemonTitle || isLoadingExplorerTitle) return "";
    
    const pokemonLines = pokemonASCII.split("\n");
    const explorerLines = explorerASCII.split("\n");
    const maxLines = Math.max(pokemonLines.length, explorerLines.length);
    
    const combined: string[] = [];
    for (let i = 0; i < maxLines; i++) {
      const pokemonLine = pokemonLines[i] || "";
      const explorerLine = explorerLines[i] || "";
      // Add some spacing between the two words
      combined.push(pokemonLine + "  " + explorerLine);
    }
    
    return combined.join("\n");
  }, [pokemonASCII, explorerASCII, isLoadingPokemonTitle, isLoadingExplorerTitle, isASCIIMode]);
  
  const isLoadingTitle = isLoadingPokemonTitle || isLoadingExplorerTitle;

  // Fetch all Pokemon names for search (cached, pre-fetch for instant search)
  const { data: allPokemonNamesData, isLoading: isLoadingAllNames } = useQuery({
    queryKey: ["all-pokemon-names"],
    queryFn: getAllPokemonNames,
    staleTime: Infinity, // Cache forever since Pokemon names don't change
    // Always enabled so it's cached and ready when user searches
  });

  // Fetch Pokemon list with infinite scroll (for browse mode)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["pokemon-list"],
    queryFn: ({ pageParam = 0 }) => getPokemonList(pageParam, POKEMON_PER_PAGE),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * POKEMON_PER_PAGE;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !isSearchMode, // Only fetch when not searching
  });

  // Get Pokemon IDs based on mode
  const pokemonIds = useMemo(() => {
    if (isSearchMode && allPokemonNamesData) {
      // Filter Pokemon names by search query
      const query = searchQuery.toLowerCase().trim();
      const matchingPokemon = allPokemonNamesData.results.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      
      return matchingPokemon
        .map((item) => {
          const match = item.url.match(/\/pokemon\/(\d+)\//);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((id): id is number => id !== null);
    } else if (!isSearchMode && data) {
      // Extract Pokemon IDs from infinite scroll data
      const allPokemonData = data.pages.flatMap((page) => page.results);
      return allPokemonData
        .map((item) => {
          const match = item.url.match(/\/pokemon\/(\d+)\//);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((id): id is number => id !== null);
    }
    return [];
  }, [isSearchMode, searchQuery, allPokemonNamesData, data]);

  // Fetch all Pokemon data in parallel
  const pokemonQueries = useQueries({
    queries: pokemonIds.map((id) => ({
      queryKey: ["pokemon", id],
      queryFn: () => getPokemon(id),
      staleTime: Infinity, // Cache forever since Pokemon data doesn't change
    })),
  });

  const pokemon = useMemo(() => {
    return pokemonQueries
      .map((query) => query.data)
      .filter((p): p is Pokemon => p !== undefined);
  }, [pokemonQueries]);

  const isLoadingPokemon = pokemonQueries.some((query) => query.isLoading);
  const isSearchLoading = isSearchMode && (isLoadingAllNames || isLoadingPokemon);

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsDetailsOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            {isASCIIMode ? (
              <div className="flex-1">
                <div className="font-mono">
                  {/* Title in ASCII art style like Pokemon names in details */}
                  <pre className="text-xs sm:text-sm whitespace-pre leading-tight">
                    {titleASCII}
                  </pre>
                </div>
              </div>
            ) : (
              <h1 className="text-4xl font-bold tracking-tight">
                Pokemon Explorer
              </h1>
            )}
            <Button
              onClick={toggleMode}
              variant="outline"
              className={isASCIIMode ? "font-mono" : ""}
            >
              {isASCIIMode ? "ASCII" : "Modern"}
            </Button>
          </div>
          {isASCIIMode ? (
            <PokemonSearchASCII onSearchChange={setSearchQuery} />
          ) : (
            <PokemonSearch onSearchChange={setSearchQuery} />
          )}
        </div>

        {error && (
          <div className={`${isASCIIMode ? "font-mono border border-destructive" : "rounded-lg border border-destructive bg-destructive/10"} p-4 text-destructive`}>
            Error loading Pokemon: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}

        {isLoading || isSearchLoading ? (
          <div className={`flex items-center justify-center py-12 ${isASCIIMode ? "font-mono" : ""}`}>
            {isASCIIMode ? (
              <div className="text-lg">[...] Loading...</div>
            ) : (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
          </div>
        ) : isASCIIMode ? (
          <PokemonListASCII
            pokemon={pokemon}
            searchQuery={searchQuery}
            onPokemonClick={handlePokemonClick}
            onLoadMore={isSearchMode ? undefined : () => fetchNextPage()}
            hasNextPage={isSearchMode ? false : (hasNextPage || false)}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          <PokemonList
            pokemon={pokemon}
            searchQuery={searchQuery}
            onPokemonClick={handlePokemonClick}
            onLoadMore={isSearchMode ? undefined : () => fetchNextPage()}
            hasNextPage={isSearchMode ? false : (hasNextPage || false)}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}

        {isASCIIMode ? (
          <PokemonDetailsASCII
            pokemon={selectedPokemon}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
        ) : (
          <PokemonDetails
            pokemon={selectedPokemon}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
        )}
      </div>
    </main>
  );
}
