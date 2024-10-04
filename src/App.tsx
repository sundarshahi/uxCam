import Alert from "@/components/alert";
import Spinner from "@/components/spinner";
import ImageItem from "@/components/image-item";
import SearchForm from "@/components/search-form";
import MasonryLayout from "@/components/masonry-layout";

import useMedia from "@/hooks/useMedia";
import useApi, { Gif } from "@/hooks/useApi";
import useDebounce from "@/hooks/useDebounce";
import useSearchForm from "@/hooks/useSearchForm";

import {
  getComponentWrapperWidth,
  getDefaultMasonryConfig,
  getMasonryConfigExceptLast,
  getMediaBreakpoints,
} from "@/lib/masonry";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./components/ui/pagination";
import { ThemeToggle } from "./components/theme-toggle";

export type ImageRenditionFileType = "gif" | "webp";

const masonryConfig = [
  { columns: 2, imageWidth: 110, gutter: 5 },
  { mq: "1020px", columns: 5, imageWidth: 120, gutter: 5 },
];

const App = () => {
  const {
    searchTerm,
    currentPage,
    handleInputChange,
    handleSearch,
    setCurrentPage,
  } = useSearchForm();

  const debouncedQuery = useDebounce(searchTerm, 500);

  const { data, pagination, loading, error } = useApi(
    debouncedQuery,
    currentPage
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(pagination.total_count / pagination.count)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const masonryConfigMatchMedia = useMedia(
    getMediaBreakpoints(masonryConfig),
    getMasonryConfigExceptLast(masonryConfig),
    getDefaultMasonryConfig(masonryConfig)
  )!;

  return (
    <div
      className="relative"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="absolute right-20 top-2">
        <ThemeToggle />
      </div>
      <div
        className={`giphy-componentWrapper`}
        style={{ width: getComponentWrapperWidth(masonryConfigMatchMedia) }}
      >
        <SearchForm
          value={searchTerm}
          setValue={handleInputChange}
          onSubmit={handleSearch}
          placeholder="Search Gifs"
        />

        <Alert
          show={data.length === 0 && !loading && !error}
          message="No matches found. Search again with right keyword."
        />

        <Alert show={!!error} message={error} />
        <Spinner show={loading} message="Loading..." />

        <div className="overflow-y-auto h-[600px]">
          {data.length > 0 && (
            <MasonryLayout sizes={masonryConfig}>
              {data.map((item: Gif) => (
                <ImageItem
                  item={item}
                  size={masonryConfigMatchMedia.imageWidth}
                  key={item.id}
                />
              ))}
            </MasonryLayout>
          )}
        </div>
        <div className="flex justify-center mt-5 gap-4">
          {data.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={handlePrevPage} />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-black dark: text-white">
                    {" "}
                    Page {currentPage} of{" "}
                    {Math.ceil(pagination.total_count / pagination.count)}{" "}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={handleNextPage} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
