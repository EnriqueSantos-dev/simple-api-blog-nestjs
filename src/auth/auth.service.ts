import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { UserModel } from '@/users/models/user.model';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async validateUser(
		email: string,
		password: string,
	): Promise<Omit<UserModel, 'password'>> {
		const existingUser = await this.usersService.findUserByEmail(email);

		if (!existingUser) return null;

		const isPasswordValid = await bcrypt.compare(
			password,
			existingUser.password,
		);

		if (!isPasswordValid) return null;

		return {
			id: existingUser.id,
			name: existingUser.name,
			email: existingUser.email,
			posts: existingUser.posts,
		};
	}

	async login(email: string, userId: string) {
		const payload = { email, sub: userId };

		return {
			accessToken: this.jwtService.sign(payload, {
				secret: this.configService.get('JWT_SECRET'),
				expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
			}),
		};
	}
}
