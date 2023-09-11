import { Test, TestingModule } from '@nestjs/testing';
import { HospitalPatientTypeController } from './hospital-patient-type.controller';
import { HospitalPatientTypeService } from './hospital-patient-type.service';

describe('HospitalPatientTypeController', () => {
  let controller: HospitalPatientTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalPatientTypeController],
      providers: [HospitalPatientTypeService],
    }).compile();

    controller = module.get<HospitalPatientTypeController>(
      HospitalPatientTypeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
