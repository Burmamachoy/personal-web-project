import { Module } from '@nestjs/common';
import { GenerosService } from './generos.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Generos} from "./generos.entity";
import {GenerosController} from "./generos.controller";

@Module({
  imports:[
    TypeOrmModule
        .forFeature([
          Generos
        ])
  ],
  providers: [GenerosService],
  controllers: [GenerosController],
  exports: [GenerosService]
})
export class GenerosModule {}
