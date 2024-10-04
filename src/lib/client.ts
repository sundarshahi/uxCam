import { Backoff } from "./backoff";
import { ConnectionError } from "./connection-error";

type RequestConfig<
  E extends Record<string, unknown> | undefined = Record<string, unknown>
> = {
  url: string;
  method: string;
  data?: E;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

interface ApiClientOptions {
  app: string;
  appVersion: string;
  device: string;
  deviceId: string;
  desktopVersion?: string;
}

export class Client {
  private backoff: Backoff;
  private isAlreadyFetchingAccessToken: boolean;
  private idToken: string | null;
  private state: "authenticated" | "unauthenticated" | "reauthenticating";
  private debug: (message: string, ...args: unknown[]) => void;
  onRefreshRequired?: () => Promise<{ idToken: string }> | undefined;

  private app: string;
  private appVersion: string;
  private device: string;
  private deviceId: string;

  constructor({ app, appVersion, device, deviceId }: ApiClientOptions) {
    this.app = app;
    this.appVersion = appVersion;
    this.device = device;
    this.deviceId = deviceId;

    this.backoff = Backoff.exponential({
      factor: 2,
      initialDelay: 100,
      maxDelay: 6e4,
      randomisationFactor: 0.4,
    });
    this.isAlreadyFetchingAccessToken = false;

    this.idToken = null;
    this.state = "unauthenticated";
    this.debug = console.log;

    this.backoff.on("backoff", (attempt, delay) => {
      if (this.state === "reauthenticating") {
        this.debug(`Will attempt to refresh the token in ${delay}ms`);
      }
    });

    this.backoff.on("ready", (attempt) => {
      if (this.state === "reauthenticating") {
        this.debug(`Attempting to refresh the token (attempt: ${attempt}).`);
        this.refreshSession();
      }
    });
  }

  private async fetchWithRetry(
    config: RequestConfig
  ): Promise<Record<string, unknown>> {
    const { url, method, data, headers, signal } = config;

    while (true) {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            ...headers,
            ...(this.idToken ? { Authorization: this.idToken } : {}),
          },
          body: JSON.stringify(data),
          signal,
        });

        if (!response.ok) {
          throw new ConnectionError(`HTTP error! Status: ${response.status}`, {
            code: response.status.toString(),
          });
        }

        return await response.json();
      } catch (error) {
        if (error instanceof ConnectionError) {
          if (this.backoff) {
            const delay = this.backoff.next();
            this.debug(`Retrying in ${delay}ms due to error: ${error.message}`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }
  }

  private async refreshSession(): Promise<void> {
    this.state = "reauthenticating";
    // Logic to refresh session token should go here.
    // Use this.onRefreshRequired to invoke the provided function if it exists.

    try {
      const tokenData = (await this.onRefreshRequired?.()) || { idToken: "" };
      this.setSession(tokenData);
    } catch (error) {
      this.debug(`Refresh token call failed: ${error}`);
      if (error instanceof ConnectionError) {
        this.resetSession();
      } else {
        this.backoff.backoff();
        throw error;
      }
    }
  }

  private setSession(data: { idToken: string }): void {
    this.idToken = data.idToken;
    this.state = "authenticated";
    this.backoff.reset();
  }

  private resetSession(): void {
    this.idToken = null;
    this.state = "unauthenticated";
    this.backoff.reset();
  }

  async perform<
    R,
    E extends Record<string, unknown> | undefined = Record<string, unknown>
  >(config: RequestConfig<E>): Promise<R> {
    const { url, method, data, headers, signal } = config;

    const response = await this.fetchWithRetry({
      url,
      method,
      data,
      headers,
      signal,
    });

    return response as R;
  }

  get(
    url: string,
    headers?: Record<string, string>
  ): Promise<Record<string, unknown>> {
    return this.perform({ url, method: "GET", headers });
  }

  post(
    url: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<Record<string, unknown>> {
    return this.perform({ url, method: "POST", data, headers });
  }

  put(
    url: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<Record<string, unknown>> {
    return this.perform({ url, method: "PUT", data, headers });
  }

  delete(
    url: string,
    headers?: Record<string, string>
  ): Promise<Record<string, unknown>> {
    return this.perform({ url, method: "DELETE", headers });
  }

  setToken(token: string | null) {
    this.idToken = token;
  }
}
