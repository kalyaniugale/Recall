import {
  useEffect,
  useState,
} from "react";

import SearchBar from "../components/SearchBar";
import UploadBox from "../components/UploadBox";
import MemoryGrid from "../components/MemoryGrid";

import {
  getMemories,
  uploadScreenshot,
  searchMemories,
  deleteMemory,
} from "../api/memory.api";
import MemoryModal from "../components/MemoryModal";

function HomePage() {

  const [memories, setMemories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  const [isSearchMode, setIsSearchMode] =
    useState(false);
  
  const [openedMemory, setOpenedMemory] =
  useState(null);

  // --------------------------------
  // Load recent memories
  // --------------------------------

  const loadMemories = async () => {
    try {
      setLoading(true);

      const data =
        await getMemories();

      setMemories(data);

      setIsSearchMode(false);

    } catch (error) {

      console.error(
        "Failed to load memories:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    loadMemories();
  }, []);


  // --------------------------------
  // Upload screenshot
  // --------------------------------

  const handleUpload = async () => {

    if (!selectedFile) {
      return;
    }

    try {

      setUploading(true);

      const memory =
        await uploadScreenshot(
          selectedFile
        );

      setMemories((previous) => [
        memory,
        ...previous,
      ]);

      setSelectedFile(null);

    } catch (error) {

      console.error(
        "Upload failed:",
        error
      );

    } finally {

      setUploading(false);
    }
  };


  // --------------------------------
  // Semantic search
  // --------------------------------

  const handleSearch = async () => {

    if (!query.trim()) {
      await loadMemories();
      return;
    }

    try {

      setSearching(true);

      const results =
        await searchMemories(
          query.trim()
        );

      // Search API returns:
      //
      // {
      //   memory: {...},
      //   distance: ...
      // }
      //
      // UI currently only needs Memory.

      const foundMemories =
        results.map(
          (result) => result.memory
        );

      setMemories(foundMemories);

      setIsSearchMode(true);

    } catch (error) {

      console.error(
        "Search failed:",
        error
      );

    } finally {

      setSearching(false);
    }
  };


  // --------------------------------
  // Delete memory
  // --------------------------------

  const handleDelete = async (memoryId) => {
  const confirmed = window.confirm(
    "Delete this memory permanently?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteMemory(memoryId);

    setMemories((previous) =>
      previous.filter(
        (memory) => memory._id !== memoryId
      )
    );

  } catch (error) {
    console.error(
      "Delete failed:",
      error
    );

    alert(
      "Could not delete this memory. Please try again."
    );
  }
};


  return (
    <main>

      <header className="hero">

        <h1>Recall</h1>

        <p>
          Remember anything.
          Find everything.
        </p>

        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          searching={searching}
        />

      </header>


      <UploadBox
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onUpload={handleUpload}
        uploading={uploading}
      />


      <section className="memories-section">

        <div className="section-header">

          <h2>
            {isSearchMode
              ? "Search Results"
              : "Recent Memories"}
          </h2>

          {isSearchMode && (
            <button
              className="text-button"
              onClick={() => {
                setQuery("");
                loadMemories();
              }}
            >
              Clear search
            </button>
          )}

        </div>


        {loading ? (
          <p>Loading memories...</p>
        ) : (
          <MemoryGrid
            memories={memories}
            onDelete={handleDelete}
            onOpen={setOpenedMemory}
          />
        )}

      </section>
     
     <MemoryModal
  memory={openedMemory}
  onClose={() => setOpenedMemory(null)}
/>
    </main>
  );
}

export default HomePage;