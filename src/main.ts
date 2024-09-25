import fs from 'node:fs/promises';

import { fastifyCookie } from '@fastify/cookie';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './App.module';

import { version } from '../package.json';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		logger:
			process.env.NODE_ENV === 'production'
				? ['error', 'warn', 'log']
				: ['error', 'warn', 'log', 'debug']
	});

	const logger = new Logger('Bootstrap');

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true
		})
	);

	await app.register(fastifyCookie, {});

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Nikko DevNest')
		.setDescription('API')
		.setVersion(version)
		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('api', app, swaggerDocument);

	await app.listen(3000, '0.0.0.0');
	logger.log(`DevNest ${version} is ready on port 3000`);
	await fs.writeFile('openapi.json', JSON.stringify(swaggerDocument));
}

void bootstrap();
