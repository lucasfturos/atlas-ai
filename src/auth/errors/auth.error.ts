export class AuthConfigError extends Error {
  constructor(variable: string) {
    super(`${variable} is not defined`);
    this.name = 'AuthConfigError';
  }
}
