function SearchBar({
  query,
  setQuery,
  onSearch,
  searching,
}) {
  const handleSubmit = (
    event
  ) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
    >
      <span className="search-icon">
        ⌕
      </span>

      <input
        type="text"
        placeholder="Try 'that reel about rate limiting'..."
        value={query}
        onChange={(event) =>
          setQuery(
            event.target.value
          )
        }
      />

      <button
        type="submit"
        disabled={searching}
      >
        {searching
          ? "Looking..."
          : "Find it"}
      </button>
    </form>
  );
}

export default SearchBar;