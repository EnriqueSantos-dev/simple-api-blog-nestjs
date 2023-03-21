interface PostsEntityDto {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserEntityDto {
	id: string;
	email: string;
	name: string;
	posts: PostsEntityDto[];
}
