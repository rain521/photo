"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OssService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const OSS = require('ali-oss');
const { STS } = require('ali-oss');
const { getCredential } = require('ali-oss/lib/common/signUtils');
const { getStandardRegion } = require('ali-oss/lib/common/utils/getStandardRegion');
const { policy2Str } = require('ali-oss/lib/common/utils/policy2Str');
let OssService = class OssService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    getClient() {
        const rawRegion = String(this.configService.get('OSS_REGION') || '').replace(/^'+|'+$/g, '').trim();
        const region = rawRegion.replace(/^oss[-_]?/i, '').trim();
        const bucket = String(this.configService.get('OSS_BUCKET') || '').replace(/^'+|'+$/g, '').trim();
        const accessKeyId = String(this.configService.get('KEY_ID') || '').replace(/^'+|'+$/g, '').trim();
        const accessKeySecret = String(this.configService.get('KEY_SECRET') || '').replace(/^'+|'+$/g, '').trim();
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
    async generateUploadToken(dir) {
        let sts = new STS({
            accessKeyId: this.configService.get('KEY_ID'),
            accessKeySecret: this.configService.get('KEY_SECRET')
        });
        const result = await sts.assumeRole(process.env.OSS_STS_ROLE_ARN, '', '3600', 'rainPhotoAll');
        const accessKeyId = result.credentials.AccessKeyId;
        const accessKeySecret = result.credentials.AccessKeySecret;
        const securityToken = result.credentials.SecurityToken;
        const client = new OSS({
            bucket: this.configService.get('OSS_BUCKET'),
            region: this.configService.get('OSS_REGION'),
            accessKeyId,
            accessKeySecret,
            stsToken: securityToken,
            refreshSTSTokenInterval: 0,
            refreshSTSToken: async () => {
                const { accessKeyId, accessKeySecret, securityToken } = await client.getCredential();
                return { accessKeyId, accessKeySecret, stsToken: securityToken };
            },
        });
        const formData = new Map();
        const date = new Date();
        const expirationDate = new Date(date);
        expirationDate.setMinutes(date.getMinutes() + 10);
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }
        function formatDateToUTC(date) {
            return (date.getUTCFullYear() +
                padTo2Digits(date.getUTCMonth() + 1) +
                padTo2Digits(date.getUTCDate()) +
                'T' +
                padTo2Digits(date.getUTCHours()) +
                padTo2Digits(date.getUTCMinutes()) +
                padTo2Digits(date.getUTCSeconds()) +
                'Z');
        }
        const formattedDate = formatDateToUTC(expirationDate);
        const credential = getCredential(formattedDate.split('T')[0], getStandardRegion(client.options.region), client.options.accessKeyId);
        formData.set('x_oss_date', formattedDate);
        formData.set('x_oss_credential', credential);
        formData.set('x_oss_signature_version', 'OSS4-HMAC-SHA256');
        const policy = {
            expiration: expirationDate.toISOString(),
            conditions: [
                { 'bucket': this.configService.get('OSS_BUCKET') },
                { 'x-oss-credential': credential },
                { 'x-oss-signature-version': 'OSS4-HMAC-SHA256' },
                { 'x-oss-date': formattedDate },
            ],
        };
        if (client.options.stsToken) {
            policy.conditions.push({ 'x-oss-security-token': client.options.stsToken });
            formData.set('security_token', client.options.stsToken);
        }
        const signature = client.signPostObjectPolicyV4(policy, date);
        formData.set('policy', Buffer.from(policy2Str(policy), 'utf8').toString('base64'));
        formData.set('signature', signature);
        return {
            host: `https://${client.options.bucket}.oss-${client.options.region}.aliyuncs.com`,
            policy: Buffer.from(policy2Str(policy), 'utf8').toString('base64'),
            x_oss_signature_version: 'OSS4-HMAC-SHA256',
            x_oss_credential: credential,
            x_oss_date: formattedDate,
            signature: signature,
            dir: dir ? dir + '/' : '',
            security_token: client.options.stsToken
        };
    }
    async uploadFolder(targetDir, files) {
        const client = this.getClient();
        const uploaded = [];
        for (const file of files) {
            let objectName = file.originalname || file.filename;
            objectName = objectName.replace(/\\/g, '/');
            if (targetDir) {
                const prefix = targetDir.replace(/^\/+|\/+$/g, '');
                objectName = prefix + '/' + objectName.replace(/^\/+/, '');
            }
            const result = await client.put(objectName, file.buffer);
            uploaded.push({ name: objectName, url: result.url });
        }
        return { uploaded };
    }
    async deleteObject(objectName) {
        if (!objectName)
            throw new Error('objectName is required');
        const client = this.getClient();
        const result = await client.delete(objectName);
        return result;
    }
    async deleteObjects(objectNames) {
        if (!Array.isArray(objectNames) || objectNames.length === 0)
            throw new Error('objectNames must be a non-empty array');
        const client = this.getClient();
        const result = await client.deleteMulti(objectNames);
        return result;
    }
};
exports.OssService = OssService;
exports.OssService = OssService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OssService);
//# sourceMappingURL=oss.service.js.map