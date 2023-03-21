import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.use(cookieParser());
	app.setGlobalPrefix('api/v1');
	app.useGlobalPipes(
		new ValidationPipe({
			skipNullProperties: true,
			whitelist: true,
		}),
	);

	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	await app.listen(3000);
}

bootstrap();
