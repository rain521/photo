import { OssService } from './oss.service';
export declare class OssController {
    private readonly ossService;
    constructor(ossService: OssService);
    create(dir: string): Promise<{
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
    deleteObject(key: string): Promise<any>;
    deleteObjects(keys: string[]): Promise<any>;
}
