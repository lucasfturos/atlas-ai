import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class ChatMessageDto {
  @IsIn(['system', 'user', 'assistant'])
  role: 'system' | 'user' | 'assistant';

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ChatRequestDto {
  @IsIn(Object.values(AIProviderName))
  provider: AIProviderName;

  @IsString()
  @IsNotEmpty()
  model: string;

  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}
