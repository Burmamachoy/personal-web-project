import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DetalleCarrito} from "./detalle-carrito.entity";
import {DetalleCarritoService} from "./detalle-carrito.service";
import {DetalleCarritoController} from "./detalle-carrito.controller";
import {UsuariosModule} from "../usuarios/usuarios.module";
import {CabeceraCarritoModule} from "../cabecera-carrito/cabecera-carrito.module";

@Module({
    imports: [
        UsuariosModule,
        CabeceraCarritoModule,
        TypeOrmModule
            .forFeature([
                DetalleCarrito
            ])
    ],
    providers:[DetalleCarritoService],
    controllers:[DetalleCarritoController],
    exports: [DetalleCarritoService]

})
export class DetalleCarritoModule {}
