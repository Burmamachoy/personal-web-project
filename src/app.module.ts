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

@Module({
  imports: [
    GenerosModule,
    AnimesModule,
    UsuariosModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.17.0.2',
      port: 3306,
      username: 'jdjuxx',
      password: '1234',
      database: 'personal_project',
      dropSchema:true,
      entities: [Animes, Generos, Usuarios],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController, GenerosController, AnimesController, UsuariosController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
