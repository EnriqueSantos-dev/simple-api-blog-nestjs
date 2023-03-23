import { User } from '@/auth/decorators';
import { JwtAuthGuard } from '@/auth/guards';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import {
	CreatePostInputDto,
	CreatePostOutputDto,
	PostOutputDto,
	UpdatePostInputDto,
	UpdatePostOutputDto,
} from './dtos';
import { PostsService } from './posts.service';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	async createPost(
		@User('userId') authorId: string,
		@Body() createPostDto: CreatePostInputDto,
	): Promise<CreatePostOutputDto> {
		const post = await this.postsService.createPost({
			...createPostDto,
			authorId,
		});

		return {
			id: post.id,
			content: post.content,
			title: post.title,
			createAt: post.createdAt.toISOString(),
		};
	}

	@Put('update/:id')
	async updatePost(
		@Param('id') id: string,
		@Body() updatePostDto: UpdatePostInputDto,
	): Promise<UpdatePostOutputDto> {
		const post = await this.postsService.updatePost({ ...updatePostDto, id });

		return {
			id: post.id,
			content: post.content,
			title: post.title,
			createAt: post.createdAt.toISOString(),
			updateAt: post.updatedAt.toISOString(),
		};
	}

	@Delete('delete/:id')
	async deletePost(@Param('id') id: string): Promise<void> {
		return this.postsService.deletePost(id);
	}

	@Get()
	async getAllPosts(): Promise<PostOutputDto[]> {
		return this.postsService.getAllPosts();
	}

	@Get('author')
	async getPostsByAuthorId(
		@User('userId') authorId: string,
	): Promise<Omit<PostOutputDto, 'author'>[]> {
		return this.postsService.getPostsByAuthorId(authorId);
	}

	@Get(':id')
	async getPostById(@Param('id') id: string): Promise<PostOutputDto> {
		return this.postsService.getPostById(id);
	}

	@Patch('publish/:id')
	async publishPost(@Param('id') id: string): Promise<void> {
		return this.postsService.publishPost(id);
	}
}
