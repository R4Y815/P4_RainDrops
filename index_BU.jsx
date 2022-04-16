/* may not be able to import pg? */
import axios from 'axios';
import 'core-js/es/function';
import React from 'react';
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import './main.scss'; /* for stylesheet */
import moment from 'moment';
import pokemon from './react-pokedex.json';

/* console.log(pokemon);
console.log(pokemon.pokedex); */
console.log(pokemon.pokedex[0]);

function Abilities({abilities} ) {

  const display = abilities.map((ability)=>(
      <p>name: {ability.name}</p>
  ));

return (<div>{display}</div>);
}


function Pokemon({pokemon}) {
return ( 
<li>  
  <p>name:{pokemon.names.en}</p>
  <p>national_id: {pokemon.national_id}</p>
  <p>types: {pokemon.types.join(', ')}</p>
  <div>abilities: <Abilities abilities={pokemon.abilities} /></div>
  <p>height_eu: {pokemon.height_eu}</p>
  <p>weight_eu: {pokemon.weight_eu}</p>
</li>
)
}

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

const rootComponent = createRoot(rootEl);

rootComponent.render(<Pokemon pokemon={pokemon.pokedex[0]} />);
