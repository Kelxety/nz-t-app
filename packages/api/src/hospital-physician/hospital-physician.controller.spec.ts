import { Test, TestingModule } from '@nestjs/testing';
import { HospitalPhysicianController } from './hospital-physician.controller';
import { HospitalPhysicianService } from './hospital-physician.service';

describe('HospitalPhysicianController', () => {
  let controller: HospitalPhysicianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalPhysicianController],
      providers: [HospitalPhysicianService],
    }).compile();

    controller = module.get<HospitalPhysicianController>(
      HospitalPhysicianController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
