import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CabeceraCarrito} from "./cabecera-carrito.entity";
import {CabeceraCarritoService} from "./cabecera-carrito.service";
import {CabeceraCarritoController} from "./cabecera-carrito.controller";
import {UsuariosModule} from "../usuarios/usuarios.module";
import { Usuarios } from '../usuarios/usuarios.entity';
import {DetalleCarritoModule} from "../detalle-carrito/detalle-carrito.module";

@Module({
    imports: [
        UsuariosModule,
        forwardRef(() => DetalleCarritoModule),
        TypeOrmModule
            .forFeature([
                CabeceraCarrito,
                Usuarios
            ])
    ],

    providers:[CabeceraCarritoService],
    controllers:[CabeceraCarritoController],
    exports: [CabeceraCarritoService]
})
export class CabeceraCarritoModule {}
