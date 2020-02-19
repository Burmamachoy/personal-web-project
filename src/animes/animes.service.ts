import { Injectable } from '@nestjs/common';
import {Animes} from "./animes.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

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

}
