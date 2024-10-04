import config from "@/config/config";

import type Transport from ".";
import { HttpTransaction } from "./transaction";

export default class SearchGif {
  constructor(private transport: Transport) {}

  fetch(query: {
    since?: Date;
    limit?: number;
    lastId?: string;
    includeDeleted?: boolean;
  }): Promise<unknown> {
    return this.transport.queue(
      new HttpTransaction({
        url: `${config.BASE_URI}?api_key=${config.API_KEY}`,
        query,
      })
    );
  }
}
