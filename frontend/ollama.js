const OLLAMA_URL = "https://api.databi.io/api";

export async function askLLM(prompt) {
  const res = await fetch(`${OLLAMA_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3:latest",   // IMPORTANT
      stream: false,
      prompt: prompt
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.response;
}
