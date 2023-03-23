import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInputDto, UpdatePostInputDto } from './dtos';
import { PostOutputDto } from './dtos/post-output-dto';
import { MapperPostToViewModel } from './mappers/mapper-post-to-view-model';
import { PostModel } from './models/post.model';

@Injectable()
export class PostsService {
	constructor(private readonly prisma: PrismaService) {}

	async createPost({
		content,
		title,
		authorId,
	}: CreatePostInputDto & { authorId: string }): Promise<PostModel> {
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

		if (!postExists) throw new NotFoundException('Post not founds');

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

	async getPostsByAuthorId(
		authorId: string,
	): Promise<Omit<PostOutputDto, 'author'>[]> {
		const posts = await this.prisma.post.findMany({
			include: { author: true },
			where: { authorId },
		});

		return posts.map((post) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { author: _, ...postWithoutAuthor } =
				MapperPostToViewModel.map(post);
			return postWithoutAuthor;
		});
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

	async getAllPosts(): Promise<PostOutputDto[]> {
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
