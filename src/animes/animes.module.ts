import { Module } from '@nestjs/common';
import { AnimesService } from './animes.service';
import {AnimesController} from "./animes.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Animes} from "./animes.entity";
import { GenerosModule } from '../generos/generos.module';
import {PassportModule} from "@nestjs/passport";

@Module({
  imports:[
      GenerosModule,
      PassportModule,
      TypeOrmModule
          .forFeature([
              Animes
          ])
  ],
  providers: [AnimesService],
  controllers: [AnimesController],
  exports: [AnimesService]
})
export class AnimesModule {}
