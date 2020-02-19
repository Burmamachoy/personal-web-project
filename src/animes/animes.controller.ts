import {Body, Controller, Post} from '@nestjs/common';
import {AnimesService} from "./animes.service";
import {Animes} from "./animes.entity";
import {animesCreateDto} from "./animes.create-dto";
import {validate} from "class-validator";

@Controller('animes')
export class AnimesController {
    constructor(
        private readonly animesService: AnimesService,
    ) {}

    @Post('crear')
    async crearAnime(
        @Body() anime: Animes,
    ): Promise<void> {
        const animeCreateDTO = new animesCreateDto();
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



}
