# Atlas AI

Atlas AI é uma API backend em NestJS que fornece uma camada unificada para integração com diferentes provedores de Inteligência Artificial por meio de uma interface comum.

O projeto abstrai detalhes específicos de cada provider (como Gemini, OpenAI, etc.), permitindo que aplicações consumam IA por meio de uma interface consistente, extensível e fácil de manter.

## Principais características

- Arquitetura baseada em providers (Strategy Pattern)
- Integração com Google Gemini via SDK oficial
- Estrutura preparada para múltiplos provedores de IA
- Validação de entrada com DTOs
- Limites de uso para evitar abuso de APIs gratuitas
- Tratamento explícito de erros de domínio
- Endpoint HTTP simples para chat
- Endpoint HTML básico para testes manuais

## Objetivo do projeto

O Atlas AI não é apenas um wrapper de API.
Ele funciona como uma camada de orquestração de IA, separando claramente:

- Controllers: camada HTTP
- Services: regras de negócio e fluxo
- Providers: integração com SDKs externos

Essa separação permite que o projeto evolua facilmente para suportar:

- múltiplos modelos
- múltiplos provedores
- agentes com regras próprias
- políticas de uso e limites personalizados
- fallback entre providers

## Tecnologias utilizadas

- Node.js
- NestJS
- TypeScript
- Google Gemini SDK
- Llama API 

## Instalação

1. Clonar o repositório

```
git clone https://github.com/seu-usuario/atlas-ai.git
cd atlas-ai
```

2. Instalar dependências

```
npm install
```

3. Configurar variáveis de ambiente

Criar um arquivo .env na raiz do projeto com o seguinte conteúdo:

```
GEMINI_API_KEY=put_your_key_here
LLAMA_API_KEY=put_your_key_here
PORT=3000
```

## Executar o projeto

Modo desenvolvimento:

```
npm run start:dev
```

Modo produção:

```
npm run build
npm run start:prod
```

## Endpoint do chat (API)

`POST /v1/chat`

Request:

```
{
  "provider": "gemini",
  "model": "gemini-3-flash-preview",
  "messages": [
    {
      "role": "user",
      "content": "Explique o que é IA em poucas palavras"
    }
  ]
}
```

Response:

```
{
  "provider": "gemini",
  "model": "gemini-3-flash-preview",
  "message": {
    "role": "assistant",
    "content": "Inteligência Artificial é a capacidade de máquinas aprenderem e tomarem decisões simulando a inteligência humana."
  }
}
```

## Endpoint de teste (HTML)

`GET /v1/chat/test`

Esse endpoint:

- exibe um formulário HTML simples
- envia a pergunta para a API
- mostra a resposta da IA diretamente na página
- exibe mensagens de erro amigáveis (ex: API key ausente)

## Provedores suportados

Atualmente:

- Google Gemini
- Meta Llama

Planejado:

- OpenAI
- Claude
- Outros LLMs compatíveis e gratuitos

Adicionar um novo provider exige apenas:

1. Criar um novo provider em src/ai/providers
2. Implementar a interface AIProvider
3. Registrar no ChatService
