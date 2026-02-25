import { IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsIn(['gemini'])
  provider: 'gemini';

  @IsString()
  @IsNotEmpty()
  model: string;

  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}
