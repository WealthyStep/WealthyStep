import { NextResponse } from "next/server";
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import { TickerItem } from "@/types/ticker";

export const revalidate = 60;

let lastKnownGood: TickerItem[] = [];
let lastFetchTime = 0;

export async function GET() {
  const now = Date.now();
  
  if (now - lastFetchTime < 60000 && lastKnownGood.length > 0) {
    return NextResponse.json(lastKnownGood);
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

    const queries = symbols.map(s => s.id);
    const quotes = await yahooFinance.quote(queries);
    const results: TickerItem[] = [];

    symbols.forEach(sym => {
      const quote = quotes.find(q => q.symbol === sym.id);
      if (quote && quote.regularMarketPrice && quote.regularMarketChange && quote.regularMarketChangePercent) {
        results.push({
          symbol: sym.id,
          label: sym.label,
          value: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          group: sym.group as "index" | "commodity" | "forex",
          delayed: true
        });
      }
    });

    if (results.length > 0) {
      lastKnownGood = results;
      lastFetchTime = Date.now();
      return NextResponse.json(results);
    } else {
      if (lastKnownGood.length > 0) return NextResponse.json(lastKnownGood);
      return NextResponse.json({ error: "Failed to fetch ticker data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Ticker fetch error", error);
    if (lastKnownGood.length > 0) return NextResponse.json(lastKnownGood);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
