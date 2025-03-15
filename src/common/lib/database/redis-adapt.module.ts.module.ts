// import { CacheModuleOptions, CacheOptionsFactory, Injectable, Module } from "@nestjs/common";
// import { CacheModule } from "@nestjs/cache-manager";
// import * as redisStore from "cache-manager-redis-store";
// import { Implemented } from "../../decorators/implemented.decoration";
// import { ConfigService } from "@nestjs/config";
//
// @Injectable()
// class CacheConfigService implements CacheOptionsFactory {
//   constructor(private readonly configService: ConfigService) {}
//
//   @Implemented
//   public createCacheOptions(): CacheModuleOptions {
//     return {
//       store: redisStore,
//       host: this.configService.get("REDIS_HOST"),
//       port: this.configService.get("REDIS_PORT"),
//       ttl: 60,
//     };
//   }
// }
//
// @Module({
//   imports: [CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfigService })],
// })
// export class RedisAdaptModuleTsModule {}
