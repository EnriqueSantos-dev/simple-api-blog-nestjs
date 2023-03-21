import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.getJwtFromRequest,
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}

	async validate(payload: any): Promise<any> {
		return { userId: payload.sub, email: payload.email };
	}

	static getJwtFromRequest(req: Request): string | null {
		return req.cookies['access_token'] ?? null;
	}
}
