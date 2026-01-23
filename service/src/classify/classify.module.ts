import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassifyService } from './classify.service';
import { ClassifyController } from './classify.controller';
import { Classify } from '../entities/classify.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classify])],
  providers: [ClassifyService],
  controllers: [ClassifyController]
})
export class ClassifyModule {}
