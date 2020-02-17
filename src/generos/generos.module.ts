import { Module } from '@nestjs/common';
import { GenerosService } from './generos.service';

@Module({
  providers: [GenerosService]
})
export class GenerosModule {}
