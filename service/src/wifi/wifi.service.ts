import { Injectable } from '@nestjs/common';
import { Wifi } from '../entities/wifi.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WifiService {
    constructor(
        @InjectRepository(Wifi)
        private wifiRepository: Repository<Wifi>,
        private configService: ConfigService,
    ) { }
    async create(createWifiDto: Partial<Wifi>) {
        const data = this.wifiRepository.create(createWifiDto);
        return await this.wifiRepository.save(data);
    }

    async findAll(userId: number) {
        const data = await this.wifiRepository.find({ where: { userId } });
        return data;
    }

    async findOne(id: number): Promise<Wifi | null> {
        return this.wifiRepository.findOne({ where: { id } });
    }

    async update(id: number, updateWifiDto: Partial<Wifi>) {
        await this.wifiRepository.update(id, updateWifiDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        return this.wifiRepository.delete(id);
    }

    async createWxaQrcode(page: string, scene: string): Promise<Buffer> {
        const accessToken = await this.getAccessToken(); // 获取微信小程序的access_token
        // 构造请求URL
        const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
        // 构造请求体
        const requestBody = {
            scene,           // 自定义参数，最大32个可见字符
            page,            // 跳转页面，例如 'pages/index/index'，不能加 '/' 开头
            width: 280,      // 二维码宽度
            auto_color: false,
            line_color: { r: 0, g: 0, b: 0 },
            is_hyaline: false, // 是否需要透明底色
        };

        // 以POST方式请求，指定返回二进制数据
        const response = await axios.post(url, requestBody, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 处理返回的图片Buffer，可以上传到云存储，也可以直接返回给前端
        const imageBuffer = Buffer.from(response.data);
        // ... 处理图片Buffer，例如上传到云存储后返回URL
        return imageBuffer;
    }
    async getAccessToken(): Promise<string> {
        const appId = this.configService.get<string>('WX_APPID');
        const appSecret = this.configService.get<string>('WX_SECRET');
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

        const { data } = await axios.get(url);
        return data.access_token;
    }
}
