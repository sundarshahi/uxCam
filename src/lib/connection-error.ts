class ConnectionError extends Error {
  data: Record<string, unknown> | null;

  constructor(message: string, data: Record<string, unknown> | null = null) {
    super(message);
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  get code(): string {
    return this.data && typeof this.data === "object" && "code" in this.data
      ? (this.data as { code: string }).code
      : "UNKNOWN";
  }
}

class InvalidRequestError extends ConnectionError {}
class LoginFailedError extends ConnectionError {}
class NetworkIssueError extends ConnectionError {}
class AccessDeniedError extends ConnectionError {}
class NotFoundError extends ConnectionError {}
class TooManyRequestsError extends ConnectionError {}
class DefaultError extends ConnectionError {}

function getErrorMessage(error: ConnectionError): string {
  const errorMessages: Record<string, string> = {
    InvalidRequestError: "Invalid request",
    LoginFailedError: "Login failed",
    NetworkIssueError: "Network issue",
    AccessDeniedError: "Access denied",
    NotFoundError: "Not found",
    TooManyRequestsError: "Too many requests",
    DefaultError: "Hmmm...",
  };

  return errorMessages[error.constructor.name] || "An unknown error occurred.";
}

function handleErrorResponse(response: {
  status: number;
  data?: Record<string, unknown>;
}): ConnectionError {
  const { status, data } = response;

  switch (status) {
    case 400:
      return new InvalidRequestError(
        getErrorMessage(new InvalidRequestError("")),
        data
      );
    case 401:
      return new LoginFailedError(
        getErrorMessage(new LoginFailedError("")),
        data
      );
    case 403:
      return new AccessDeniedError(
        getErrorMessage(new AccessDeniedError("")),
        data
      );
    case 404:
      return new NotFoundError(getErrorMessage(new NotFoundError("")), data);
    case 429:
      return new TooManyRequestsError(
        getErrorMessage(new TooManyRequestsError("")),
        data
      );
    case 503:
      return new NetworkIssueError(
        getErrorMessage(new NetworkIssueError("")),
        data
      );
    default:
      return new DefaultError(getErrorMessage(new DefaultError("")), data);
  }
}

// Exporting the main class and utility functions
export {
  ConnectionError,
  InvalidRequestError,
  LoginFailedError,
  NetworkIssueError,
  AccessDeniedError,
  NotFoundError,
  TooManyRequestsError,
  handleErrorResponse,
  getErrorMessage,
};
