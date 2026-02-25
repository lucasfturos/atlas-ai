export class AIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AIInvalidModelError extends AIError {
  constructor(provider: string, model: string) {
    super(`Model not allowed for provider "${provider}": ${model}`);
  }
}

export class AIConfigError extends AIError {}
export class AIProviderError extends AIError {}
export class AIPromptTooLargeError extends AIError {}
export class AIUnsupportedProviderError extends AIError {}
