import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostInputDto {
	@IsString()
	@IsNotEmpty()
	@Length(5, 100)
	title: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}
