import { Test, TestingModule } from '@nestjs/testing';
import { HospitalOfficeController } from './hospital-office.controller';
import { HospitalOfficeService } from './hospital-office.service';

describe('HospitalOfficeController', () => {
  let controller: HospitalOfficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalOfficeController],
      providers: [HospitalOfficeService],
    }).compile();

    controller = module.get<HospitalOfficeController>(HospitalOfficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
