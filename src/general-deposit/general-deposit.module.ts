import { Module } from '@nestjs/common';
import { GeneralDepositService } from './general-deposit.service';
import { GeneralDepositController } from './general-deposit.controller';

@Module({
  controllers: [GeneralDepositController],
  providers: [GeneralDepositService],
})
export class GeneralDepositModule {}
