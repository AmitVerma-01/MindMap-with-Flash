export class ApiError extends Error {
  status: number;
  data?: { error?: string; [key: string]: unknown };

  constructor(status: number, message: string, data?: ApiError["data"]) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function postJson<T>(
  url: string,
  body: unknown
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
