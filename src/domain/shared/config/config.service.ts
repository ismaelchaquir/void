import { Injectable } from '@nestjs/common';
import { ConfigData, ConfigSwagger } from './config.interface';
import { DEFAULT_CONFIG } from './config.default';

@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.PORT),
      swagger: this.parseSwaggerConfig(env, DEFAULT_CONFIG.swagger),
      logLevel: env.LOG_LEVEL,
      appName: env.CLIENT_APP_NAME,
    };
  }

  private parseSwaggerConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigSwagger>,
  ): ConfigSwagger {
    return {
      username: env.SWAGGER_USERNAME || defaultConfig.username,
      password: env.SWAGGER_PASSWORD || defaultConfig.password,
    };
  }
}

