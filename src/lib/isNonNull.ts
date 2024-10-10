export default function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export function assertIsNotUndefined<T>(
  value: T
): asserts value is Exclude<T, undefined> {
  if (value === undefined) {
    throw new Error("Value was undefined");
  }
}
