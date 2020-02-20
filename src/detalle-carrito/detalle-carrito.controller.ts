import {Body, Controller, Delete, Get, Post, Put, Query, Session} from '@nestjs/common';
import {DetalleCarritoService} from "./detalle-carrito.service";
import {DetalleCarritoCreateDto} from "./detalle-carrito-create.dto";
import {DetalleCarrito} from "./detalle-carrito.entity";
import {validate} from "class-validator";
import {UsuariosService} from "../usuarios/usuarios.service";
import {CabeceraCarritoService} from "../cabecera-carrito/cabecera-carrito.service";

@Controller('detalle-carrito')
export class DetalleCarritoController {
    constructor(
        private readonly detalleCarritoService: DetalleCarritoService,
        private readonly usuarioService: UsuariosService,
        private readonly cabeceraCarritoService: CabeceraCarritoService,
    ) {
    }

    @Post('crear')
    async crearDetalleCarrito(
        @Body() detalleCarrito: DetalleCarrito,
        @Session() session
    ): Promise<void> {
        const detalleCarritoCreateDto = new DetalleCarritoCreateDto();
        detalleCarritoCreateDto.cantidad = detalleCarrito.cantidad;
        detalleCarritoCreateDto.precio = detalleCarrito.precio;
        const errores = await validate(detalleCarritoCreateDto);
        console.error(errores);
        if(errores.length > 0){

        } else{
            try{
                const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado"});
                if(! carritoActual) {
                    const usuario = await this.usuarioService.encontrarUsuario(session.usuario.userId);
                    detalleCarrito.subtotal = this.detalleCarritoService.calcularSubtotal(detalleCarrito.cantidad, detalleCarrito.precio);
                    const cabeceraCarrito = await this.cabeceraCarritoService.crearCabeceraCarrito(usuario, detalleCarrito);
                    await this.detalleCarritoService
                        .crearDetalleCarrito(
                            detalleCarrito
                        );
                    session.carritoActual = cabeceraCarrito.id;
                } else{
                    carritoActual[0].detalle.push(detalleCarrito);
                    carritoActual[0].total = this.cabeceraCarritoService.actualizarTotal(carritoActual[0]);
                    await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0])

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
