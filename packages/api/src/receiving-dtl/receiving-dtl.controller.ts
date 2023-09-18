import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateReceivingDtlDto } from './dto/create-receiving-dtl.dto';
import { UpdateReceivingDtlDto } from './dto/update-receiving-dtl.dto';
import { ReceivingDtlService } from './receiving-dtl.service';

@Controller('receiving-dtl')
@ApiTags('scm_receiving_dtl')
export class ReceivingDtlController {
  constructor(private readonly receivingDtlService: ReceivingDtlService) { }

  @Post()
  create(@Body() createReceivingDtlDto: CreateReceivingDtlDto) {
    return this.receivingDtlService.create(createReceivingDtlDto);
  }

  @Get()
  findAll() {
    return this.receivingDtlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivingDtlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceivingDtlDto: UpdateReceivingDtlDto) {
    return this.receivingDtlService.update(+id, updateReceivingDtlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receivingDtlService.remove(+id);
  }
}
