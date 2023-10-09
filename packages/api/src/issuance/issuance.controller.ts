import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IssuanceService } from './issuance.service';
import { CreateIssuanceDto } from './dto/create-issuance.dto';
import { UpdateIssuanceDto } from './dto/update-issuance.dto';

@Controller('issuance')
export class IssuanceController {
  constructor(private readonly issuanceService: IssuanceService) {}

  @Post()
  create(@Body() createIssuanceDto: CreateIssuanceDto) {
    return this.issuanceService.create(createIssuanceDto);
  }

  @Get()
  findAll() {
    return this.issuanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssuanceDto: UpdateIssuanceDto) {
    return this.issuanceService.update(+id, updateIssuanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuanceService.remove(+id);
  }
}
