import { Module, Global } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

@Global()
@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single', // ✅ required
      url: process.env.REDIS_URL, // ✅ works
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
