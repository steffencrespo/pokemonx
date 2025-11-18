import type { Pokemon, PokemonListResponse } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemon(id: number | string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}/`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getPokemonList(
  offset: number = 0,
  limit: number = 20
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch all Pokemon names (used for search)
// PokeAPI has ~1300 Pokemon, so we fetch them all at once for search
export async function getAllPokemonNames(): Promise<PokemonListResponse> {
  // Fetch with a large limit to get all Pokemon at once
  // The API supports up to the total count
  const response = await fetch(`${BASE_URL}/pokemon?offset=0&limit=2000`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch all Pokemon names: ${response.statusText}`);
  }
  
  return response.json();
}

