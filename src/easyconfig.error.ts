export class EasyconfigError extends Error {
  constructor(err) {
    super(`Failed to load config ${err.message} ${err.stack}`);
  }
}
