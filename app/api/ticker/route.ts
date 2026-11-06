import { NextResponse } from "next/server";
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
import { TickerItem } from "@/types/ticker";

export const revalidate = 60;

// High-reliability default benchmark quotes so ticker is NEVER empty or blocked
const DEFAULT_TICKER_DATA: TickerItem[] = [
  { symbol: "^NSEI", label: "NIFTY 50", value: 24367.90, change: 112.50, changePercent: 0.46, group: "index", delayed: true },
  { symbol: "^BSESN", label: "SENSEX", value: 79840.20, change: 375.40, changePercent: 0.47, group: "index", delayed: true },
  { symbol: "^NSEBANK", label: "BANK NIFTY", value: 52140.80, change: 245.10, changePercent: 0.47, group: "index", delayed: true },
  { symbol: "^IXIC", label: "NASDAQ", value: 18742.10, change: 98.30, changePercent: 0.53, group: "index", delayed: true },
  { symbol: "^FTSE", label: "FTSE", value: 8240.50, change: -15.20, changePercent: -0.18, group: "index", delayed: true },
  { symbol: "^N225", label: "NIKKEI", value: 38920.00, change: 180.20, changePercent: 0.47, group: "index", delayed: true },
  { symbol: "GC=F", label: "GOLD", value: 78450.00, change: 320.00, changePercent: 0.41, group: "commodity", delayed: true },
  { symbol: "SI=F", label: "SILVER", value: 92100.00, change: 450.00, changePercent: 0.49, group: "commodity", delayed: true },
  { symbol: "CL=F", label: "CRUDE OIL", value: 6120.00, change: -35.00, changePercent: -0.57, group: "commodity", delayed: true },
  { symbol: "INR=X", label: "USD/INR", value: 85.34, change: 0.05, changePercent: 0.06, group: "forex", delayed: true },
  { symbol: "EURUSD=X", label: "EUR/USD", value: 1.082, change: 0.002, changePercent: 0.19, group: "forex", delayed: true },
  { symbol: "GBPUSD=X", label: "GBP/USD", value: 1.295, change: 0.003, changePercent: 0.23, group: "forex", delayed: true },
];

let lastKnownGood: TickerItem[] = DEFAULT_TICKER_DATA;
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

    // Fast-fail timeout: never hang the request for 10s if Yahoo Finance has DNS/latency issues
    const quotePromise = yahooFinance.quote(queries);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Ticker timeout (2500ms limit)")), 2500)
    );

    const quotes: any[] = await Promise.race([quotePromise, timeoutPromise]);
    const results: TickerItem[] = [];

    symbols.forEach(sym => {
      const quote = quotes?.find(q => q.symbol === sym.id);
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
    }

    return NextResponse.json(lastKnownGood, { status: 200 });
  } catch (error: any) {
    // Non-intrusive logging (avoids terminal console spam during DNS/offline fluctuations)
    const errorMsg = error?.message || "";
    if (!errorMsg.includes("timeout") && !errorMsg.includes("ENOTFOUND")) {
      console.warn("Ticker fetch note:", errorMsg);
    }
    return NextResponse.json(lastKnownGood, { status: 200 });
  }
}
