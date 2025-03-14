import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GeneralDepositService } from './general-deposit.service';
import { CreateGeneralDepositDto } from './dto/create-general-deposit.dto';
import { UpdateGeneralDepositDto } from './dto/update-general-deposit.dto';

@Controller()
export class GeneralDepositController {
  constructor(private readonly generalDepositService: GeneralDepositService) {}

  @MessagePattern('createGeneralDeposit')
  create(@Payload() createGeneralDepositDto: CreateGeneralDepositDto) {
    return this.generalDepositService.create(createGeneralDepositDto);
  }

  @MessagePattern('findAllGeneralDeposit')
  findAll() {
    return this.generalDepositService.findAll();
  }

  @MessagePattern('findOneGeneralDeposit')
  findOne(@Payload() id: number) {
    return this.generalDepositService.findOne(id);
  }

  @MessagePattern('updateGeneralDeposit')
  update(@Payload() updateGeneralDepositDto: UpdateGeneralDepositDto) {
    return this.generalDepositService.update(updateGeneralDepositDto.id, updateGeneralDepositDto);
  }

  @MessagePattern('removeGeneralDeposit')
  remove(@Payload() id: number) {
    return this.generalDepositService.remove(id);
  }
}
