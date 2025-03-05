import { ConfigData } from './config.interface';

export const DEFAULT_CONFIG: ConfigData = {
  env: 'production',
  swagger: {
    username: '',
    password: '',
  },
  port: parseInt(process.env.PORT) || 3000,
  logLevel: '',
  appName: '',
};

