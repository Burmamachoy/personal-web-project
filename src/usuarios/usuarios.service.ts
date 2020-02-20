import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {Usuarios} from "./usuarios.entity";
import * as crypto from "crypto";
import { Roles } from './roles.entity';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuarios)
        private _repositorioUsuarios: Repository<Usuarios>,
        private _repositorioRoles: Repository<Roles>
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

    encontrarUsuario(id: number): Promise<Usuarios | undefined>{
        return this._repositorioUsuarios
          .findOne(id)
    }

    encontrarUsuarioPorCorreo(correo: string): Promise<Usuarios | undefined>{
        return this._repositorioUsuarios
          .findOne({
            where:{
              correo: correo
            }
          }
        )
    }

    buscarUsuario(
      where:any = {},
      skip = 0,
      take = 10,
      order: any = {
          id: 'DESC',
          correo: 'ASC'
      }
    ) : Promise<Usuarios[]>{
        return this._repositorioUsuarios
          .find({
              where: where,
              skip: skip,
              take: take,
              order: order,
          })
    }

    crearRol(rol:Roles){
      return this._repositorioRoles
        .save<Roles>(rol);
    }

    // asignarRol(idUsuario: number, idRole: number){
    //   const user = this._repositorioUsuarios
    //     .findOne({
    //       where:{
    //         id: id
    //       }
    //     }
    // }

    generarSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    generarPasswordHash(password: string, salt: string) {
        return crypto.createHash('md5').update(password + salt).digest('hex');
    }

}
