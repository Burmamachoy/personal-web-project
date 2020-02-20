import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import {UsuariosController} from "./usuarios.controller";
import {Usuarios} from "./usuarios.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Roles} from "./roles.entity";

@Module({
  imports: [
    TypeOrmModule
        .forFeature([
            Usuarios,
            Roles,
            ])
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService]
})
export class UsuariosModule {}
