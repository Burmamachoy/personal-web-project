import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
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

}
