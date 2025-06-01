const BASE_URL =
  process.env.FLASK_API_URL ||
  "https://backend-api-729553473022.us-central1.run.app/v1/";

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  sent_datetime: string;
  message_body: string;
}

export interface CreateMessagePayload {
  sender: string;
  receiver: string;
  message_body: string;
}

// GET /Messages?sender=X&receiver=Y
export async function getMessagesBetweenUsers(
  sender: string,
  receiver: string
): Promise<Message[]> {
  const res = await fetch(
    `${BASE_URL}/Messages?sender=${sender}&receiver=${receiver}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch messages");
  }

  const json = await res.json();
  return json.messages;
}

// GET /Messages?user=username
export async function getInboxMessages(user: string): Promise<Message[]> {
  const res = await fetch(`${BASE_URL}/Messages?user=${user}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch inbox");
  }

  const json = await res.json();
  return json.messages;
}

// POST /Messages
export async function sendMessage(payload: CreateMessagePayload): Promise<Message> {
  const res = await fetch(`${BASE_URL}/Messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to send message");
  }

  const json = await res.json();
  return json as Message;
}
