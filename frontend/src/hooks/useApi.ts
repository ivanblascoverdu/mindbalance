export async function apiRequest(
  url: string,
  method: string = "GET",
  body?: object
) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error("API error");
  return await res.json();
}
