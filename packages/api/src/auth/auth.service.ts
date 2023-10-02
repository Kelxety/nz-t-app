import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from '@api/lib/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { roundsOfHashing, UsersService } from '@api/users/users.service';
import { Role, User, UserStatus } from '@prisma/client';
import { LoginEntity } from './entity/login.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(createAuthDto: Partial<LoginDto>): Promise<LoginEntity> {
    const user = await this.prisma.user.findUnique({
      include: {
        refresh_token: true,
        role: true,
      },
      where: { username: createAuthDto.username, status: UserStatus.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException(
        `User with username of ${createAuthDto.username}`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect!');
    }
    const roles = user.role.map(
      (individualRole: { userId: string; roleId: string }) => {
        return individualRole;
      },
    );

    const accessToken = this.jwtService.sign({
      userId: user.id,
      username: user.username,
      role: roles,
    });

    // this.createAccessTokenFromRefreshToken(accessToken);
    return {
      accessToken: accessToken,
      refreshToken: this.jwtService.sign({
        username: user.username,
        role: roles,
      }),
      userId: user.id,
    };
  }

  async signup(signupAuthDto: SignupDto): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      include: {
        refresh_token: true,
        role: true,
      },
      where: { username: signupAuthDto.username },
    });

    if (user) {
      throw new ConflictException(
        `User with username of ${signupAuthDto.username} is already signed up`,
      );
    }
    const hashedPassword = await bcrypt.hash(
      signupAuthDto.password,
      roundsOfHashing,
    );
    signupAuthDto.password = hashedPassword;

    const userCount: number = await this.usersService.findLength();
    let userCreated: User;
    if (userCount === 0) {
      userCreated = await this.prisma.user.create({
        data: {
          ...signupAuthDto,
          role: {
            create: {
              role: {
                create: {
                  roleName: 'SUPERADMIN',
                },
              },
            },
          },
        },
      });
    } else {
      userCreated = await this.prisma.user.create({
        data: {
          ...signupAuthDto,
          role: {},
        },
      });
    }

    const getUser = await this.usersService.findOne(userCreated.id);

    if (!getUser) throw new NotFoundException();

    if (!getUser.role) {
      throw new Error('Error getting role');
    }
    const roles = getUser.role.map(
      (individualRole: { userId: string; roleId: string }) => {
        return individualRole;
      },
    );
    const accessToken = this.jwtService.sign({
      userId: getUser.id,
      username: getUser.username,
      role: roles,
    });
    const refreshToken = this.jwtService.sign({
      username: getUser.username,
      role: roles,
    });
    this.setCurrentRefreshToken(refreshToken, getUser.id);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as {
      userId: string;
      username: string;
      role: Role;
    };
    if (!decoded) {
      throw new Error();
    }
    const user = await this.usersService.findByUsername(decoded.username);
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refresh_token?.refresh_token || '',
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid Token');
    }

    await this.jwtService.verifyAsync(
      refreshToken,
      this.getRefreshTokenOptions(),
    );

    return {
      token: this.jwtService.sign({
        userId: user.id,
        username: user.username,
        role: user.role,
      }),
    };
  }

  getRefreshTokenOptions(): JwtSignOptions {
    return this.getTokenOptions();
  }

  private getTokenOptions() {
    const options: JwtSignOptions = {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    };

    return options;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    this.createRefreshToken(currentHashedRefreshToken, userId);
    // return await this.usersService.update(userId, {
    //   refreshToken: currentHashedRefreshToken,
    // });
  }

  async removeRefreshToken(id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.usersService.update(id, {
      refreshToken: undefined,
      role: null,
    });
  }

  async createRefreshToken(refreshToken: string, id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const findRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId: id },
    });
    const dateNow = new Date();
    const millisecondsToAdd = process.env.REFRESH_TOKEN_EXPIRATION;
    dateNow.setMilliseconds(
      dateNow.getMilliseconds() + Number(millisecondsToAdd),
    );
    const newTimeStamp = dateNow;
    if (!findRefreshToken) {
      return await this.prisma.refreshToken.create({
        data: {
          refresh_token: refreshToken,
          username: user.username,
          validity: newTimeStamp,
          system_user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } else {
      return await this.prisma.refreshToken.update({
        where: {
          id: findRefreshToken.id,
        },
        data: {
          refresh_token: refreshToken,
          username: user.username,
          validity: newTimeStamp,
          system_user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
    // let verify = false;
    // if (newTimeStamp > new Date()) {
    //   verify = false;
    // }
  }

  async refresh(token: string) {
    if (!token) throw new UnauthorizedException('Not Authorized');
    const decoded = this.jwtService.decode(token) as {
      userId: string;
      username: string;
      role: Role;
    };
    if (!decoded) {
      throw new Error();
    }
    const user = await this.usersService.findOne(decoded.userId);
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user.refresh_token?.validity) {
      return;
    }
    if (user.refresh_token.validity > new Date()) {
      const roles = user.role.map(
        (individualRole: { userId: string; roleId: string }) => {
          return individualRole;
        },
      );
      const accessToken = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        role: roles,
      });
      return accessToken;
    }
  }
}
