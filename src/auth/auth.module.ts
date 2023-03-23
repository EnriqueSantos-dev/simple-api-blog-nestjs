import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
	imports: [UsersModule, PassportModule, PassportModule, JwtModule],
	providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
