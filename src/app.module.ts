import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DocsController } from './docs.controller';

import { AlumnosModule } from './alumnos/alumnos.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AlumnosModule],
  controllers: [AppController, DocsController],
})
export class AppModule {}