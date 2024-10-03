import SearchForm from "./components/search-form";

import useSearchForm from "./hooks/useSearchForm";

import {
  getComponentWrapperWidth,
  getDefaultMasonryConfig,
  getMasonryConfigExceptLast,
  getMediaBreakpoints,
} from "./utils/masonry";
import useMedia from "./hooks/useMedia";
import MasonryLayout from "./components/MasonryLayout";
import ImageItem from "./components/ImageItem";
import useApi, { Gif } from "./hooks/useApi";
import useDebounce from "./hooks/useDebounce";

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
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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

        {loading && <p>Loading...</p>}
        {error && <p>Error fetching GIFs: {error}</p>}

        <div className={`giphy-listWrapper`} style={{ height: "800px" }}>
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
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            {" "}
            Page {currentPage} of{" "}
            {Math.ceil(pagination.total_count / pagination.count)}{" "}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage >=
              Math.ceil(pagination.total_count / pagination.count)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
