import React from 'react';

//Rendering out the array of pokemon data
export function PokemonList() {
  const listPokemon = pokemonData.map((pokemon)=>(
    <li key={pokemon.names.en}>
      <h4>{pokemon.names.en}</h4>
      <p>Catch Rate: {pokemon.catch_rate}</p>
      <p>Height: {pokemon.height_eu}</p>
      <p>Weight: {pokemon.weight_eu}</p>
      <hr />
    </li>
  ));
  console.log('listPokemon =', listPokemon);
  return listPokemon;
}