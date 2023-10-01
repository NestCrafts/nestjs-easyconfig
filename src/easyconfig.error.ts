export class EasyconfigError extends Error {
  constructor(error: { message: string; stack?: string }) {
    super(`Failed to load config ${error.message} ${error.stack ?? ""}`);
  }
}
