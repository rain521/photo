"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const user_entity_1 = require("./entities/user.entity");
const photo_entity_1 = require("./entities/photo.entity");
const classify_entity_1 = require("./entities/classify.entity");
const wifi_entity_1 = require("./entities/wifi.entity");
const auth_module_1 = require("./auth/auth.module");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const photo_module_1 = require("./photo/photo.module");
const oss_module_1 = require("./oss/oss.module");
const classify_module_1 = require("./classify/classify.module");
const ai_module_1 = require("./ai/ai.module");
const wifi_module_1 = require("./wifi/wifi.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: 'localhost',
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_DATABASE'),
                    entities: [user_entity_1.User, photo_entity_1.Photo, classify_entity_1.Classify, wifi_entity_1.Wifi],
                    synchronize: true,
                })
            }),
            cache_manager_1.CacheModule.register(),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            photo_module_1.PhotoModule,
            oss_module_1.OssModule,
            classify_module_1.ClassifyModule,
            ai_module_1.AiModule,
            wifi_module_1.WifiModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map