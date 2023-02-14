const CRYPTOMANIAC_AUTH_TOKEN = "N/A";

type CryptopanicAvailableRegions =
  | "en"
  | "de"
  | "nl"
  | "es"
  | "fr"
  | "it"
  | "pt"
  | "ru";

export type CryptopanicNews = {
  kind: "news";
  domain: string;
  source: {
    title: string;
    region: CryptopanicAvailableRegions;
    domain: string;
    path: string | null;
    url: string | null;
  };
  title: string;
  slug: string;
  currencies: [
    {
      code: string;
      title: string;
      slug: string;
      url: string;
    },
  ];
  id: number;
  url: string;
  // eslint-disable-next-line camelcase
  published_at: string;
  // eslint-disable-next-line camelcase
  created_at: string;
};

export type CryptopanicNewsWithMetadata = CryptopanicNews & {
  metadata: {
    image: string;
    description: string;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CryptopanicPostsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CryptopanicNewsWithMetadata[];
};

export type CryptopanicGetParams = {
  filter?:
    | "rising"
    | "hot"
    | "bullish"
    | "bearish"
    | "important"
    | "saved"
    | "lol";
  public?: boolean;
  currencies?: [string];
  regions?: [CryptopanicAvailableRegions];
  metadata?: boolean;
  approved?: boolean;
  page?: number;
};

function createSearchParams(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach(value => {
        searchParams.append(key, value);
      });
    } else {
      searchParams.append(key, values.toString());
    }
  });
  return searchParams;
}

export async function getPosts(
  params: CryptopanicGetParams,
): Promise<CryptopanicPostsResponse> {
  const formattedParams = createSearchParams(params).toString();

  const response = await fetch(
    `https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTOMANIAC_AUTH_TOKEN}&${formattedParams}`,
  ).then(response => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  });
  return response;
}
