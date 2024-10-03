import { useEffect, useState } from "react";

export default function useMedia<T>(
  queries: string[],
  values: T[],
  defaultValue: T
): T {
  const mediaQueryLists = queries.map((q) => window.matchMedia(q));

  const getValue = (): T => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);

    return typeof values[index] !== "undefined" ? values[index] : defaultValue;
  };

  const [value, setValue] = useState<T>(getValue);

  useEffect(() => {
    const handler = () => setValue(getValue);

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener("change", handler);
    });

    return () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", handler);
      });
    };
  }, [mediaQueryLists]);

  return value;
}
