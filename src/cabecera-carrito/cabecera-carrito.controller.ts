import {Body, Controller, Post, Session} from '@nestjs/common';
import {CabeceraCarritoService} from "./cabecera-carrito.service";
import {CabeceraCarritoCreateDto} from "./cabecera-carrito-create.dto";
import {validate} from "class-validator";

@Controller('cabecera-carrito')
export class CabeceraCarritoController {
    constructor(
        private readonly  cabeceraCarritoService: CabeceraCarritoService
    ) {
    }

    @Post('comprar')
    async comprarCarrito(
        @Body() direccion: string,
        @Session() session,
    ) : Promise<void> {
        const cabeceraCarritoCreateDto = new CabeceraCarritoCreateDto();
        cabeceraCarritoCreateDto.direccion = direccion;
        const errores = await validate(cabeceraCarritoCreateDto)
        if(errores.length > 0){

        } else {
            const idCarrito = session.carritoActual;
            const carrito = await this.cabeceraCarritoService.encontrarCabeceraCarrito(idCarrito);
            carrito.estado = "comprado";
            await this.cabeceraCarritoService.actualizarCarrrito(carrito);
        }

    }

}
