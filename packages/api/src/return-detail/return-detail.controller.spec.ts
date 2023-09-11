import { Test, TestingModule } from '@nestjs/testing';
import { ReturnDetailController } from './return-detail.controller';
import { ReturnDetailService } from './return-detail.service';

describe('ReturnDetailController', () => {
  let controller: ReturnDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnDetailController],
      providers: [ReturnDetailService],
    }).compile();

    controller = module.get<ReturnDetailController>(ReturnDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
