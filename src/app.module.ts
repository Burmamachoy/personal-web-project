import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerosController } from './generos/generos.controller';
import { AnimesController } from './animes/animes.controller';
import { GenerosModule } from './generos/generos.module';
import { AnimesModule } from './animes/animes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Animes } from './animes/animes.entity';
import { Generos } from './generos/generos.entity';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosModule } from './usuarios/usuarios.module';
import {Usuarios} from "./usuarios/usuarios.entity";
import { AuthModule } from './auth/auth.module';
import {Roles} from "./usuarios/roles.entity";
import { DetalleCarritoController } from './detalle-carrito/detalle-carrito.controller';
import { CabeceraCarritoController } from './cabecera-carrito/cabecera-carrito.controller';
import { CabeceraCarritoService } from './cabecera-carrito/cabecera-carrito.service';
import { DetalleCarritoService } from './detalle-carrito/detalle-carrito.service';
import { DetalleCarritoModule } from './detalle-carrito/detalle-carrito.module';
import { CabeceraCarritoModule } from './cabecera-carrito/cabecera-carrito.module';
import { CabeceraCarrito } from './cabecera-carrito/cabecera-carrito.entity';
import { DetalleCarrito } from './detalle-carrito/detalle-carrito.entity';

@Module({
  imports: [
    GenerosModule,
    AnimesModule,
    UsuariosModule,
    AuthModule,
    DetalleCarritoModule,
    CabeceraCarritoModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.17.0.2',
      port: 3306,
      username: 'jdjuxx',
      password: '1234',
      database: 'personal_project',
      dropSchema:true,
      entities: [
        Animes,
        Generos,
        Usuarios,
        Roles,
        CabeceraCarrito,
        DetalleCarrito],
      synchronize: true,
    }),
  ],
  controllers: [AppController, GenerosController, AnimesController, UsuariosController, DetalleCarritoController, CabeceraCarritoController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
