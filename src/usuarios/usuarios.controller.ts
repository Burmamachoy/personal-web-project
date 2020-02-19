import {Body, Controller, Post} from '@nestjs/common';
import {UsuariosService} from "./usuarios.service";
import {Usuarios} from "./usuarios.entity";
import {usuariosCreateDto} from "./usuarios.create-dto";
import {validate} from "class-validator";

@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
    ) {}

    @Post('crear')
    async crearUsuario(
        @Body() usuario: Usuarios,
    ): Promise<void> {
        const usuarioCreateDto = new usuariosCreateDto();
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

}
