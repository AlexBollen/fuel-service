import { Module } from '@nestjs/common';
import { BombService } from './bomb.service';
import { BombController } from './bomb.controller';

@Module({
  controllers: [BombController],
  providers: [BombService],
})
export class BombModule {}
