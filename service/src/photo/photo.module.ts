import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { Photo } from '../entities/photo.entity';
import { Classify } from '../entities/classify.entity';
import { OssModule } from '../oss/oss.module';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Classify]), OssModule],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
