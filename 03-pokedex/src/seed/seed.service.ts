import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){}

  
  
  async executeSeed(){

  await this.pokemonModel.deleteMany({}); // delete * from pokemon

  const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

  // const insertPromisesArray = [];
  
  // data.results.forEach(async({name, url}) => {


  //   const segments = url.split('/');
  //   const no: number = +segments[ segments.length - 2];

  //   insertPromisesArray.push( 

  //     this.pokemonModel.create({name, no})
  //   );
    

  //   await Promise.all(insertPromisesArray);

  // })

  //   return 'Seed executed';

    const pokemonToInsert : { name: string, no: number } [] = [];

    data.results.forEach(async({name, url}) => {

        const segments = url.split('/');
        const no: number = +segments[ segments.length - 2];
    
        pokemonToInsert.push({ name, no}); // [{ name: 'bulbasaur', no: 1}, { name: 'ivysaur', no: 2}, ...]
    });    

    await this.pokemonModel.insertMany(pokemonToInsert);
    // insert into pokemons (name, no)
    // (name: bulbasour, no: 1), (name: ivysaur, no: 2), ...

    return 'Seed executed';
  }
}
