import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const useSearchForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  const [searchTerm, setSearchTerm] = useState(query.get("q") || "");

  const [currentPage, setCurrentPage] = useState(
    Number(query.get("page")) || 1
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    params.set("page", String(currentPage));
    navigate({ search: params.toString() });
  }, [searchTerm, currentPage, location.search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setSearchTerm(e.target.value);
  };

  return {
    handleSearch,
    searchTerm,
    handleInputChange,
    currentPage,
    setCurrentPage,
  };
};

export default useSearchForm;
