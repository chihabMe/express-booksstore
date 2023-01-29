import { refreshEndpoint } from "@/config/constances";
export function fetcherConfig({
  method,
  body,
  tokens,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  tokens?: {
    refresh?: string;
    access?: string;
  };
}): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: tokens?.access ? `Bearer ${tokens.access}` : "",
      refresh: tokens?.refresh ? `${tokens.refresh}` : "",
    },
    credentials: "include",
    mode: "cors",
  };
}
export const refreshFetcher = async ({ refresh }: { refresh: string }) => {
  const config = fetcherConfig({
    method: "POST",
    tokens: {
      refresh,
    },
  });

  const response = await fetch(refreshEndpoint, config);
  let data;
  if (response.ok) {
    data = response.json();
  }
  return {
    status: response.status,
    access: response.headers.get("authorization"),
    refresh: response.headers.get("refresh"),
  };
};
export const fetcher = async ({
  url,
  method,
  body,
  tokens,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  tokens?: {
    access?: string;
    refresh?: string;
  };
}) => {
  const config = fetcherConfig({
    method,
    body,
    tokens,
  });
  let refreshResponse;
  let data;
  let newTokens: { access: string; refresh: string };
  let response = await fetch(url, config);

  if (response.status == 401 && tokens?.refresh) {
    refreshResponse = await refreshFetcher({
      refresh: tokens.refresh,
    });
    if (refreshResponse.status == 200) {
      if ("refreshed successfully i will try to fetch again")
        response = await fetch(url, config);
    }
  }

  if (response.ok) data = await response.json();
  return {
    refreshed: refreshResponse && refreshResponse.status == 200,
    refreshResponse,
    status: response.status,
    data: data,
  };
};