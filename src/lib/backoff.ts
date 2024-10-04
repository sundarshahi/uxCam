type BackoffListener<T extends unknown[]> = (...args: T) => void;

interface BackoffOptions {
  factor?: number;
  initialDelay?: number;
  maxDelay?: number;
  randomisationFactor?: number;
}

class ExponentialBackoffStrategy {
  private factor: number;
  private initialDelay: number;
  private maxDelay: number;
  private currentDelay: number;

  constructor({
    factor = 2,
    initialDelay = 100,
    maxDelay = 60000,
  }: BackoffOptions) {
    if (initialDelay <= 0)
      throw new Error("Initial delay must be greater than 0.");
    if (maxDelay <= 0) throw new Error("Max delay must be greater than 0.");
    if (maxDelay <= initialDelay)
      throw new Error("Max delay must be greater than initial delay.");

    this.factor = factor;
    this.initialDelay = initialDelay;
    this.maxDelay = maxDelay;
    this.currentDelay = initialDelay;
  }

  next(): number {
    const delay = this.currentDelay;
    this.currentDelay = Math.min(
      this.currentDelay * this.factor,
      this.maxDelay
    );
    return delay;
  }

  reset(): void {
    this.currentDelay = this.initialDelay;
  }
}

export class Backoff {
  private backoffStrategy_: ExponentialBackoffStrategy;
  private maxNumberOfRetry_: number;
  private backoffNumber_: number;
  private timeoutID_: NodeJS.Timeout | null;
  private listeners_: { [key: string]: BackoffListener<unknown[]>[] };

  constructor(strategy: ExponentialBackoffStrategy, maxRetries: number = -1) {
    this.backoffStrategy_ = strategy;
    this.maxNumberOfRetry_ = maxRetries;
    this.backoffNumber_ = 0;
    this.timeoutID_ = null;
    this.listeners_ = { ready: [], backoff: [], fail: [] };
  }

  static exponential(options: BackoffOptions): Backoff {
    return new Backoff(new ExponentialBackoffStrategy(options));
  }

  next(): number {
    return this.backoffStrategy_.next();
  }

  backoff(error?: Error): void {
    if (this.timeoutID_ !== null) throw new Error("Backoff in progress.");

    if (this.backoffNumber_ >= this.maxNumberOfRetry_) {
      this.emit("fail", error ?? new Error("Max retries reached"));
      this.reset();
    } else {
      const delay = this.next(); // Call the next method here
      this.timeoutID_ = setTimeout(this.onBackoff_.bind(this), delay);
      this.emit("backoff", this.backoffNumber_, delay, error);
    }
  }

  reset(): void {
    this.backoffNumber_ = 0;
    this.backoffStrategy_.reset();
    if (this.timeoutID_) {
      clearTimeout(this.timeoutID_);
    }
    this.timeoutID_ = null;
  }

  on(
    event: "ready" | "backoff" | "fail",
    callback: BackoffListener<unknown[]>
  ): void {
    if (this.listeners_[event]) {
      this.listeners_[event].push(callback);
    } else {
      throw new Error(`Event ${event} is not supported.`);
    }
  }

  emit(event: "ready" | "backoff" | "fail", ...args: unknown[]): void {
    for (const listener of this.listeners_[event]) {
      listener(...args);
    }
  }

  private onBackoff_(): void {
    this.timeoutID_ = null;
    this.emit("ready", this.backoffNumber_);
    this.backoffNumber_++;
  }
}
