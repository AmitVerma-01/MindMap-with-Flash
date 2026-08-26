export class ApiError extends Error {
  status: number;
  data?: { error?: string; [key: string]: unknown };

  constructor(status: number, message: string, data?: ApiError["data"]) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function requestJson<T>(
  url: string,
  method: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data as { error?: string }).error || `Request failed (${response.status})`,
      data as ApiError["data"]
    );
  }

  return data as T;
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  return requestJson<T>(url, "POST", body);
}

export async function patchJson<T>(url: string, body: unknown): Promise<T> {
  return requestJson<T>(url, "PATCH", body);
}
