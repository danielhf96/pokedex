import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response-interface';
import { log } from 'console';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=1',
    );

    data.results.forEach(({ name, url }) => {
      console.log({ name, url });

      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      log({ no, name });
    });
    return data.results;
  }
}
