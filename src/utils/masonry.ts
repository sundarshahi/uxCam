export interface MasonryConfigItem {
  columns: number;
  imageWidth: number;
  gutter: number;
  mq?: string;
}

export type MasonryConfig = MasonryConfigItem[];

export const getMasonryConfig = (
  masonryConfig: MasonryConfig
): MasonryConfigItem[] =>
  masonryConfig
    .map((c) => ({
      columns: c.columns,
      imageWidth: c.imageWidth,
      gutter: c.gutter,
    }))
    .reverse();

export const getMasonryConfigExceptLast = (
  masonryConfig: MasonryConfig
): MasonryConfigItem[] => {
  const returnedMasonryConfig = getMasonryConfig(masonryConfig);
  return returnedMasonryConfig.slice(0, returnedMasonryConfig.length - 1);
};

export const getDefaultMasonryConfig = (
  masonryConfig: MasonryConfig
): MasonryConfigItem | undefined => {
  const returnedMasonryConfig = getMasonryConfig(masonryConfig);
  return returnedMasonryConfig[returnedMasonryConfig.length - 1];
};

export const getMediaBreakpoints = (masonryConfig: MasonryConfig): string[] =>
  masonryConfig
    .map((c) => (c.mq !== undefined ? `(min-width: ${c.mq})` : null))
    .filter((i): i is string => i !== null)
    .reverse();

export const getComponentWrapperWidth = (
  masonryConfig: MasonryConfigItem
): number => {
  return (
    masonryConfig.imageWidth * masonryConfig.columns +
    masonryConfig.gutter * (masonryConfig.columns - 1)
  );
};
