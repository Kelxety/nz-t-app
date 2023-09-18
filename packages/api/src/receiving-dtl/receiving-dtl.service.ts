import { Injectable } from '@nestjs/common';
import { CreateReceivingDtlDto } from './dto/create-receiving-dtl.dto';
import { UpdateReceivingDtlDto } from './dto/update-receiving-dtl.dto';

@Injectable()
export class ReceivingDtlService {
  create(createReceivingDtlDto: CreateReceivingDtlDto) {
    return 'This action adds a new receivingDtl';
  }

  findAll() {
    return `This action returns all receivingDtl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receivingDtl`;
  }

  update(id: number, updateReceivingDtlDto: UpdateReceivingDtlDto) {
    return `This action updates a #${id} receivingDtl`;
  }

  remove(id: number) {
    return `This action removes a #${id} receivingDtl`;
  }
}
