export interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  published_at: string;
  sentiment: "positive" | "negative" | "neutral";
  currencies: string[];
}

export interface NewsData {
  count: number;
  region: string;
  items: NewsItem[];
  timestamp: string;
}

function parseSentiment(votes: {
  positive: number;
  negative: number;
  important: number;
  liked: number;
  disliked: number;
  lol: number;
  toxic: number;
  saved: number;
  comments: number;
}): "positive" | "negative" | "neutral" {
  if (votes.positive > votes.negative) return "positive";
  if (votes.negative > votes.positive) return "negative";
  return "neutral";
}

export async function fetchApacNews(): Promise<NewsData> {
  const token = process.env.CRYPTOPANIC_API_TOKEN;

  let url: string;
  let useMock = false;

  if (token) {
    url = `https://cryptopanic.com/api/v1/posts/?auth_token=${token}&regions=jp,kr,cn,sg&currencies=BTC,ETH,SOL&public=true`;
  } else {
    // Fall back to public endpoint (limited results)
    url = `https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true&regions=jp`;
    useMock = true;
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`CryptoPanic API error: ${res.status}`);
    }

    const data = await res.json();
    const results = (data.results ?? []).slice(0, 10);

    const items: NewsItem[] = results.map((post: {
      id: number;
      title: string;
      url: string;
      source: { title: string };
      published_at: string;
      votes: {
        positive: number;
        negative: number;
        important: number;
        liked: number;
        disliked: number;
        lol: number;
        toxic: number;
        saved: number;
        comments: number;
      };
      currencies: Array<{ code: string }> | null;
    }) => ({
      id: post.id,
      title: post.title,
      url: post.url,
      source: post.source?.title ?? "Unknown",
      published_at: post.published_at,
      sentiment: parseSentiment(post.votes),
      currencies: (post.currencies ?? []).map((c) => c.code),
    }));

    return {
      count: items.length,
      region: "APAC (JP, KR, CN, SG)",
      items,
      timestamp: new Date().toISOString(),
    };
  } catch {
    if (useMock) {
      return getMockNews();
    }
    throw new Error("Failed to fetch crypto news. Set CRYPTOPANIC_API_TOKEN in .env.local");
  }
}

function getMockNews(): NewsData {
  return {
    count: 5,
    region: "APAC (JP, KR, CN, SG)",
    items: [
      {
        id: 1,
        title: "Bitcoin surges as Japanese institutional investors increase holdings",
        url: "https://example.com/1",
        source: "CoinDesk Japan",
        published_at: new Date().toISOString(),
        sentiment: "positive",
        currencies: ["BTC"],
      },
      {
        id: 2,
        title: "South Korea's FSC issues new crypto exchange guidelines",
        url: "https://example.com/2",
        source: "Korea Times",
        published_at: new Date(Date.now() - 3600000).toISOString(),
        sentiment: "neutral",
        currencies: ["BTC", "ETH"],
      },
      {
        id: 3,
        title: "Singapore MAS approves three new digital payment licenses",
        url: "https://example.com/3",
        source: "The Straits Times",
        published_at: new Date(Date.now() - 7200000).toISOString(),
        sentiment: "positive",
        currencies: [],
      },
      {
        id: 4,
        title: "Chinese CBDC pilot expands to five new cities",
        url: "https://example.com/4",
        source: "Caixin",
        published_at: new Date(Date.now() - 10800000).toISOString(),
        sentiment: "neutral",
        currencies: [],
      },
      {
        id: 5,
        title: "Ethereum Layer-2 adoption accelerates in Japanese DeFi market",
        url: "https://example.com/5",
        source: "BlockTempo Japan",
        published_at: new Date(Date.now() - 14400000).toISOString(),
        sentiment: "positive",
        currencies: ["ETH"],
      },
    ],
    timestamp: new Date().toISOString(),
  };
}
