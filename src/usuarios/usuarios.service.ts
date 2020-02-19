import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
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

    borrarUsuario(id:number):Promise<DeleteResult>{
        return this._repositorioUsuarios
            .delete({id})
    }

    actualizarUsuario(
        id: number,
        usuario: Usuarios
    ): Promise<Usuarios>{
        usuario.id = id;
        return this._repositorioUsuarios
            .save(usuario);
    }

    generarSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    generarPasswordHash(password: string, salt: string) {
        return crypto.createHash('md5').update(password + salt).digest('hex');
    }

}
