declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      LOCAL_DATABASE: string;
      PASSWORD: string;

      JWT_SECRET: string;
      JWT_EXPIRES_IN: number;
      JWT_COOKIE_EXPIRES_IN: number;

      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_HOST: string;
      EMAIL_PORT: number;
    }
  }
}

export {};
