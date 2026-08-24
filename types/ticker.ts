export interface TickerItem {
  symbol: string;
  label: string;
  value: number;
  change: number;
  changePercent: number;
  group: "index" | "commodity" | "forex";
  delayed: true;
}
