import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInputDto } from './dtos';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async validateUser(email: string, password: string): Promise<UserModel> {
		const user = await this.prisma.user.findUnique({
			include: { posts: true },
			where: { email },
		});

		if (!user) return null;

		const passwordsMatch = await bcrypt.compare(password, user.password);

		if (!passwordsMatch) return null;

		return user;
	}

	async findUserByEmail(email: string): Promise<UserModel | undefined> {
		return await this.prisma.user.findUnique({
			include: { posts: true },
			where: { email },
		});
	}

	async findUserById(id: string): Promise<UserModel | undefined> {
		return await this.prisma.user.findUnique({
			include: { posts: true },
			where: { id },
		});
	}

	async createUser({
		email,
		name,
		password,
	}: CreateUserInputDto): Promise<Omit<UserModel, 'password'>> {
		const conflictingUser = await this.findUserByEmail(email);

		if (conflictingUser) throw new ConflictException('Email already in use');

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
			},
		});

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			posts: [],
		};
	}
}
