import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { TickerItem } from "@/types/ticker";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export const revalidate = 60;

// In-memory cache for verified genuine quotes only (never hardcoded mock/sample numbers)
let cachedLiveQuotes: TickerItem[] = [];
let lastFetchTime = 0;

export async function GET() {
  const now = Date.now();

  // Serve verified in-memory cache if retrieved within the last 60 seconds
  if (now - lastFetchTime < 60000 && cachedLiveQuotes.length > 0) {
    return NextResponse.json(cachedLiveQuotes);
  }

  try {
    const symbols = [
      { id: "^NSEI", label: "NIFTY 50", group: "index" },
      { id: "^BSESN", label: "SENSEX", group: "index" },
      { id: "^NSEBANK", label: "BANK NIFTY", group: "index" },
      { id: "^IXIC", label: "NASDAQ", group: "index" },
      { id: "^FTSE", label: "FTSE", group: "index" },
      { id: "^N225", label: "NIKKEI", group: "index" },
      { id: "GC=F", label: "GOLD", group: "commodity" },
      { id: "SI=F", label: "SILVER", group: "commodity" },
      { id: "CL=F", label: "CRUDE OIL", group: "commodity" },
      { id: "INR=X", label: "USD/INR", group: "forex" },
      { id: "EURUSD=X", label: "EUR/USD", group: "forex" },
      { id: "GBPUSD=X", label: "GBP/USD", group: "forex" },
    ];

    const queries = symbols.map((s) => s.id);

    // Timeout limit (3000ms) to prevent slow requests
    const quotePromise = yahooFinance.quote(queries);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Ticker fetch timeout")), 3000)
    );

    const quotes: any[] = await Promise.race([quotePromise, timeoutPromise]);
    const results: TickerItem[] = [];

    symbols.forEach((sym) => {
      const quote = quotes?.find((q) => q.symbol === sym.id);
      if (
        quote &&
        typeof quote.regularMarketPrice === "number" &&
        typeof quote.regularMarketChange === "number" &&
        typeof quote.regularMarketChangePercent === "number"
      ) {
        results.push({
          symbol: sym.id,
          label: sym.label,
          value: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          group: sym.group as "index" | "commodity" | "forex",
          delayed: true,
        });
      }
    });

    if (results.length > 0) {
      cachedLiveQuotes = results;
      lastFetchTime = Date.now();
      return NextResponse.json(results);
    }

    // If upstream returns empty data, return existing genuine cache or empty array (never fake data)
    return NextResponse.json(cachedLiveQuotes.length > 0 ? cachedLiveQuotes : []);
  } catch (error: any) {
    // Return previously verified cache if valid, otherwise empty array with unavailable state
    if (cachedLiveQuotes.length > 0 && now - lastFetchTime < 300000) {
      return NextResponse.json(cachedLiveQuotes);
    }

    return NextResponse.json([]);
  }
}
