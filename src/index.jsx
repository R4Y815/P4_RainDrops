/* may not be able to import pg? */
import axios from 'axios';
import 'core-js/es/function';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import './main.scss'; /* for stylesheet */
import moment from 'moment';
/* import Pokemon from './components/Pokemon' */
import pokemon from './react-pokedex.json';
import { v4 as uuidv4 } from 'uuid';


/* console.log(pokemon);
console.log(pokemon.pokedex);
console.log(pokemon.pokedex[0].pokedex_entries);
 */

const pokemonData = Array.from(pokemon.pokedex);



//TRY TO JUST RENDER 1 ELEMENT

//pass in 1 element from an arrayElement
/* function Pokemon({pokemonDeets}){
  return (
    <li key={pokemonDeets[0].names.en}>
      <h3>{pokemonDeets[0].names.en}</h3>
      <p>Catch rate: {pokemonDeets[0].catch_rate}</p>
      <p>Height: {pokemonDeets[0].height_eu}</p>
      <p>Weight: {pokemonDeets[0].weight_eu}</p>
      <hr />
    </li>    
  );
} */

//Rendering out the array of pokemon data
/* function PokemonList() {
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
} */

/* console.log('Output of PokemonList()=',PokemonList()); */

function PokeType({pokemonDeets}) {
  const types = pokemonDeets.types;
  const typesResolved = types.map((type) => (
    <span key={uuidv4()} className="typePic" >
      <img src={`/images/180px-Pokémon_${type}_Type_Icon.svg.png`} className="typePic"/>
    </span>
  ));

  return (
    <>
      <h3>{pokemonDeets.names.en}</h3>
      <div><b>Type/s</b>:
      <ul>{typesResolved}</ul>
      </div>
      <br></br>
    </>
  );
}

function Pokemon({pokemonDeets}){
  const abilitiesResolved = pokemonDeets.abilities.map((ability)=>ability.name);
  let genderRatio = pokemonDeets.gender_ratios;
  if ( genderRatio !== null) {
    const genderRatioTemp = Object.entries(pokemonDeets.gender_ratios).join('% ').toString();
    genderRatio = genderRatioTemp.replaceAll(',', ': ');
    genderRatio += '%';
    } else {
    genderRatio = 'not available';
    }
  const baseStats = Object.entries(pokemonDeets.base_stats).join(' \n').replaceAll(',', ': ').toString();
  /* console.log('baseStats =', baseStats); */
  return (
    <>
      <p><b>National ID</b>: {pokemonDeets.national_id}</p>
      <p><b>Abilities</b>: {abilitiesResolved.join(', ')}</p>
      <p><b>Gender Ratio</b>: {genderRatio}</p>
      <p><b>Catch rate</b>: {pokemonDeets.catch_rate}</p>
      <p><b>Egg Groups</b>: {pokemonDeets.egg_groups.join(', ')}</p>
      <p><b>Hatch Time</b>: {pokemonDeets.hatch_time.join(' ~ ')} mins</p>
      <p><b>Height</b>: {pokemonDeets.height_eu}</p>
      <p><b>Weight</b>: {pokemonDeets.weight_eu}</p>
      <p><b>Base Experience Yield</b>: {pokemonDeets.base_exp_yield}</p>
      <p><b>Leveling Rate</b>: {pokemonDeets.leveling_rate}</p>
      <p><b>Color</b>: {pokemonDeets.color}</p>
      <p><b>Base Friendship</b>: {pokemonDeets.base_friendship}</p>
      <p><b>Base Stats</b>: {baseStats}</p>
      <p><b>Evolved from</b>: {pokemonDeets.evolution_from}</p>
      <p><b>Categories</b>: {pokemonDeets.categories.en}</p>
    </>    
  );
}

function PokedexEntries ({pokedexData}) {

  const keysArr = Object.keys(pokedexData.pokedex_entries);
  /* console.log('keysArr =', keysArr); */
  
  const valuesArr = Object.values(pokedexData.pokedex_entries);
  /* console.log('valuesArr =', valuesArr); */  
  
  //just extract EN version of each version's entry
  const newEntry = valuesArr.map((value) => {
    return value.en });
  /* console.log('newEntry =', newEntry); */

  // combine Each version's Key label to the entry text.
  let pokeDexEntries= [];
  for(let i = 0; i < keysArr.length; i += 1) {
    pokeDexEntries.push(`${keysArr[i]}: ${newEntry[i]}`);
    }
  console.log ('PokeDexEntry =', pokeDexEntries);

  //From Entries array, generate an array of HTML elements in React
  const jsxPokeDexEntries = pokeDexEntries.map((entry) => (
      <li key={uuidv4()}>{entry}</li>
    ));

return(
    <>
      <h5>Pokedex: {pokedexData.names.en}</h5>
        <ul>
          {jsxPokeDexEntries}
        </ul>
      <hr />
    </>
  )
} 

function PokemonParent({pokemonArr}){
  const pokemonDisp = pokemonArr.map((pokemon) => (
    <li key={pokemon.names.en}>
      <PokeType pokemonDeets={pokemon} />
      <Pokemon pokemonDeets={pokemon} />
      <PokedexEntries pokedexData={pokemon} />
    </li>
  ));
  return pokemonDisp;
}



// Create a JSX element that uses the array of HTML list elements
const pokemonEl = (
  <div>
    <ul>
      <PokemonParent pokemonArr={pokemonData}/>
    </ul>
  </div>
);

// RENDERING OUT THE ELEMENT
const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

const rootComponent = createRoot(rootEl);

rootComponent.render(pokemonEl);
