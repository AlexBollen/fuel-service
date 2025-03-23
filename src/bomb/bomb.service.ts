import { Injectable } from '@nestjs/common';
import { CreateBombDto } from './dto/create-bomb.dto';
import { UpdateBombDto } from './dto/update-bomb.dto';

@Injectable()
export class BombService {
  create(createBombDto: CreateBombDto) {
    return 'This action adds a new bomb';
  }

  findAll() {
    return `This action returns all bomb`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bomb`;
  }

  update(id: number, updateBombDto: UpdateBombDto) {
    return `This action updates a #${id} bomb`;
  }

  remove(id: number) {
    return `This action removes a #${id} bomb`;
  }
}
