import {Body, Controller, Delete, Param, Post} from '@nestjs/common';
import {GenerosService} from "./generos.service";
import {Generos} from "./generos.entity";
import {GenerosCreateDto} from "./generos-create.dto";
import {validate} from "class-validator";
import {DeleteResult} from "typeorm";
import {GenerosUpdateDto} from "./generos-update-dto";

@Controller('generos')
export class GenerosController {
    constructor(
        private readonly  generosService: GenerosService
    ) {}

    @Post('crear')
    async crearGenero(
        @Body() genero: Generos,
    ): Promise<void> {
        const generoCreateDTO = new GenerosCreateDto();
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

    @Post('actualizar/:id')
    async actualizarGenero(
        @Body() genero: Generos,
        @Param('id') id: string,
    ): Promise<void> {
        const generoUpdateDTO = new GenerosUpdateDto();
        generoUpdateDTO.nombre = genero.nombre;
        generoUpdateDTO.descripcion = genero.descripcion;
        generoUpdateDTO.publicoPrincipal = genero.publicoPrincipal;
        generoUpdateDTO.id = +id;
        const errores = await validate(generoUpdateDTO);
        if (errores.length > 0) {

        } else {
            await this.generosService
                .actualizarGenero(
                    +id,
                    genero,
                );
        }

    }

    @Delete('eliminar:id')
    eliminarGenero(
        @Param('id') id: string,
    ): Promise<DeleteResult> {
        return this.generosService
            .borrarGenero(
                +id,
            );
    }

}
