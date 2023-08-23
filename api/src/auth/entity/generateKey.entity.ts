import { ApiProperty } from '@nestjs/swagger';

export class GenerateKeyEntity {
  @ApiProperty()
  accessToken: string;
}
