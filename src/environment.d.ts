declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_BASE_PATH: string;
      API_PORT: string;
      API_VERSION: string;
      DATABASE_URL: string;
    }
  }
}
export {};