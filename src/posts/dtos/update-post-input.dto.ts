import { IsOptional, IsString } from 'class-validator';

export class UpdatePostInputDto {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	content?: string;
}
