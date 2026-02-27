import { GeminiModel, LlamaModel } from '../providers/enum/ai-model.enum';
import { AIProviderName } from '../providers/enum/ai-provider.enum';

export const ALLOWED_MODELS: Record<AIProviderName, readonly string[]> = {
  [AIProviderName.GEMINI]: Object.values(GeminiModel),
  [AIProviderName.LLAMA]: Object.values(LlamaModel),
};

export const DEFAULT_MODELS: Record<AIProviderName, string> = {
  [AIProviderName.GEMINI]: GeminiModel.FLASH,
  [AIProviderName.LLAMA]: LlamaModel.MAVERICK,
};
