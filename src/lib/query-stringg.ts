import isNonNull from "../lib/isNonNull";

export type QueryObject = {
  [key: string]: string | number | boolean | Date | null | undefined;
};

export const toQueryString = (obj?: QueryObject | null): string => {
  if (!obj) {
    return "";
  }

  const params = Object.keys(obj)
    .map((key) => {
      const value = obj[key];
      if (value !== undefined && value !== null) {
        const encodedValue =
          value instanceof Date ? value.toISOString() : value;

        const parameter = `${encodeURIComponent(key)}=${encodeURIComponent(
          encodedValue
        )}`;
        return parameter;
      } else {
        return null;
      }
    })
    .filter(isNonNull);

  if (params.length > 0) {
    return `?${params.join("&")}`;
  }
  return "";
};

export const fromQueryString = (
  string?: string | null
): { [key: string]: string } => {
  if (!string) {
    return {};
  }
  if (string.charAt(0) === "?" || string.charAt(0) === "#") {
    return fromQueryString(string.substr(1));
  }

  return string.split("&").reduce((hash: { [key: string]: string }, part) => {
    const [key, value] = part.split("=");
    hash[decodeURIComponent(key)] = decodeURIComponent(value || "");
    return hash;
  }, {});
};
