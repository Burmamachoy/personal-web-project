import {Body, Controller, Post} from '@nestjs/common';
import {GenerosService} from "./generos.service";
import {Generos} from "./generos.entity";
import {generosCreateDto} from "./generos.create-dto";
import {validate} from "class-validator";

@Controller('generos')
export class GenerosController {
    constructor(
        private readonly  generosService: GenerosService
    ) {}

    @Post('crear')
    async crearGenero(
        @Body() genero: Generos,
    ): Promise<void> {
        const generoCreateDTO = new generosCreateDto();
        generoCreateDTO.nombre = genero.nombre;
        generoCreateDTO.descripcion = genero.descripcion;
        generoCreateDTO.publicoPrincipal = genero.publicoPrincipal;
        const errores = await validate(generoCreateDTO);
        console.error(errores);
        if (errores.length > 0) {

        } else {
            try{
                await this.generosService
                    .crearGenero(
                        genero,
                    );

            } catch(error){
                console.error(error)
            }
        }
    }
}
