import { ChatMessage } from '../../chat/dto/chat.dto';

export interface AIProvider {
  generate(model: string, messages: ChatMessage[]): Promise<string>;
}
