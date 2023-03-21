import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
	imports: [UsersModule, PassportModule, PassportModule, JwtModule],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService],
	exports: [AuthService],
})
export class AuthModule {}
