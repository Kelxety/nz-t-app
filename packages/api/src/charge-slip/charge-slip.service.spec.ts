import { Test, TestingModule } from '@nestjs/testing';
import { ChargeSlipService } from './charge-slip.service';

describe('ChargeSlipService', () => {
  let service: ChargeSlipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChargeSlipService],
    }).compile();

    service = module.get<ChargeSlipService>(ChargeSlipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
