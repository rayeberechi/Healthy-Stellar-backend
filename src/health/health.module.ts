import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './indicators/redis.health';
import { IpfsHealthIndicator } from './indicators/ipfs.health';
import { StellarHealthIndicator } from './indicators/stellar.health';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator, IpfsHealthIndicator, StellarHealthIndicator],
})
export class HealthModule {}
