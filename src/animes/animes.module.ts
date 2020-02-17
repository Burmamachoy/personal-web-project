import { Module } from '@nestjs/common';
import { AnimesService } from './animes.service';

@Module({
  providers: [AnimesService]
})
export class AnimesModule {}
