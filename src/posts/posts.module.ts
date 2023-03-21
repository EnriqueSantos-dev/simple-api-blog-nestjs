import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	providers: [PostsService, PrismaService],
	controllers: [PostsController],
})
export class PostsModule {}
