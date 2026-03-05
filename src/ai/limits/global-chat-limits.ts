import { AIGlobalLimitError } from 'src/ai/errors/ai.error';

let used = 0;
let blocked = false;

export function checkGlobalChatLimit(max: number) {
  if (blocked) {
    throw new AIGlobalLimitError();
  }

  if (used >= max) {
    blocked = true;
    throw new AIGlobalLimitError();
  }

  used++;
}

export function unlockGlobalChatLimit() {
  used = 0;
  blocked = false;
}

export function getGlobalChatStatus() {
  return {
    used,
    blocked,
  };
}
