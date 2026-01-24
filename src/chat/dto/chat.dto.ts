export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class ChatRequestDto {
  provider: 'gemini';
  model: string;
  messages: ChatMessage[];
}
