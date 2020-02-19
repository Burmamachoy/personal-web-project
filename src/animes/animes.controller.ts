import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {AnimesService} from "./animes.service";
import {Animes} from "./animes.entity";
import {AnimesCreateDto} from "./animes-create.dto";
import {validate} from "class-validator";
import {DeleteResult} from "typeorm";
import {AnimesUpdateDto} from "./animes-update-dto";
import { GenerosService } from '../generos/generos.service';
import { Generos } from '../generos/generos.entity';

@Controller('animes')
export class AnimesController {
    constructor(
        private readonly animesService: AnimesService,
        private readonly generosService: GenerosService
    ) {}

    @Post('crear/:id')
    async crearAnime(
        @Body() anime: Animes,
        @Param('id') id: string,
    ): Promise<void> {
        const animeCreateDTO = new AnimesCreateDto();
        animeCreateDTO.nombre = anime.nombre;
        animeCreateDTO.anioLanzamiento = anime.anioLanzamiento;
        animeCreateDTO.estudio = anime.estudio;
        animeCreateDTO.numeroEpisodios = anime.numeroEpisodios;
        animeCreateDTO.director = anime.director;
        animeCreateDTO.idGenero = +id;
        const errores = await validate(animeCreateDTO);
        console.error(errores);
        if (errores.length > 0) {

        } else {
            try{
                const genero = this.generosService.encontrarGenero(+id);
                if(await genero){
                    anime.generos = await genero;
                    await this.animesService
                      .crearAnime(
                        anime,
                      );
                } else{

                }

            } catch(error){
                console.error(error)
            }
        }

    }

    @Put(':id')
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
        const errores = await validate(animeUpdateDTO);
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

    @Get(':id')
    obtenerAnime(
      @Param('id') id: string,
    ): Promise<Animes | undefined> {
        return this.animesService
          .encontrarAnime(
            Number(id),
          );
    }

    @Get()
    async buscarAnimes(
      @Query('skip') skip?: string | number,
      @Query('take') take?: string | number,
      @Query('where') where?: string,
      @Query('order') order?: string,
    ): Promise<Animes[]> {
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
        return this.animesService
          .buscarAnime(
            where,
            skip as number,
            take as number,
            order,
          );
    }
}
