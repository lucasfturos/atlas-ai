import { ALLOWED_MODELS } from 'src/ai/models/allowed-models';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';

type TestFormState = {
  provider: AIProviderName;
  model: string;
};

export function renderTestForm({ provider, model }: TestFormState) {
  return `
      <html>
        <body>
          <h2>Atlas AI - Teste</h2>
          <form method="get">
            <div>
              <label>Agents:</label>
              <select name="provider" id="provider">
                <option value="gemini" ${provider === AIProviderName.GEMINI ? 'selected' : ''}>
                  Gemini
                </option>
                <option value="llama" ${provider === AIProviderName.LLAMA ? 'selected' : ''}>
                  Llama
                </option>
                <option value="huggingface" ${provider === AIProviderName.HUGGINGFACE ? 'selected' : ''}>
                  HuggingFace
                </option>
              </select>
            </div>

            <div style="margin-top:8px">
              <label>Model:</label>
              <select name="model" id="model" style="width:300px"></select>
            </div>

            <div style="margin-top:8px">
              <input
                name="q"
                style="width:400px"
                placeholder="Digite sua pergunta"
              />
            </div>

            <div style="margin-top:8px">
              <button type="submit">Enviar</button>
            </div>
          </form>
          
          <script>
            const providerSelect = document.getElementById('provider');
            const modelSelect = document.getElementById('model');

            const MODELS = {
              gemini: ${JSON.stringify(ALLOWED_MODELS[AIProviderName.GEMINI])},
              llama: ${JSON.stringify(ALLOWED_MODELS[AIProviderName.LLAMA])},
              huggingface: ${JSON.stringify(ALLOWED_MODELS[AIProviderName.HUGGINGFACE])}
            };

            function populateModels(provider) {
              const models = MODELS[provider] || [];

              modelSelect.innerHTML = '';

              for (const m of models) {
                const option = document.createElement('option');
                option.value = m;
                option.textContent = m;

                if (m === "${model}") {
                  option.selected = true;
                }

                modelSelect.appendChild(option);
              }
            }

            providerSelect.addEventListener('change', () => {
              populateModels(providerSelect.value);
            });

            populateModels(providerSelect.value);
          </script>
        </body>
      </html>
    `;
}

export function renderResult(output: string) {
  return `
      <html>
        <body>
          <h2>Atlas AI - Resposta</h2>
          <pre>${output}</pre>
        </body>
      </html>
    `;
}

export function renderError(err: unknown) {
  const message = err instanceof Error ? err.message : 'Unknown error';

  return `
      <html>
        <body>
          <h2>Atlas AI - Erro</h2>
          <pre>${message}</pre>
        </body>
      </html>
    `;
}
