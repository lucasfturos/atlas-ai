import { IsArray, IsIn, IsString, ArrayMinSize } from 'class-validator';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class ChatRequestDto {
  @IsIn(['gemini'])
  provider: 'gemini';

  @IsString()
  model: string;

  @IsArray()
  @ArrayMinSize(1)
  messages: ChatMessage[];
}
