import { API_KEY, BASE_URI } from "@/config/config";
import { useReducer, useEffect, Reducer } from "react";

interface Pagination {
  total_count: number;
  offset: number;
  count: number;
}

interface Meta {
  status: number;
  msg: string;
  response_id: string;
}
interface ImageItemImages {
  [key: string]: {
    width: number;
    height: number;
    [key: string]: string | number;
  };
}

export interface Gif {
  type: string;
  id: string;
  slug: string;
  url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  update_datetime: string;
  create_datetime: string;
  import_datetime: string;
  trending_datetime: string;
  title: string;
  alt_text: string;
  images: ImageItemImages;
}

interface ActionProps {
  type: string;
  payload?: {
    data: Gif[];
    pagination: Pagination;
    meta: Meta;
  };
  error?: string;
}

interface StateProps {
  data: Gif[];
  pagination: Pagination;
  meta: Meta;
  loading: boolean;
  error: string | null;
}

const initialState: StateProps = {
  data: [],
  pagination: {
    total_count: 0,
    offset: 0,
    count: 0,
  },
  meta: {
    status: 200,
    msg: "",
    response_id: "",
  },
  loading: false,
  error: null,
};

const apiReducer: Reducer<StateProps, ActionProps> = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload?.data || [],
        pagination: action.payload?.pagination || initialState.pagination,
        meta: action.payload?.meta || initialState.meta,
      };

    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.error || "An error occurred.",
      };

    default:
      throw new Error("Unhandled action type");
  }
};

const useApi = (query: string, currentPage: number) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  useEffect(() => {
    const fetchGifs = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const response = await fetch(
          `${BASE_URI}?api_key=${API_KEY}&q=${query}&offset=${
            (currentPage - 1) * 25
          }&limit=25`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result.data || [],
            pagination: result.pagination,
            meta: result.meta,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAILURE",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    if (query) {
      fetchGifs();
    }
  }, [query, currentPage]);

  return state;
};

export default useApi;
