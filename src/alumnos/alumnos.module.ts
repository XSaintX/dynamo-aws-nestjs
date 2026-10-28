import { Module } from '@nestjs/common';
import { DynamodbModule } from '../dynamodb/dynamodb.module';
import { AlumnosController } from './alumnos.controller';
import { AlumnosRepository } from './alumnos.repository';
import { AlumnosService } from './alumnos.service';

@Module({
  imports: [DynamodbModule],
  controllers: [AlumnosController],
  providers: [AlumnosService, AlumnosRepository],
})
export class AlumnosModule {}