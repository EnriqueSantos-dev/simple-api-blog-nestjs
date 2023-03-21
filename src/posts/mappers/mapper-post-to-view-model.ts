import { GetPostsOutputDto } from '../dtos';
import { PostModel } from '../models/post.model';

export abstract class MapperPostToViewModel {
	static map(
		post: PostModel & { author: { id: string; name: string } },
	): GetPostsOutputDto {
		return {
			id: post.id,
			title: post.title,
			content: post.content,
			published: post.published,
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString(),
			author: {
				id: post.author.id,
				name: post.author.name,
			},
		};
	}
}
