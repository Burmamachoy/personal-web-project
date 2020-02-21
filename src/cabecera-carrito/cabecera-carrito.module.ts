import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CabeceraCarrito} from "./cabecera-carrito.entity";
import {CabeceraCarritoService} from "./cabecera-carrito.service";
import {CabeceraCarritoController} from "./cabecera-carrito.controller";
import {UsuariosModule} from "../usuarios/usuarios.module";
import { Usuarios } from '../usuarios/usuarios.entity';

@Module({
    imports: [
        UsuariosModule,
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
