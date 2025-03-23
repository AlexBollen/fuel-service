import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BombService } from './bomb.service';
import { CreateBombDto } from './dto/create-bomb.dto';
import { UpdateBombDto } from './dto/update-bomb.dto';

@Controller('bomb')
export class BombController {
  constructor(private readonly bombService: BombService) {}

  @Post()
  create(@Body() createBombDto: CreateBombDto) {
    return this.bombService.create(createBombDto);
  }

  @Get()
  findAll() {
    return this.bombService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bombService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBombDto: UpdateBombDto) {
    return this.bombService.update(+id, updateBombDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bombService.remove(+id);
  }
}
