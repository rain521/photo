import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [],
  providers: [AiService,AlbumService],
  exports: [AiService,AlbumService],
  controllers: [AiController], // 导出供其他模块使用
})
export class AiModule {}
