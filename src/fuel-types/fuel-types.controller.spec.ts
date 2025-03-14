import { Test, TestingModule } from '@nestjs/testing';
import { FuelTypesController } from './fuel-types.controller';
import { FuelTypesService } from './fuel-types.service';

describe('FuelTypesController', () => {
  let controller: FuelTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelTypesController],
      providers: [FuelTypesService],
    }).compile();

    controller = module.get<FuelTypesController>(FuelTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
