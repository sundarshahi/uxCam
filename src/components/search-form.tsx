import React from "react";
import { Input } from "@/components/ui/input";

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  searchFormClassName?: string;
  setValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  autoFocus?: boolean;
}

const SearchForm: React.FC<Props> = ({
  onSubmit,
  placeholder,
  setValue,
  value,
}) => {
  return (
    <form
      data-testid="search-form"
      onSubmit={onSubmit}
      autoComplete="off"
      className="relative mb-8"
    >
      <Input
        data-testid="search-form-input"
        type="text"
        placeholder={placeholder}
        onChange={setValue}
        value={value}
        name="search"
      />
    </form>
  );
};

export default SearchForm;
