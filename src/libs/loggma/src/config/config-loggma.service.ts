import { Injectable } from '@nestjs/common';
// import { ConfigService as NestConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ConfigLoggmaService {
  constructor() {}

  get isProduction(): boolean {
    return this.environment === 'production';
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isTest(): boolean {
    return this.environment === 'test';
  }

  get slackWebhookUrl(): string {
    return process.env.SLACK_INC_WEBHOOK_URL  || 'https://slack.com/1234';
  }

  private get environment(): string {
    return process.env.NODE_ENV  || 'development';
  }
}
