import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenEntity {
  @ApiProperty()
  accessToken: string;
}
