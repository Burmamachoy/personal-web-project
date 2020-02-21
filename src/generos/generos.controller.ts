import {Body, Controller, Delete, Get, Param, Post, Put, Query, Res, Session} from '@nestjs/common';
import {GenerosService} from "./generos.service";
import {Generos} from "./generos.entity";
import {GenerosCreateDto} from "./generos-create.dto";
import {validate} from "class-validator";
import {DeleteResult, Like} from "typeorm";
import {GenerosUpdateDto} from "./generos-update-dto";

@Controller('generos')
export class GenerosController {
    constructor(
        private readonly  generosService: GenerosService
    ) {}
    @Get('mostrar-generos')
    async mostrarGeneros(
        @Query('mensaje') mensaje:string,
        @Query('error') error: string,
        @Query('consultaGenero') consultaGenero: string,
        @Session() session,
        @Res() res,
    ){
        let consultaServicio;
        if(consultaGenero){
            consultaServicio = [
                {
                    nombre: Like('%' + consultaGenero + '%'),
                },
            ];
        }
        const generos = await this.generosService.buscarGenero(consultaServicio);
        res.render('genero/rutas/buscar-mostrar-genero',{
            datos:{
                mensaje,
                error,
                generos,
                session,
            },
        });
    }

    @Get('actualizar-genero/:id')
    async rutaActualizarGenero(
        @Query('error') error:string,
        @Param('id')id: string,
        @Res() res,
    ){
        const genero = await this.generosService.encontrarGenero(+id);
        res.render('genero/rutas/editar-genero',{
            datos:{
                genero,
                error,
            }
        })
    }

    @Get('crear-genero')
    rutaCrearGenero(
        @Query('error')error: string,
        @Res() res,
    ) {
        res.render('genero/rutas/crear-genero', {
            datos: {
                error,
            },
        });
    }

    @Post('crear')
    async crearGenero(
        @Body() genero: Generos,
        @Res() res,
    ): Promise<void> {
        const generoCreateDTO = new GenerosCreateDto();
        generoCreateDTO.nombre = genero.nombre;
        generoCreateDTO.descripcion = genero.descripcion;
        generoCreateDTO.publicoPrincipal = genero.publicoPrincipal;
        const errores = await validate(generoCreateDTO);
        console.error(errores);
        if (errores.length > 0) {
            res.redirect('/generos/crear-genero?error=Error Validando');
        } else {
            try{
                await this.generosService
                    .crearGenero(
                        genero,
                    );
                res.redirect('/generos/mostrar-generos/?mensaje=Genero '+genero.nombre+' creado con éxito')
            } catch(error){
                res.redirect('/generos/crear-genero?error=Error del Servidor');
            }
        }
    }

    @Post('actualizar/:id')
    async actualizarGenero(
        @Body() genero: Generos,
        @Param('id') id: string,
        @Res() res,
    ): Promise<void> {
        const generoUpdateDTO = new GenerosUpdateDto();
        generoUpdateDTO.nombre = genero.nombre;
        generoUpdateDTO.descripcion = genero.descripcion;
        generoUpdateDTO.publicoPrincipal = genero.publicoPrincipal;
        generoUpdateDTO.id = +id;
        const errores = await validate(generoUpdateDTO);
        if (errores.length > 0) {
            res.redirect('/generos/actualizar-genero/'+id+'?error=Error Validando');
        } else {
            try {
                await this.generosService
                    .actualizarGenero(
                        +id,
                        genero,
                    );
                res.redirect('/generos/mostrar-generos/?mensaje=Genero '+genero.nombre+' editado con éxito');
            }catch (e) {
                res.redirect('/generos/actualizar-genero/'+id+'?error=Error del Servidor');
            }
        }
    }

    @Post('eliminar/:id')
    async eliminarGenero(
        @Param('id') id: string,
        @Res() res,
    ): Promise<void> {
        const genero = await this.generosService.encontrarGenero(+id);
        try {
            await this.generosService
                .borrarGenero(
                    +id,
                );
            res.redirect('/generos/mostrar-generos/?mensaje=Genero '+genero.nombre+' Borrado');
        }catch (e) {
            res.redirect('/generos/mostrar-generos/?error=Error del Servidor');
        }
    }

    @Get(':id')
    obtenerGenero(
      @Param('id') id: string,
    ): Promise<Generos | undefined> {
        return this.generosService
          .encontrarGenero(
            Number(id),
          );
    }

    @Get()
    async buscarGeneros(
      @Query('skip') skip?: string | number,
      @Query('take') take?: string | number,
      @Query('where') where?: string,
      @Query('order') order?: string,
    ): Promise<Generos[]> {
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
        return this.generosService
          .buscarGenero(
            where,
            skip as number,
            take as number,
            order,
          );
    }

}
