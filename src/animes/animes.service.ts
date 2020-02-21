import { Injectable } from '@nestjs/common';
import {Animes} from "./animes.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";

@Injectable()
export class AnimesService {
    constructor(
        @InjectRepository(Animes)
        private _repositorioAnimes: Repository<Animes>
    ) {
    }

    crearAnime(anime:Animes){
        return this._repositorioAnimes
            .save<Animes>(anime);
    }

    borrarAnime(id:number): Promise<DeleteResult>{
        return this._repositorioAnimes
            .delete({id})
    }

    actualizarAnime(
        id: number,
        anime: Animes
    ): Promise<Animes>{
        anime.id = id;
        return this._repositorioAnimes
            .save(anime);
    }

    encontrarAnime(id: number): Promise<Animes | undefined>{
        return this._repositorioAnimes
          .findOne(id)
    }

    buscarAnime(
      where:any = {},
      skip = 0,
      take = 10,
      order: any = {
          id: 'DESC',
          nombre: 'ASC'
      }

    ) : Promise<Animes[]>{

        return this._repositorioAnimes
          .find({
              relations: ["generos"],
              where: where,
              skip: skip,
              take: take,
              order: order,
          })
    }


}
