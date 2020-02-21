import { Body, Controller, Delete, Get, Param, Post, Put, Query, Session } from '@nestjs/common';
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
                    //detalleCarrito.cabecera = carritoActual[0];
                    carritoActual[0].detalle.push(detalleCarrito);
                    await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);

                    await this.detalleCarritoService.crearDetalleCarrito(detalleCarrito);

                    carritoActual[0].total = this.cabeceraCarritoService.actualizarTotal(carritoActual[0]);
                    await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);

                }

            }catch (error){
                console.error(error)
            }
        }
    }

    @Put('actualizar')
    async actualizarDetalleCarrito(
    @Query('nombreAnime') nombreAnime: string,
    @Query('cantidad') cantidad: string | number,
    ) {
        const detalle = await this.detalleCarritoService.buscarDetalles({nombreAnime: nombreAnime})
        if(cantidad > 0) {
            detalle[0].cantidad = +cantidad;
            this.detalleCarritoService.calcularSubtotal(detalle[0].cantidad, detalle[0].precio)
            await this.detalleCarritoService.actualizarDetalle(detalle[0]);
        } else{
            //Mostrar error
        }

    }

    @Delete('eliminar')
    async  borrarDetalleCarrrito(
        @Query('nombreAnime') nombreAnime: string,
    ) {
        const detalle = await this.detalleCarritoService.buscarDetalles({nombreAnime: nombreAnime})
        await this.detalleCarritoService.borrarDetalleCarrito(detalle[0].id);
    }

}
