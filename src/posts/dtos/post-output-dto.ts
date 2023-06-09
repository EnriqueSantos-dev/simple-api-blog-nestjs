export interface PostOutputDto {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	published: boolean;
	author: {
		id: string;
		name: string;
	};
}
