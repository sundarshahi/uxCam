import { cn } from "@/lib/utils";

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
  item,
  imageRenditionName = "fixed_width_downsampled",
  imageRenditionFileType = "gif",
  size,
  onSelect,
}) => {
  return (
    <button
      data-testid="image-item-button"
      type="button"
      className={cn(
        "p-0 outline-inherit text-inherit	border-none cursor-pointer transition-opacity ease-in duration-300 opacity-100 hover:opacity-0 focus:opacity-60"
      )}
      style={{
        width: `${size}px`,
        height: `${
          (item.images[imageRenditionName].height * size) /
          item.images[imageRenditionName].width
        }px`,
      }}
      onClick={() => onSelect?.(item)}
    >
      <img
        data-testid="image-item"
        width={item.images[imageRenditionName].width}
        height={item.images[imageRenditionName].height}
        alt={item.title}
        src={String(
          item.images[imageRenditionName][getUrl(imageRenditionFileType)]
        )}
        className="block w-full h-auto	"
      />
    </button>
  );
};

export default ImageItem;
