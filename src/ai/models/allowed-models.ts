import {
  GeminiModel,
  HuggingFaceModel,
  LlamaModel,
} from 'src/ai/providers/enum/ai-model.enum';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';

export const ALLOWED_MODELS: Record<AIProviderName, readonly string[]> = {
  [AIProviderName.GEMINI]: Object.values(GeminiModel),
  [AIProviderName.LLAMA]: Object.values(LlamaModel),
  [AIProviderName.HUGGINGFACE]: Object.values(HuggingFaceModel),
};

export const DEFAULT_MODELS: Record<AIProviderName, string> = {
  [AIProviderName.GEMINI]: GeminiModel.FLASH,
  [AIProviderName.LLAMA]: LlamaModel.MAVERICK,
  [AIProviderName.HUGGINGFACE]: HuggingFaceModel.DEEPSEEK_R1,
};
