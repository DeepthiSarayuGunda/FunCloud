const OLLAMA_URL = "https://api.databi.io/api";
const MODEL = "llama3:latest";
const OLLAMA_BASE = "https://api.databi.io/api";


/**
 * Call Ollama /generate API via reverse proxy at https://api.databi.io/api
 * Request format matches Ollama spec: https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion
 * 
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<string>} - The generated response text
 * @throws {Error} - Network, proxy, model, or parsing errors with descriptive messages
 */
export async function askLLM(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt: must be a non-empty string");
  }

  const requestBody = {
    model: MODEL,
    prompt: prompt,
    stream: false
  };

  let res;
  try {
    res = await fetch(`${OLLAMA_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
  } catch (err) {
    // Network error or CORS issue
    throw new Error(
      `Network/Proxy error: ${err.message}. ` +
      `Verify reverse proxy at ${OLLAMA_URL} is reachable and CORS is configured. ` +
      `Backend: https://192.168.2.200:11434`
    );
  }

  // Handle HTTP error responses (including proxy errors like 502, 503)
  if (!res.ok) {
    let errorDetail = "";
    const contentType = res.headers.get("content-type");
    try {
      if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        errorDetail = json.error || JSON.stringify(json);
      } else {
        errorDetail = await res.text();
      }
    } catch {
      errorDetail = `(unable to parse response body)`;
    }

    throw new Error(
      `Ollama/Proxy error ${res.status}: ${errorDetail}. ` +
      (res.status === 404
        ? `Model "${MODEL}" may not exist on backend. Verify with: ollama list`
        : res.status >= 500
        ? `Reverse proxy (${OLLAMA_URL}) or backend (192.168.2.200:11434) is unavailable`
        : `Check reverse proxy and backend configuration`)
    );
  }

  // Parse and validate response
  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error(
      `Failed to parse Ollama response: ${err.message}. ` +
      `Response may be malformed or proxy may have altered it.`
    );
  }

  // Validate response structure
  if (!json.response) {
    throw new Error(
      `Invalid Ollama response: missing 'response' field. ` +
      `Full response: ${JSON.stringify(json)}`
    );
  }

  return json.response;
}
