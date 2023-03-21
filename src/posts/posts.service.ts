import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePostInputDto, UpdatePostInputDto } from './dtos';
import { PostModel } from './models/post.model';
import { GetPostsOutputDto } from './dtos/get-posts-output.dto';
import { MapperPostToViewModel } from './mappers/mapper-post-to-view-model';

@Injectable()
export class PostsService {
	constructor(private readonly prisma: PrismaService) {}

	async createPost({
		content,
		title,
		authorId,
	}: CreatePostInputDto): Promise<PostModel> {
		return await this.prisma.post.create({
			data: {
				content,
				title,
				authorId,
			},
		});
	}

	async updatePost({
		id,
		content,
		title,
	}: UpdatePostInputDto & { id: string }): Promise<PostModel> {
		const postExists = await this.prisma.post.findUnique({ where: { id } });

		if (!postExists) throw new NotFoundException('Post not found');

		return await this.prisma.post.update({
			where: { id },
			data: {
				content,
				title,
			},
		});
	}

	async deletePost(id: string): Promise<void> {
		await this.prisma.post.delete({ where: { id } });
	}

	async getPostsByAuthorId(authorId: string): Promise<GetPostsOutputDto[]> {
		const posts = await this.prisma.post.findMany({
			include: { author: true },
			where: { authorId },
		});

		return posts.map((post) => MapperPostToViewModel.map(post));
	}

	async publishPost(id: string): Promise<void> {
		const postExists = await this.prisma.post.findUnique({ where: { id } });

		if (!postExists) throw new NotFoundException('Post not found');
		if (postExists.published) return;

		await this.prisma.post.update({
			where: { id },
			data: { published: true },
		});
	}

	async getAllPosts(): Promise<GetPostsOutputDto[]> {
		const posts = await this.prisma.post.findMany({
			include: { author: true },
		});

		return posts.map((post) => MapperPostToViewModel.map(post));
	}

	async getPostById(id: string) {
		const post = await this.prisma.post.findUnique({
			include: { author: true },
			where: { id },
		});

		if (!post) throw new NotFoundException('Post not found');

		return MapperPostToViewModel.map(post);
	}
}
