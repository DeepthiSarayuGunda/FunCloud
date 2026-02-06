const OLLAMA_URL = 'https://api.databi.io/api';

export async function askLLM(prompt) {
  const res = await fetch(`${OLLAMA_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1:latest',
      stream: false,
      prompt: prompt
    })
  });

  const json = await res.json();
  return json.response;
}
