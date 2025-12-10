// API URL configuration
// In Vercel, set NEXT_PUBLIC_API_URL environment variable to your backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Log warning in production if API URL is not set
if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app") && !process.env.NEXT_PUBLIC_API_URL) {
  console.error(
    "⚠️ NEXT_PUBLIC_API_URL is not set! " +
    "Please add it in Vercel Settings → Environment Variables. " +
    "Current API URL:", API_URL
  );
}

export interface AgentResponse {
  result: string;
  session_id: string;
  agent_type?: string;
}

export interface LiveNewsResponse {
  result: string;
  session_id: string;
  categories: string[];
  update_time: string;
}

export async function runAgent(
  agentType: string,
  query: string,
  sessionId?: string
): Promise<AgentResponse> {
  const response = await fetch(`${API_URL}/api/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      agent_type: agentType,
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getLiveNews(
  categories?: string[],
  sessionId?: string
): Promise<LiveNewsResponse> {
  const response = await fetch(`${API_URL}/api/live-news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      categories: categories || ["ai", "crypto", "politics", "health", "pakistan", "sports", "world"],
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
