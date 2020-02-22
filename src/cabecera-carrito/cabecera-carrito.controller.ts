import {Body, Controller, Get, Param, Post, Query, Res, Session} from '@nestjs/common';
import {CabeceraCarritoService} from "./cabecera-carrito.service";
import {CabeceraCarritoCreateDto} from "./cabecera-carrito-create.dto";
import {validate} from "class-validator";
import {DetalleCarritoService} from "../detalle-carrito/detalle-carrito.service";

@Controller('cabecera-carrito')
export class CabeceraCarritoController {
    constructor(
        private readonly  cabeceraCarritoService: CabeceraCarritoService,
        private readonly detalleService:DetalleCarritoService
    ) {
    }

    @Get('mostrar-carrito/:id')
    async mostrarCarrito(
        @Param('id')idCarrito:string,
        @Query('error')error:string,
        @Query('mensaje')mensaje:string,
        @Res() res,
    ){
        const carrito = await this.cabeceraCarritoService.encontrarCabeceraCarrito(+idCarrito);
        if(!carrito){
            res.redirect('/generos/mostrar-generos?error=No tiene animes en el carrito');
        }else{
            const detalles = await this.detalleService.buscarDetalles({cabecera: carrito});
            res.render('carrito/rutas/buscar-mostrar-carrito',{
                datos:{
                    carrito,
                    detalles,
                    error,
                    mensaje,
                }
            });
        }

    }

    @Get('comprar-carrito/:id')
    async rutaComprarCarrito(
        @Param('id')idCarrito:string,
        @Query('error')error:string,
        @Res() res,
    ){
        const carrito = await this.cabeceraCarritoService.encontrarUno(+idCarrito);
        res.render('carrito/rutas/comprar-carrito',{
            datos:{
                carrito,
                error,
            }
        })
    }

    @Post('comprar')
    async comprarCarrito(
        @Body('direccion') direccion: string,
        @Session() session,
        @Res() res,
    ) : Promise<void> {
        const cabeceraCarritoCreateDto = new CabeceraCarritoCreateDto();
        cabeceraCarritoCreateDto.direccion = direccion;
        const errores = await validate(cabeceraCarritoCreateDto);
        console.log(errores);
        if(errores.length > 0){
            res.redirect('/cabecera-carrito/comprar-carrito/'+session.carrito+'?error=Error Validando');
        } else {
            try {
                const idCarrito = session.carritoActual;
                const carrito = await this.cabeceraCarritoService.encontrarCabeceraCarrito(idCarrito);
                carrito.direccion = direccion;
                carrito.estado = "comprado";
                carrito.fecha = new Date(Date.now());
                await this.cabeceraCarritoService.actualizarCarrrito(carrito);
                session.carritoActual = 0;
                res.redirect('/generos/mostrar-generos?mensaje=Ha comprado un nuevo producto');
            }catch (e) {
                res.redirect('/cabecera-carrito/comprar-carrito/'+session.carrito+'?error=Error del Servidor');
            }

        }

    }

}
