import { Post, User } from '@prisma/client';

export type UserModel = User & {
	posts: Post[];
};
