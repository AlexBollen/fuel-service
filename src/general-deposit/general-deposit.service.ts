import { Injectable } from '@nestjs/common';
import { CreateGeneralDepositDto } from './dto/create-general-deposit.dto';
import { UpdateGeneralDepositDto } from './dto/update-general-deposit.dto';

@Injectable()
export class GeneralDepositService {
  create(createGeneralDepositDto: CreateGeneralDepositDto) {
    return 'This action adds a new generalDeposit';
  }

  findAll() {
    return `This action returns all generalDeposit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generalDeposit`;
  }

  update(id: number, updateGeneralDepositDto: UpdateGeneralDepositDto) {
    return `This action updates a #${id} generalDeposit`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalDeposit`;
  }
}
