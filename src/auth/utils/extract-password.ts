export function extractPasswordFromPrompt(prompt: string) {
  const regex = /^password=(.*?);/i;

  const match = prompt.match(regex);

  if (!match) {
    return { password: null, prompt };
  }

  const password = match[1].trim();
  const cleanedPrompt = prompt.replace(regex, '').trim();

  return {
    password,
    prompt: cleanedPrompt,
  };
}
