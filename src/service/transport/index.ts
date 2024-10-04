/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/config/config";
import { Client } from "@/lib/client";
import { QueryObject } from "@/lib/query-stringg";

import {
  HttpTransaction,
  TransactionConfiguration,
  type Transaction,
} from "./transaction";

import SearchGifClient from "./search";

export default class Transport {
  readonly client: Client;
  private transactions: PersistedCollection<Transaction, TransactionRepository>;

  readonly searchGif: SearchGifClient;

  constructor(private root: Service) {
    this.transactions = new PersistedCollection({
      table: this.root.storage.table("transaction"),
      classConstructor: (
        json: Partial<
          HttpTransaction<
            unknown,
            QueryObject | null | undefined,
            { [x: string]: unknown } | null | undefined
          > &
            TransactionConfiguration
        >
      ): Transaction<unknown> => {
        // if (json.type === "websocket") {
        //   return "";
        // } else {
        //   return new HttpTransaction(json);
        // }
        return new HttpTransaction(json);
      },
      compare: (t1: { createdAt: number }, t2: { createdAt: number }) =>
        t1.createdAt - t2.createdAt,
    });

    this.transactions.performQuery((query: { all: () => any }) => query.all());

    this.client = new Client({
      app: "web",
      appVersion: config.VERSION,
      device: "browser",
      deviceId: ``,
    });

    this.client.onRefreshRequired = () =>
      root.auth.refreshToken(this.session?.refreshToken);

    this.searchGif = new SearchGifClient(this);
  }

  /**
   * Queue the transaction to be run as soon as possible
   */
  queue<T>(trx: Transaction<T>): Promise<T> {
    this.transactions.put(trx);
    this.runTransaction(trx);
    return trx.promise();
  }
}
