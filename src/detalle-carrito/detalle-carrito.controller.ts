import {Body, Controller, Delete, Get, Param, Post, Put, Query, Res, Session} from '@nestjs/common';
import {DetalleCarritoService} from "./detalle-carrito.service";
import {DetalleCarritoCreateDto} from "./detalle-carrito-create.dto";
import {DetalleCarrito} from "./detalle-carrito.entity";
import {validate} from "class-validator";
import {UsuariosService} from "../usuarios/usuarios.service";
import {CabeceraCarritoService} from "../cabecera-carrito/cabecera-carrito.service";
import { AnimesService } from '../animes/animes.service';

@Controller('detalle-carrito')
export class DetalleCarritoController {
    constructor(
        private readonly detalleCarritoService: DetalleCarritoService,
        private readonly usuarioService: UsuariosService,
        private readonly cabeceraCarritoService: CabeceraCarritoService,
        private readonly animesService: AnimesService,
    ) {
    }

    @Post('crear/:idAnime')
    async crearDetalleCarrito(
        @Body('cantidad') cantidad: string,
        @Param('idAnime') idAnime: string,
        @Session() session
    ): Promise<void> {
        const detalleCarritoCreateDto = new DetalleCarritoCreateDto();
        detalleCarritoCreateDto.cantidad = +cantidad;
        detalleCarritoCreateDto.idAnime = +idAnime;
        const errores = await validate(detalleCarritoCreateDto);
        console.error(errores);
        if(errores.length > 0){

        } else{
            try{
                const detalleCarrito = new DetalleCarrito();
                const anime = await this.animesService.encontrarAnime(+idAnime);
                console.log(anime);
                detalleCarrito.cantidad = +cantidad;
                detalleCarrito.precio = anime.precio;
                detalleCarrito.anime = anime;
                detalleCarrito.subtotal = this.detalleCarritoService.calcularSubtotal(detalleCarrito.cantidad, detalleCarrito.precio);
                const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado"});
                if(! carritoActual[0]) {
                    const usuario = await this.usuarioService.encontrarUsuario(session.usuario.userId);
                    detalleCarrito.subtotal = this.detalleCarritoService.calcularSubtotal(detalleCarrito.cantidad, detalleCarrito.precio);
                    await this.detalleCarritoService.crearDetalleCarrito(detalleCarrito);
                    const cabeceraCarrito = await this.cabeceraCarritoService.crearCabeceraCarrito(usuario, detalleCarrito);
                    session.carritoActual = cabeceraCarrito.id;
                } else{
                    //verificar si existe el detalle
                    const anime = await this.animesService.encontrarAnime(+idAnime);
                    const detalle = await this.detalleCarritoService.buscarDetalles(anime);
                    console.log('El detalle');
                    console.log(idAnime)
                    console.log(detalle);
                    if(detalle.length == 0){
                        carritoActual[0].detalle.push(detalleCarrito);
                        await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);

                        await this.detalleCarritoService.crearDetalleCarrito(detalleCarrito);

                        carritoActual[0].total = this.cabeceraCarritoService.actualizarTotal(carritoActual[0]);
                        await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);
                    }
                    else{

                    }

                }

            }catch (error){
                console.error(error)
            }
        }
    }

    @Put('actualizar')
    async actualizarDetalleCarrito(
    @Query('idAnime') idAnime: string,
    @Query('cantidad') cantidad: string | number,
    ) {
        const anime = await this.animesService.encontrarAnime(+idAnime);
        const detalle = await this.detalleCarritoService.buscarDetalles(anime);
        if(+cantidad > 0) {
            detalle[0].cantidad = +cantidad;
            detalle[0].subtotal = this.detalleCarritoService.calcularSubtotal(detalle[0].cantidad, detalle[0].precio);

            await this.detalleCarritoService.actualizarDetalle(detalle[0]);

            const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado"});
            carritoActual[0].total = this.cabeceraCarritoService.actualizarTotal(carritoActual[0]);
            await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);

        } else{
            //Mostrar error
        }

    }

    @Delete('eliminar/:idAnime')
    async  borrarDetalleCarrrito(
        @Param('idAnime') idAnime : string,
    ) {
        const anime = await this.animesService.encontrarAnime(+idAnime);
        const detalle = await this.detalleCarritoService.buscarDetalles(anime);

        if(! detalle){
            await this.detalleCarritoService.borrarDetalleCarrito(detalle[0].id);
        }

    }

}
