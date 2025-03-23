import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneralDepositService } from './general-deposit.service';
import { CreateGeneralDepositDto } from './dto/create-general-deposit.dto';
import { UpdateGeneralDepositDto } from './dto/update-general-deposit.dto';

@Controller('general-deposit')
export class GeneralDepositController {
  constructor(private readonly generalDepositService: GeneralDepositService) {}

  @Post()
  create(@Body() createGeneralDepositDto: CreateGeneralDepositDto) {
    return this.generalDepositService.create(createGeneralDepositDto);
  }

  @Get()
  findAll() {
    return this.generalDepositService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalDepositService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralDepositDto: UpdateGeneralDepositDto) {
    return this.generalDepositService.update(+id, updateGeneralDepositDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalDepositService.remove(+id);
  }
}
