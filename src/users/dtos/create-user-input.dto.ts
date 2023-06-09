import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserInputDto {
	@IsString()
	@IsNotEmpty()
	@Length(3, 30)
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 20)
	password: string;
}
