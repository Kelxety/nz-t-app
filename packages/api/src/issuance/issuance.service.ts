import { Injectable } from '@nestjs/common';
import { CreateIssuanceDto } from './dto/create-issuance.dto';
import { UpdateIssuanceDto } from './dto/update-issuance.dto';

@Injectable()
export class IssuanceService {
  create(createIssuanceDto: CreateIssuanceDto) {
    return 'This action adds a new issuance';
  }

  findAll() {
    return `This action returns all issuance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} issuance`;
  }

  update(id: number, updateIssuanceDto: UpdateIssuanceDto) {
    return `This action updates a #${id} issuance`;
  }

  remove(id: number) {
    return `This action removes a #${id} issuance`;
  }
}
