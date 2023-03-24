import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserInputDto } from '@/users/dtos';
import { UsersService } from '@/users/users.service';
import { AuthService } from './auth.service';
import { User } from './decorators';
import { RegisterUserOutputDto } from './dtos';
import { UserEntityDto } from './dtos/user-entity.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { UserModel } from '@/users/models/user.model';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	async login(
		@User() user: Omit<UserModel, 'password'>,
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		const { accessToken } = await this.authService.login(user.email, user.id);

		res.cookie('access_token', accessToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			secure: false, // in production this should be true
			sameSite: 'strict',
		});
	}

	@Post('register')
	async register(
		@Body() createUserDto: CreateUserInputDto,
	): Promise<RegisterUserOutputDto> {
		return this.usersService.createUser(createUserDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async me(@User('userId') userId: string): Promise<UserEntityDto> {
		const user = await this.usersService.findUserById(userId);

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			posts: user.posts.map((post) => ({
				id: post.id,
				title: post.title,
				content: post.content,
				createdAt: post.createdAt.toISOString(),
				updatedAt: post.updatedAt.toISOString(),
			})),
		};
	}
}
