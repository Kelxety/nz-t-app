import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenEntity {
  @ApiProperty()
  refreshToken: string;
}
