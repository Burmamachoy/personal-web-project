import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {Generos} from "./generos.entity";

@Injectable()
export class GenerosService {
    constructor(
        @InjectRepository(Generos)
        private _repositorioGeneros: Repository<Generos>
    ) {
    }

    crearGenero(genero:Generos){
        return this._repositorioGeneros
            .save<Generos>(genero);
    }

    borrarGenero(id:number):Promise<DeleteResult>{
        return this._repositorioGeneros
            .delete({id})
    }

    actualizarGenero(
        id: number,
        genero: Generos
    ): Promise<Generos> {
        genero.id = id;
        return this._repositorioGeneros
            .save(genero);
    }



}
