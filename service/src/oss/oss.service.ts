import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const OSS = require('ali-oss');
const { STS } = require('ali-oss');
const { getCredential } = require('ali-oss/lib/common/signUtils');
const { getStandardRegion } = require('ali-oss/lib/common/utils/getStandardRegion');
const { policy2Str } = require('ali-oss/lib/common/utils/policy2Str');

@Injectable()
export class OssService {
    constructor(private configService: ConfigService) { }
    private getClient() {
        // 规范配置值，去除可能的引号并确保 region 格式正确
        const rawRegion = String(this.configService.get('OSS_REGION') || '').replace(/^'+|'+$/g, '').trim();
        const region = rawRegion.replace(/^oss[-_]?/i, '').trim();
        const bucket = String(this.configService.get('OSS_BUCKET') || '').replace(/^'+|'+$/g, '').trim();
        const accessKeyId = String(this.configService.get('OSS_ACCESS_KEY_ID') || '').replace(/^'+|'+$/g, '').trim();
        const accessKeySecret = String(this.configService.get('OSS_ACCESS_KEY_SECRET') || '').replace(/^'+|'+$/g, '').trim();

        const endpoint = `oss-${region}.aliyuncs.com`;

        return new OSS({
            region,
            accessKeyId,
            accessKeySecret,
            bucket,
            endpoint,
            secure: true,
        });
    }
    /**
     * 生成上传凭证（前端直传）
     */
    async generateUploadToken() {
        // 初始化STS客户端
        let sts = new STS({
            accessKeyId: this.configService.get('OSS_ACCESS_KEY_ID'),  // 从环境变量中获取RAM用户的AccessKey ID
            accessKeySecret: this.configService.get('OSS_ACCESS_KEY_SECRET') // 从环境变量中获取RAM用户的AccessKey Secret
        });

        // 调用assumeRole接口获取STS临时访问凭证
        const result = await sts.assumeRole(process.env.OSS_STS_ROLE_ARN, '', '3600', 'rainPhotoAll'); // 从环境变量中获取RAM角色ARN，并设置临时访问凭证有效期为3600秒，角色会话名称为yourRoleSessionName可自定义

        // 提取临时访问凭证中的AccessKeyId、AccessKeySecret和SecurityToken
        const accessKeyId = result.credentials.AccessKeyId;
        const accessKeySecret = result.credentials.AccessKeySecret;
        const securityToken = result.credentials.SecurityToken;

        // 初始化OSS Client
        const client = new OSS({
            bucket: this.configService.get('OSS_BUCKET'), // 请替换为目标Bucket名称
            region: this.configService.get('OSS_REGION'), // 请替换为标Bucket所在地域
            accessKeyId,
            accessKeySecret,
            stsToken: securityToken,
            refreshSTSTokenInterval: 0,
            refreshSTSToken: async () => {
                const { accessKeyId, accessKeySecret, securityToken } = await client.getCredential();
                return { accessKeyId, accessKeySecret, stsToken: securityToken };
            },
        });


        // 创建表单数据Map
        const formData = new Map();

        // 设置签名过期时间为当前时间往后推10分钟 
        const date = new Date();
        const expirationDate = new Date(date);
        expirationDate.setMinutes(date.getMinutes() + 10);

        // 格式化日期为符合ISO 8601标准的UTC时间字符串格式
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }
        function formatDateToUTC(date) {
            return (
                date.getUTCFullYear() +
                padTo2Digits(date.getUTCMonth() + 1) +
                padTo2Digits(date.getUTCDate()) +
                'T' +
                padTo2Digits(date.getUTCHours()) +
                padTo2Digits(date.getUTCMinutes()) +
                padTo2Digits(date.getUTCSeconds()) +
                'Z'
            );
        }
        const formattedDate = formatDateToUTC(expirationDate);
        // 设置上传回调URL，即回调服务器地址，用于处理应用服务器与OSS之间的通信。OSS会在文件上传完成后，把文件上传信息通过此回调URL发送给应用服务器。例如callbackUrl填写为https://oss-demo.aliyuncs.com:23450。

        // 生成x-oss-credential并设置表单数据
        const credential = getCredential(formattedDate.split('T')[0], getStandardRegion(client.options.region), client.options.accessKeyId);
        formData.set('x_oss_date', formattedDate);
        formData.set('x_oss_credential', credential);
        formData.set('x_oss_signature_version', 'OSS4-HMAC-SHA256');

        // 创建policy
        // 示例policy表单域只列举必填字段
        const policy: any = {
            expiration: expirationDate.toISOString(),
            conditions: [
                { 'bucket': this.configService.get('OSS_BUCKET') }, // 请替换为目标Bucket名称
                { 'x-oss-credential': credential },
                { 'x-oss-signature-version': 'OSS4-HMAC-SHA256' },
                { 'x-oss-date': formattedDate },
            ],
        };

        // 如果存在STS Token，添加到策略和表单数据中
        if (client.options.stsToken) {
            policy.conditions.push({ 'x-oss-security-token': client.options.stsToken });
            formData.set('security_token', client.options.stsToken);
        }

        // 生成签名并设置表单数据
        const signature = client.signPostObjectPolicyV4(policy, date);
        formData.set('policy', Buffer.from(policy2Str(policy), 'utf8').toString('base64'));
        formData.set('signature', signature);
        // 返回表单数据
        return {
            host: `https://${client.options.bucket}.oss-${client.options.region}.aliyuncs.com`,
            policy: Buffer.from(policy2Str(policy), 'utf8').toString('base64'),
            x_oss_signature_version: 'OSS4-HMAC-SHA256',
            x_oss_credential: credential,
            x_oss_date: formattedDate,
            signature: signature,
            dir: 'user-dir', // 指定上传到OSS的文件前缀，可选
            security_token: client.options.stsToken
        };
    }

    /**
     * 上传多个文件（通常来自前端包含文件夹的上传）。
     * files: 使用 multer memoryStorage 保持在内存中的文件
     * targetDir: OSS 中的目标前缀（文件夹）
     */
    async uploadFolder(targetDir: string, files: Array<Express.Multer.File>) {
        const client = this.getClient();
        const uploaded = [] as Array<{ name: string; url: string }>;

        for (const file of files) {
            // file.originalname 可能包含前端传来的相对路径（如使用 webkitRelativePath 上传）
            let objectName = file.originalname || file.filename;
            // 规范化路径分隔符为 '/'
            objectName = objectName.replace(/\\/g, '/');
            // 如果传入了目标目录，则把文件路径放到该目录下
            if (targetDir) {
                // 去除多余的斜杠
                const prefix = targetDir.replace(/^\/+|\/+$/g, '');
                objectName = prefix + '/' + objectName.replace(/^\/+/, '');
            }

            // 使用 buffer 上传
            const result = await client.put(objectName, file.buffer);
            uploaded.push({ name: objectName, url: result.url });
        }

        return { uploaded };
    }

    /**
     * 删除单个 OSS 对象
     * @param objectName OSS 对象完整路径
     */
    async deleteObject(objectName: string) {
        if (!objectName) throw new Error('objectName is required');
        const client = this.getClient();
        const result = await client.delete(objectName);
        return result;
    }

    /**
     * 批量删除 OSS 对象
     * @param objectNames 对象名数组
     */
    async deleteObjects(objectNames: string[]) {
        if (!Array.isArray(objectNames) || objectNames.length === 0) throw new Error('objectNames must be a non-empty array');
        const client = this.getClient();
        const result = await client.deleteMulti(objectNames);
        return result;
    }

}
