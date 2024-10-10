declare module "@v20-javascript/context" {
  export class Context {
    constructor(options: { hostname: string; port: number; token: string });
    account: any;
    order: any;
    trade: any;
    pricing: any;
  }
}

declare module "@v20-javascript/primitives" {
  export type AccountID = string;
}
