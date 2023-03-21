import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';

@Module({
	imports: [AuthModule, UsersModule, PostsModule],
	providers: [PrismaService],
})
export class AppModule {}
