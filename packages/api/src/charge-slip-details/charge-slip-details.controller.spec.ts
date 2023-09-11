import { Test, TestingModule } from '@nestjs/testing';
import { ChargeSlipDetailsController } from './charge-slip-details.controller';
import { ChargeSlipDetailsService } from './charge-slip-details.service';

describe('ChargeSlipDetailsController', () => {
  let controller: ChargeSlipDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargeSlipDetailsController],
      providers: [ChargeSlipDetailsService],
    }).compile();

    controller = module.get<ChargeSlipDetailsController>(ChargeSlipDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
