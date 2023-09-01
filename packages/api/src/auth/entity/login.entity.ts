import { ApiProperty } from '@nestjs/swagger';

export class LoginEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  userId: string;
}
