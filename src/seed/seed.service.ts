import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response-interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }

  /* De esta forma se hace una sola inserción en la Bd */
  async executeSeed() {
    // Limpiar la bd.
    await this.pokemonModel.deleteMany({});
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonsToInsert: { name: string; no: number }[] = [];

    for (const { name, url } of data.results) {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonsToInsert.push({ name, no });
    }

    await this.pokemonModel.insertMany(pokemonsToInsert);
    return 'seed executed';
  }

  /* De esta forma, agrega todas las promesas y al final las ejecuta. */
  async executeSeedv2() {
    // Limpiar la bd.
    await this.pokemonModel.deleteMany({});
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const insertPromisesArray: Promise<Pokemon>[] = [];

    for (const { name, url } of data.results) {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    }

    await Promise.all(insertPromisesArray);
    return 'seed executed';
  }

  /* De esta forma se hace la inserción de 1 a 1. Obligando a esperar a que termine ded insertar cada 1 */
  async executeSeedv1() {
    // Limpiar la bd.
    await this.pokemonModel.deleteMany({});
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    for (const { name, url } of data.results) {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      await this.pokemonModel.create({ name, no });
    }
    return 'seed executed';
  }
}
