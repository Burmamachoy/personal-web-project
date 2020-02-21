import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards
} from '@nestjs/common';
import {AnimesService} from "./animes.service";
import {Animes} from "./animes.entity";
import {AnimesCreateDto} from "./animes-create.dto";
import {validate} from "class-validator";
import {DeleteResult, Like} from "typeorm";
import {AnimesUpdateDto} from "./animes-update-dto";
import { GenerosService } from '../generos/generos.service';
import { Roles } from '../role/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';

@Controller('animes')
@UseGuards(RoleGuard)
export class AnimesController {
    constructor(
        private readonly animesService: AnimesService,
        private readonly generosService: GenerosService
    ) {}

    @Get('mostrar-animes/:id')
    async mostrarAnime(
        @Param('id')idGenero:string,
        @Query('mensaje')mensaje:string,
        @Query('error')error:string,
        @Query('consultaAnime')consultaAnime:string,
        @Res() res,
    ){
        const genero = await this.generosService.encontrarGenero(+idGenero);
        let consultaServicio;
        if(consultaAnime){
            consultaServicio = [
                {
                    generos: genero,
                    nombre: Like('%' + consultaAnime + '%'),
                },
                {
                    generos: genero,
                    estudio: Like('%' + consultaAnime + '%'),
                },
            ];
        }else{
            consultaServicio = [
                {
                    generos: genero,
                },
            ]
        }
        const animes = await this.animesService.buscarAnime(consultaServicio);
        res.render('anime/rutas/buscar-mostrar-anime',{
            datos:{
                animes,
                genero,
                error,
                mensaje,
            }
        })
    }

    @Get('crear-anime/:id')
    rutaCrearAnime(
        @Param('id')idGenero:string,
        @Query('error')error:string,
        @Res() res,
    ){
        res.render(
            'anime/rutas/crear-anime',{
                datos: {
                    idGenero,
                    error,
                }
            }
        );
    }

    @Get('actualizar-anime/:id')
    async rutaActualizarAnime(
        @Param('error')error:string,
        @Param('id')idAnime:string,
        @Res() res,
    ){
        const anime = await this.animesService.encontrarAnime(+idAnime);
        res.render('anime/rutas/editar-anime',{
            datos: {
                anime,
                error,
            }
        })
    }

    @Post('crear/:id')
    // @Roles('administrador')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    async crearAnime(
        @Body() anime: Animes,
        @Param('id') id: string,
        @Res() res,
    ): Promise<void> {
        anime.anioLanzamiento = +anime.anioLanzamiento;
        anime.numeroEpisodios = +anime.numeroEpisodios;
        anime.precio = +anime.precio;
        const animeCreateDTO = new AnimesCreateDto();
        animeCreateDTO.nombre = anime.nombre;
        animeCreateDTO.anioLanzamiento = anime.anioLanzamiento;
        animeCreateDTO.estudio = anime.estudio;
        animeCreateDTO.numeroEpisodios = anime.numeroEpisodios;
        animeCreateDTO.director = anime.director;
        animeCreateDTO.precio = anime.precio;
        animeCreateDTO.idGenero = +id;
        const errores = await validate(animeCreateDTO);
        console.error(errores);
        if (errores.length > 0) {
            res.redirect('/animes/crear-anime/'+id+'?error=Error validando');
        } else {
            try{
                const genero = this.generosService.encontrarGenero(+id);
                if(await genero){
                    anime.generos = await genero;
                    await this.animesService
                      .crearAnime(
                        anime,
                      );
                    res.redirect('/animes/mostrar-animes/'+id+'?mensaje=Anime '+anime.nombre+' creado');
                } else{

                }
            } catch(error){
                res.redirect('/animes/crear-anime/'+id+'?error=Error del Servidor');
            }
        }

    }

    @Post('actualizar/:id')
    async actualizarAnime(
        @Body() anime: Animes,
        @Param('id') id: string,
        @Res() res,
    ): Promise<void> {
        anime.anioLanzamiento = +anime.anioLanzamiento;
        anime.numeroEpisodios = +anime.numeroEpisodios;
        anime.precio = +anime.precio;
        const animeUpdateDTO = new AnimesUpdateDto();
        animeUpdateDTO.nombre = anime.nombre;
        animeUpdateDTO.anioLanzamiento = anime.anioLanzamiento;
        animeUpdateDTO.estudio = anime.estudio;
        animeUpdateDTO.numeroEpisodios = anime.numeroEpisodios;
        animeUpdateDTO.director = anime.director;
        animeUpdateDTO.precio = anime.precio;
        animeUpdateDTO.id = +id;
        const errores = await validate(animeUpdateDTO);
        console.error(errores);
        const animeActual = await this.animesService.buscarAnime({id:+id});
        if(errores.length > 0){
            res.redirect('/animes/actualizar-anime/'+id+'?error=Error Validando');
        } else{
            try{
                await  this.animesService
                    .actualizarAnime(
                        +id,
                        anime,
                    );
                res.redirect('/animes/mostrar-animes/'+animeActual[0].generos.id+'?mensaje=Anime '+anime.nombre+' editado existosamente');
            }catch (e) {
                res.redirect('/animes/actualizar-anime/'+id+'?error=Error del Servidor');
            }
        }

    }

    @Post('eliminar/:id')
    async eliminarAnime(
        @Param('id') id: string,
        @Res() res,
    ): Promise<void> {
        const anime = await this.animesService.buscarAnime({id:+id});
        try{
            await this.animesService
                .borrarAnime(
                    +id,
                );
            res.redirect('/animes/mostrar-animes/'+anime[0].generos.id+'?mensaje=Anime '+anime[0].nombre+' fue eliminado');
        }catch (e) {
            res.redirect('/animes/mostrar-animes/'+anime[0].generos.id+'?error=Error del servidor');
        }

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
