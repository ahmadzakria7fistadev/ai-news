const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AgentResponse {
  result: string;
  session_id: string;
  agent_type?: string;
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
