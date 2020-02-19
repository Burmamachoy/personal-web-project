import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Usuarios} from "./usuarios.entity";
import * as crypto from "crypto";

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuarios)
        private _repositorioUsuarios: Repository<Usuarios>
    ) {
    }

    crearUsuario(usuario:Usuarios){
        return this._repositorioUsuarios
            .save<Usuarios>(usuario);
    }

    generarSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    generarPasswordHash(password: string, salt: string) {
        return crypto.createHash('md5').update(password + salt).digest('hex');
    }

}
