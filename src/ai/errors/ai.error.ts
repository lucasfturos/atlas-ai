export class AIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AIConfigError extends AIError {}
export class AIProviderError extends AIError {}
export class AIUnsupportedProviderError extends AIError {}
