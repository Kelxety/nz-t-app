import { Test, TestingModule } from '@nestjs/testing';
import { ChargeSlipController } from './charge-slip.controller';
import { ChargeSlipService } from './charge-slip.service';

describe('ChargeSlipController', () => {
  let controller: ChargeSlipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargeSlipController],
      providers: [ChargeSlipService],
    }).compile();

    controller = module.get<ChargeSlipController>(ChargeSlipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
