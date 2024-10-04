import objectId from "@/lib/objectId";
import { type Client } from "@/lib/client";
import { toQueryString, QueryObject } from "@/lib/query-stringg";

type Method = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

type RequestData = Record<string, unknown>;

type PromiseFunc<T> = {
  resolve: (res: T) => void;
  reject: (error: Error) => void;
};

type RetriableConfiguration =
  | {
      retry: true;
      retryAttempts?: number;
    }
  | {
      retry?: boolean;
      retryAttempts?: never;
    };

type _TransactionConfiguration = {
  queue?: string;
  signal?: AbortSignal;
  retry?: boolean;
  retryAttempts?: number;
};

export type TransactionConfiguration = Omit<
  _TransactionConfiguration,
  "retry" | "retryAttempts"
> &
  RetriableConfiguration;

export abstract class Transaction<T> implements _TransactionConfiguration {
  abstract id: string;
  type: string | null = null;
  status: "queued" | "in-progress" | "completed" = "queued";
  queue?: string = "";
  response: T | null = null;
  error: Error | null = null;
  retry?: boolean = false;
  retryAttempts?: number = 0;
  readonly signal?: AbortSignal;
  createdAt = Date.now();

  private promises: PromiseFunc<T>[] = [];

  get isPending() {
    return this.status === "queued";
  }

  promise(): Promise<T> {
    if (this.status === "completed" && this.error) {
      return Promise.reject(this.error);
    } else if (this.status === "completed" && this.response) {
      return Promise.resolve(this.response);
    } else {
      return new Promise<T>((resolve, reject) => {
        this.promises.push({ resolve, reject });
      });
    }
  }

  fulfill(response: T): T {
    this.status = "completed";
    this.response = response;
    this.promises.forEach((p) => p.resolve(response));
    this.promises = [];
    return response;
  }

  reject(error: Error): Error {
    this.status = "completed";
    this.error = error;
    this.promises.forEach((p) => p.reject(error));
    this.promises = [];
    return this.error;
  }

  abstract serialize(): Record<string, unknown>;

  abstract deserialize(json: Record<string, unknown>): this;
}

export class HttpTransaction<
  R,
  Q extends QueryObject | null | undefined = QueryObject | null | undefined,
  T extends RequestData | null | undefined = RequestData | null | undefined
> extends Transaction<R> {
  override id = objectId();
  override type = "http";
  url: string | null = null;
  method?: Method = "GET";
  query?: Q | null = null;
  body?: T | null = null;
  headers?: Record<string, string>;

  constructor(
    params: Partial<HttpTransaction<R, Q, T> & TransactionConfiguration>
  ) {
    super();
    Object.assign(this, params);
  }

  run(client: Client): Promise<R> {
    this.status = "in-progress";
    return client
      .perform<R, RequestData | undefined>({
        url: `${this.url}${toQueryString(
          typeof this.query === "object" ? this.query : null
        )}`,
        method: this.method!,
        data: this.body !== null ? (this.body as RequestData) : undefined,
        headers: this.headers,
        signal: this.signal,
      })
      .then(this.fulfill.bind(this));
  }

  deserialize = (json: Record<string, unknown>) => {
    Object.assign(this, json);
    return this;
  };

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      status: this.status,
      queue: this.queue,
      response: this.response,
      error: this.error,
      retry: this.retry,
      retryAttempts: this.retryAttempts,
      url: this.url,
      method: this.method,
      query: this.query,
      body: this.body,
    };
  }
}
