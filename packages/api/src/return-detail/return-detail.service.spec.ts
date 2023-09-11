import { Test, TestingModule } from '@nestjs/testing';
import { ReturnDetailService } from './return-detail.service';

describe('ReturnDetailService', () => {
  let service: ReturnDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnDetailService],
    }).compile();

    service = module.get<ReturnDetailService>(ReturnDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
