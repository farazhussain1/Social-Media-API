export interface Config {
  SECRET_KEY: string;
  PORT: string;
  JWT_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;
  DATABASE_URL: string;
}
export interface ForgetPassword {
  [key: string]: {
    email: string;
    timestamp: number;
  };
}
