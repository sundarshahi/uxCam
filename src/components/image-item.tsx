type ImageRenditionFileType = "gif" | "webp";

interface ImageItemImages {
  [key: string]: {
    width: number;
    height: number;
    [key: string]: string | number;
  };
}

interface ImageItemProps {
  backgroundColor?: string;
  item: {
    title: string;
    images: ImageItemImages;
  };
  imageRenditionName?: string;
  imageRenditionFileType?: ImageRenditionFileType;
  listItemClassName?: string;
  onSelect?: (item: unknown) => void;
  size: number;
}

const getUrl = (fileType: ImageRenditionFileType): string => {
  if (fileType === "gif") {
    return "url";
  }

  return fileType;
};

const ImageItem: React.FC<ImageItemProps> = ({
  backgroundColor,
  item,
  imageRenditionName = "fixed_width_downsampled",
  imageRenditionFileType = "gif",
  size,
  listItemClassName,
  onSelect,
}) => {
  return (
    <button
      data-testid="ImageItemButton"
      type="button"
      className={`giphy-imageButton${
        listItemClassName ? ` ${listItemClassName}` : ""
      }`}
      style={{
        backgroundColor,
        width: `${size}px`,
        height: `${
          (item.images[imageRenditionName].height * size) /
          item.images[imageRenditionName].width
        }px`,
      }}
      onClick={() => onSelect?.(item)}
    >
      <img
        data-testid="ImageItemImage"
        width={item.images[imageRenditionName].width}
        height={item.images[imageRenditionName].height}
        alt={item.title}
        src={String(
          item.images[imageRenditionName][getUrl(imageRenditionFileType)]
        )}
        className="giphy-image"
      />
    </button>
  );
};

export default ImageItem;
