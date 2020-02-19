import {Body, Controller, Delete, Param, Post} from '@nestjs/common';
import {UsuariosService} from "./usuarios.service";
import {Usuarios} from "./usuarios.entity";
import {UsuariosCreateDto} from "./usuarios-create.dto";
import {validate} from "class-validator";
import {DeleteResult} from "typeorm";
import {UsuariosUpdateDto} from "./usuarios-update-dto";

@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
    ) {}

    @Post('crear')
    async crearUsuario(
        @Body() usuario: Usuarios,
    ): Promise<void> {
        const usuarioCreateDto = new UsuariosCreateDto();
        usuarioCreateDto.correo = usuario.correo;
        usuarioCreateDto.password = usuario.password;
        usuario.salt = this.usuariosService.generarSalt();
        const errores = await validate(usuarioCreateDto);
        console.error(errores);
        if (errores.length > 0) {

        } else {
            usuario.password = this.usuariosService.generarPasswordHash(usuario.password, usuario.salt)
            try{
                await this.usuariosService
                    .crearUsuario(
                        usuario,
                    );

            } catch(error){
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


    @Delete(':id')
    eliminarUno(
        @Param('id') id: string,
    ): Promise<DeleteResult> {
        return this.usuariosService
            .borrarUsuario(
                +id,
            );
    }

}
