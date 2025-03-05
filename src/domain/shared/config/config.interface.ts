export interface ConfigSwagger {
  username: string;
  password: string;
}

export interface ConfigData {
  env: string;
  port: number;
  swagger: ConfigSwagger;
  logLevel: string;
  appName: string;
}

