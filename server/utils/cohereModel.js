import { CohereClientV2 } from 'cohere-ai';
const cohere = new CohereClientV2({
  token: 'BXwcyHn8jv7a1Rk1TxZmrIc7bTlmGKVHTsRgu53h',
});
const ModelResponse = async (query) => {
  const response = await cohere.chat({
    model: 'command-r-plus',
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
  });
  
  return response.message.content[0].text;
}

export default ModelResponse;

