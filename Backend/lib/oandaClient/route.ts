import { Context } from "@v20-javascript/context";
import { AccountID } from "@v20-javascript/primitives";
import { getAccountSummary } from "@/lib/oandaClient/route";

const accountId = process.env.OANDA_ACCOUNT_ID as AccountID;
const accessToken = process.env.OANDA_ACCESS_TOKEN as string;

export const oandaClient = new Context({
  hostname: "api-fxpractice.oanda.com", // Use 'api-fxtrade.oanda.com' for live trading
  port: 443,
  token: accessToken,
});

export async function placeTrade(
  instrument: string,
  units: number,
  type: "buy" | "sell"
) {
  return await oandaClient.order.create(accountId, {
    type: "MARKET",
    instrument,
    units: type === "buy" ? units : -units,
  });
}

export async function getOpenTrades() {
  return await oandaClient.trade.list(accountId);
}

export async function closeTrade(tradeId: string) {
  return await oandaClient.trade.close(accountId, tradeId);
}

export async function getInstruments() {
  const response = await oandaClient.account.instruments(accountId);
  return response.instruments;
}

export async function getPricing(instruments: string[]) {
  return await oandaClient.pricing.get(accountId, {
    instruments: instruments as InstrumentName[],
  });
}

// Add this new function to get the price for a specific instrument
export async function getInstrumentPrice(instrument: string) {
  const response = await oandaClient.pricing.get(accountId, {
    instruments: [instrument],
  });
  if (response.prices && response.prices.length > 0) {
    return response.prices[0].closeoutAsk;
  }
  throw new Error("Unable to fetch instrument price");
}

// Add this new function to fetch candle data
export async function getInstrumentCandles(
  instrument: string,
  params: any = {}
) {
  return await oandaClient.instrument.candles(instrument as InstrumentName, {
    count: 1,
    price: "M",
    granularity: "S5",
    ...params,
  });
}

export async function getAccountInstruments() {
  return await oandaClient.account.instruments(accountId);
}
