export interface Trade {
    id: string;
    instrument: string;
    type: string;
    units: number;
    openPrice: number;
    closePrice?: number | null;
    profitLoss?: number | null;
    status: 'OPEN' | 'CLOSED';
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }

export interface CreateTradeInput {
    userId: string;
    instrument: string;
    units: number;
    type: 'BUY' | 'SELL';
    openPrice: number;
}

export interface UpdateTradeInput {
    id: string;
    closePrice?: number;
    status?: 'CLOSED';
}

export interface TradeResponse {
    trade: Trade;
    message?: string;
}