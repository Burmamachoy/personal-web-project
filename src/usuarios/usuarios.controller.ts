import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import {UsuariosService} from "./usuarios.service";
import {Usuarios} from "./usuarios.entity";
import {UsuariosCreateDto} from "./usuarios-create.dto";
import {validate} from "class-validator";
import {DeleteResult} from "typeorm";
import {UsuariosUpdateDto} from "./usuarios-update-dto";
import { Roles } from './roles.entity';
import {RolesCreateDto} from "./roles-create-dto";

@Controller('usuarios')
export class UsuariosController {
    constructor(
      private readonly usuariosService: UsuariosService,
    ) {
    }

    @Post('crear/:id')
    async crearUsuario(
      @Body() usuario: Usuarios,
      @Param('id') id: string,
    ): Promise<void> {
        const usuarioCreateDto = new UsuariosCreateDto();
        usuarioCreateDto.correo = usuario.correo;
        usuarioCreateDto.password = usuario.password;
        usuarioCreateDto.idRol = +id;
        usuario.salt = this.usuariosService.generarSalt();
        const errores = await validate(usuarioCreateDto);
        console.error(errores);
        if (errores.length > 0) {

        } else {
            usuario.password = this.usuariosService.generarPasswordHash(usuario.password, usuario.salt);
            const rol = this.usuariosService.encontrarRol(+id);
            if(! await rol) {
                throw new NotFoundException();
            }
            usuario.roles = await rol;
            try {
                await this.usuariosService
                  .crearUsuario(
                    usuario,
                  );

            } catch (error) {
                console.error(error)
            }
        }
    }

    @Post('crearRol')
    async crearRol(
      @Body() rol: Roles,
    ): Promise<void>{
        const rolesCreateDto = new RolesCreateDto();
        rolesCreateDto.rol = rol.rol;
        const errores = await validate(rolesCreateDto);
        if (errores.length > 0){

        } else {
            try{
                await this.usuariosService
                    .crearRol(rol)
            } catch (error){
                console.error(error)
            }
        }
    }

    @Post(':id')
    async actualizarUsuario(
      @Body() usuario: Usuarios,
      @Param('id') id: string,
    ): Promise<void> {
        const usuarioUpdateDTO = new UsuariosUpdateDto();
        usuarioUpdateDTO.correo = usuario.correo;
        usuarioUpdateDTO.password = usuario.password;
        usuario.salt = this.usuariosService.generarSalt()
        usuarioUpdateDTO.id = +id;
        const errores = await validate(usuarioUpdateDTO);
        if (errores.length > 0) {

        } else {
            usuario.password = this.usuariosService.generarPasswordHash(usuario.password, usuario.salt)
            await this.usuariosService
              .actualizarUsuario(
                +id,
                usuario,
              );
        }

    }

    @Post(':id')
    eliminarUno(
      @Param('id') id: string,
    ): Promise<DeleteResult> {
        return this.usuariosService
          .borrarUsuario(
            +id,
          );
    }

    @Get(':id')
    obtenerUsuario(
      @Param('id') id: string,
    ): Promise<Usuarios | undefined> {
        return this.usuariosService
          .encontrarUsuario(
            Number(id),
          );
    }

    // @Get()
    // async test(
    //   @Query('correo') correo?: string,
    // ) :Promise<Usuarios>{
    //     return this.usuariosService.encontrarUsuarioPorCorreo(correo)
    // }
    @Get()
    async buscarUsuarios(
      @Query('skip') skip?: string | number,
      @Query('take') take?: string | number,
      @Query('where') where?: string,
      @Query('order') order?: string,
    ): Promise<Usuarios[]> {
        if (order) {
            try {
                order = JSON.parse(order);
            } catch (e) {
                order = undefined;
            }
        }
        if (where) {
            try {
                where = JSON.parse(where);
            } catch (e) {
                where = undefined;
            }
        }
        if (skip) {
            skip = +skip;
        }
        if (take) {
            take = +take;
        }
        return this.usuariosService
          .buscarUsuario(
            where,
            skip as number,
            take as number,
            order,
          );

    }
}
