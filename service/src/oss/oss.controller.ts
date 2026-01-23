import { Controller, Get, Post, Body, UploadedFiles, UseInterceptors, Delete } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { OssService } from './oss.service';

@Controller('oss')
export class OssController {
    constructor(private readonly ossService: OssService) {}
    
    @Get()
    create() {
        return this.ossService.generateUploadToken();
    }

    @Post('upload-folder')
    @UseInterceptors(FilesInterceptor('files', 1000, { storage: multer.memoryStorage() }))
    async uploadFolder(@Body('targetDir') targetDir: string, @UploadedFiles() files: Array<Express.Multer.File>) {
        return this.ossService.uploadFolder(targetDir, files);
    }

    @Delete('object')
    async deleteObject(@Body('key') key: string) {
        return this.ossService.deleteObject(key);
    }

    @Delete('objects')
    async deleteObjects(@Body('keys') keys: string[]) {
        return this.ossService.deleteObjects(keys);
    }
}
