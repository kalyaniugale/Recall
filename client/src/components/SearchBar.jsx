function SearchBar({
  query,
  setQuery,
  onSearch,
  searching,
}) {

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch();
  };

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        placeholder="Search anything you remember..."
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
      />

      <button
        type="submit"
        disabled={searching}
      >
        {searching
          ? "Searching..."
          : "Search"}
      </button>

    </form>
  );
}

export default SearchBar;