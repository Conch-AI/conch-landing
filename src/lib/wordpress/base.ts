const API_URL = <string>process.env.NEXT_PUBLIC_WORDPRESS_API_ENDPOINT;

export async function fetchAPI(
  query = "",
  { variables }: { variables?: Record<string, unknown> } = {},
) {
  // Check if API URL is configured
  if (!API_URL) {
    console.error("NEXT_PUBLIC_WORDPRESS_API_ENDPOINT is not set");
    return {};
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // causing empty blog on production
  // if (process.env.GRAPHQL_AUTH_TOKEN) {
  //   headers = {
  //     ...headers,
  //     Authorization: `Bearer ${process.env.GRAPHQL_AUTH_TOKEN}`,
  //   };
  // }

  try {
    const res = await fetch(API_URL, {
      headers,
      method: "POST",
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error(`API request failed: ${res.status} ${res.statusText}`);
      return {};
    }

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      return {};
    }
    
    if (!json.data) {
      console.error("No data in API response:", json);
      return {};
    }
    
    return json.data;
  } catch (error) {
    console.error("Error fetching from API", error);
    return {};
  }
}
