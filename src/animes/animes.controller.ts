import {Body, Controller, Delete, Param, Post} from '@nestjs/common';
import {AnimesService} from "./animes.service";
import {Animes} from "./animes.entity";
import {AnimesCreateDto} from "./animes-create.dto";
import {validate} from "class-validator";
import {DeleteResult} from "typeorm";
import {AnimesUpdateDto} from "./animes-update-dto";

@Controller('animes')
export class AnimesController {
    constructor(
        private readonly animesService: AnimesService,
    ) {}

    @Post('crear')
    async crearAnime(
        @Body() anime: Animes,
    ): Promise<void> {
        const animeCreateDTO = new AnimesCreateDto();
        animeCreateDTO.nombre = anime.nombre;
        animeCreateDTO.anioLanzamiento = anime.anioLanzamiento;
        animeCreateDTO.estudio = anime.estudio;
        animeCreateDTO.numeroEpisodios = anime.numeroEpisodios;
        animeCreateDTO.director = anime.director;
        const errores = await validate(animeCreateDTO);
        console.error(errores);
        if (errores.length > 0) {

        } else {
            try{
                await this.animesService
                    .crearAnime(
                        anime,
                    );

            } catch(error){
                console.error(error)
            }
        }

    }

    @Post(':id')
    async actualizarAnime(
        @Body() anime: Animes,
        @Param('id') id: string,
    ): Promise<void> {
        const animeUpdateDTO = new AnimesUpdateDto();
        animeUpdateDTO.nombre = anime.nombre;
        animeUpdateDTO.anioLanzamiento = anime.anioLanzamiento;
        animeUpdateDTO.estudio = anime.estudio;
        animeUpdateDTO.numeroEpisodios = anime.numeroEpisodios;
        animeUpdateDTO.director = anime.director;
        animeUpdateDTO.id = +id;
        const errores = await validate(animeUpdateDTO)
        if(errores.length > 0){

        } else{
            await  this.animesService
                .actualizarAnime(
                    +id,
                    anime,
                )
        }

    }

    @Delete(':id')
    eliminarAnime(
        @Param('id') id: string,
    ): Promise<DeleteResult> {
        return this.animesService
            .borrarAnime(
                +id,
            )
    }

}
