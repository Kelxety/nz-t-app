import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SignupEntity } from './entity/signup.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GetUserDto } from './dto/getUser.dto';
import { AccessTokenEntity } from './entity/accessToken.entity';
import { RefreshTokenEntity } from './entity/refreshToken.entity';
import { Exclude } from 'class-transformer';
import { Request as Req } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login_check')
  @Exclude()
  @ApiOkResponse({ type: AccessTokenEntity })
  async login(@Body() { username, password }: LoginDto) {
    const cookies = await this.authService.login({ username, password });
    if (!cookies) throw new Error();
    this.authService.setCurrentRefreshToken(
      cookies.refreshToken,
      cookies.userId,
    );

    return { token: cookies.accessToken };
  }

  @Post('signup')
  @ApiOkResponse({ type: SignupEntity })
  async signup(@Body() body: SignupDto) {
    const cookies = await this.authService.signup(body);
    return {
      message: `Signup successful`,
      data: { token: cookies.accessToken },
    };
  }

  @Post('refresh')
  @ApiOkResponse({ type: RefreshTokenEntity })
  async refresh(@Request() request: Req) {
    const token = request.body.token.split('Bearer ')[1];
    const data = await this.authService.refresh(token);
    return {
      token: data,
    };
    // return await this.authService.createAccessTokenFromRefreshToken(
    //   body.refreshToken,
    // );
  }

  @Delete('refresh/:id')
  @ApiOkResponse({ type: RefreshTokenEntity })
  async remove(@Param('id') id: string) {
    return await this.authService.removeRefreshToken(id);
  }

  @Get('logout')
  @ApiOperation({ description: 'Logout' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(@Body() user: GetUserDto) {
    const rempoveAccessToken = await this.authService.removeRefreshToken(
      user.id,
    );
    return {
      message: `Logout successful`,
      data: rempoveAccessToken,
    };
  }
}
