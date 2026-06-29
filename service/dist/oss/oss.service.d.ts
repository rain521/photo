import { ConfigService } from '@nestjs/config';
export declare class OssService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private getClient;
    generateUploadToken(dir: string | null): Promise<{
        host: string;
        policy: string;
        x_oss_signature_version: string;
        x_oss_credential: any;
        x_oss_date: string;
        signature: any;
        dir: string;
        security_token: any;
    }>;
    uploadFolder(targetDir: string, files: Array<Express.Multer.File>): Promise<{
        uploaded: {
            name: string;
            url: string;
        }[];
    }>;
    deleteObject(objectName: string): Promise<any>;
    deleteObjects(objectNames: string[]): Promise<any>;
}
