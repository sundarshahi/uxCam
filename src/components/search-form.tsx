import React from "react";

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  searchFormClassName?: string; // Optional
  setValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  autoFocus?: boolean; // Optional
}

const SearchForm: React.FC<Props> = ({
  onSubmit,
  placeholder,
  setValue,
  value,
  autoFocus = false, // Default to false
}) => {
  return (
    <form
      data-testid="SearchFormForm"
      onSubmit={onSubmit}
      autoComplete="off"
      className={`giphy-searchForm-form`}
    >
      <input
        data-testid="SearchFormInput"
        type="text"
        placeholder={placeholder}
        onChange={setValue}
        value={value}
        name="search"
        className="giphy-searchForm-input"
        autoFocus={autoFocus}
      />
    </form>
  );
};

export default SearchForm;
