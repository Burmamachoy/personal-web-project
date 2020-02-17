import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerosController } from './generos/generos.controller';
import { AnimesController } from './animes/animes.controller';
import { GenerosModule } from './generos/generos.module';
import { AnimesModule } from './animes/animes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
  imports: [
    GenerosModule,
    AnimesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.17.0.2',
      port: 3306,
      username: 'jdjuxx',
      password: '1234',
      database: 'personal_project',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController, GenerosController, AnimesController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
