import { Module } from '@nestjs/common';

import { HealthcheckController } from './HealtChecker.controller';

const httpControllers = [HealthcheckController];

@Module({
	imports: [],
	controllers: [...httpControllers]
})
export class AppModule {}
