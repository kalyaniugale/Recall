import {
  useEffect,
  useState,
} from "react";

import SearchBar from "../components/SearchBar";
import UploadBox from "../components/UploadBox";
import ReelBox from "../components/ReelBox";
import MemoryGrid from "../components/MemoryGrid";
import MemoryModal from "../components/MemoryModal";
import Toast from "../components/Toast";

import {
  getMemories,
  uploadScreenshot,
  saveReel,
  searchMemories,
  deleteMemory,
} from "../api/memory.api";


function HomePage({
  user,
  onLogout,
}) {

  // ==========================================
  // MEMORIES
  // ==========================================

  const [memories, setMemories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // NETWORK STATUS
  // ==========================================

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);


  // ==========================================
  // SCREENSHOT
  // ==========================================

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [uploading, setUploading] =
    useState(false);


  // ==========================================
  // REEL
  // ==========================================

  const [reelUrl, setReelUrl] =
    useState("");

  const [savingReel, setSavingReel] =
    useState(false);


  // ==========================================
  // SEARCH
  // ==========================================

  const [query, setQuery] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  const [
    isSearchMode,
    setIsSearchMode,
  ] = useState(false);


  // ==========================================
  // TOAST
  // ==========================================

  const [toast, setToast] =
    useState({
      message: "",
      type: "error",
    });


  const showToast = (
    message,
    type = "error"
  ) => {

    setToast({
      message,
      type,
    });

  };


  const closeToast = () => {

    setToast({
      message: "",
      type: "error",
    });

  };


  // ==========================================
  // MODAL
  // ==========================================

  const [
    openedMemory,
    setOpenedMemory,
  ] = useState(null);


  // ==========================================
  // DERIVED MEMORY GROUPS
  // ==========================================

  const reels =
    memories.filter(
      (memory) =>
        memory.type === "reel"
    );


  const screenshots =
    memories.filter(
      (memory) =>
        memory.type === "screenshot"
    );


  const recentMemories =
    memories.slice(0, 6);


  // ==========================================
  // LOAD MEMORIES
  // ==========================================

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


      // Don't show a second error when
      // we already know the device is offline.

      if (navigator.onLine) {

        showToast(
          error.message ||
          "Couldn't load your memories."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadMemories();

  }, []);


  // ==========================================
  // ONLINE / OFFLINE LISTENERS
  // ==========================================

  useEffect(() => {

    const handleOnline = () => {

      setIsOnline(true);

      showToast(
        "You're back online.",
        "success"
      );

      // Refresh memories after
      // connection returns.

      loadMemories();

    };


    const handleOffline = () => {

      setIsOnline(false);

    };


    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );


    return () => {

      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );

    };

  }, []);


  // ==========================================
  // UPLOAD SCREENSHOT
  // ==========================================

  const handleUpload = async () => {

    if (!isOnline) {

      showToast(
        "You're offline. Connect to save a memory."
      );

      return;

    }


    if (!selectedFile) {

      showToast(
        "Choose a screenshot first."
      );

      return;

    }


    try {

      setUploading(true);


      const memory =
        await uploadScreenshot(
          selectedFile
        );


      setMemories(
        (previous) => [
          memory,
          ...previous,
        ]
      );


      setSelectedFile(null);


      showToast(
        "Screenshot remembered.",
        "success"
      );


    } catch (error) {

      console.error(
        "Upload failed:",
        error
      );


      showToast(
        error.message ||
        "Couldn't keep that screenshot."
      );


    } finally {

      setUploading(false);

    }

  };


  // ==========================================
  // SAVE REEL
  // ==========================================

  const handleSaveReel = async () => {

    if (!isOnline) {

      showToast(
        "You're offline. Connect to save a Reel."
      );

      return;

    }


    const url =
      reelUrl.trim();


    if (!url) {

      showToast(
        "Paste a Reel link first."
      );

      return;

    }


    if (
      !url.includes(
        "instagram.com/reel/"
      )
    ) {

      showToast(
        "Please paste a valid Instagram Reel link."
      );

      return;

    }


    try {

      setSavingReel(true);


      const memory =
        await saveReel(url);


      setMemories(
        (previous) => [
          memory,
          ...previous,
        ]
      );


      setReelUrl("");


      showToast(
        "Reel remembered.",
        "success"
      );


    } catch (error) {

      console.error(
        "Failed to save Reel:",
        error
      );


      showToast(
        error.message ||
        "Couldn't keep that Reel."
      );


    } finally {

      setSavingReel(false);

    }

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = async () => {

    if (!isOnline) {

      showToast(
        "Search needs an internet connection."
      );

      return;

    }


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


      const foundMemories =
        results.map(
          (result) =>
            result.memory
        );


      setMemories(
        foundMemories
      );


      setIsSearchMode(true);


    } catch (error) {

      console.error(
        "Search failed:",
        error
      );


      showToast(
        error.message ||
        "Couldn't search your memories."
      );


    } finally {

      setSearching(false);

    }

  };


  // ==========================================
  // DELETE MEMORY
  // ==========================================

  const handleDelete = async (
    memoryId
  ) => {

    if (!isOnline) {

      showToast(
        "You're offline. Connect before deleting a memory."
      );

      return;

    }


    const confirmed =
      window.confirm(
        "Let this memory go?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteMemory(
        memoryId
      );


      setMemories(
        (previous) =>
          previous.filter(
            (memory) =>
              memory._id !==
              memoryId
          )
      );


      // Close modal if the deleted
      // memory is currently open.

      if (
        openedMemory?._id ===
        memoryId
      ) {

        setOpenedMemory(null);

      }


      showToast(
        "Memory removed.",
        "success"
      );


    } catch (error) {

      console.error(
        "Delete failed:",
        error
      );


      showToast(
        error.message ||
        "Couldn't delete this memory."
      );

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <main>

      {/* ======================================
          TOP BAR
      ====================================== */}

      <nav className="topbar">

        <div className="topbar-left">

          <div className="brand-mark">
            Recall
          </div>


          <span
            className="topbar-divider"
          />


          <div className="topbar-note">
            Your memory shelf
          </div>

        </div>


        <div className="topbar-user">

          <div className="user-avatar">

            {user?.name
              ?.charAt(0)
              .toUpperCase() ||
              "U"}

          </div>


          <div className="user-info">

            <span className="user-name">

              {user?.name ||
                "User"}

            </span>


            {user?.email && (

              <span className="user-email">

                {user.email}

              </span>

            )}

          </div>


          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            Log out
          </button>

        </div>

      </nav>


      {/* ======================================
          OFFLINE BANNER
      ====================================== */}

      {!isOnline && (

        <div className="offline-banner">

          <span
            className="offline-dot"
          />


          <div>

            <strong>
              You're offline
            </strong>


            <span>
              Your memories will be here
              when you're back.
            </span>

          </div>

        </div>

      )}


      {/* ======================================
          HERO
      ====================================== */}

      <header className="hero">

        <p className="eyebrow">

          A little place for things
          worth remembering

        </p>


        <h1>

          What are you trying
          to remember?

        </h1>


        <p className="hero-copy">

          Search the things you saved,
          even if you only remember a
          small part of them.

        </p>


        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          searching={searching}
        />


        <div className="search-examples">

          <span>
            “that rate limiting reel”
          </span>

          <span>
            “my React interview questions”
          </span>

          <span>
            “places I saved for later”
          </span>

        </div>

      </header>


      {/* ======================================
          KEEP SOMETHING SAFE
      ====================================== */}

      {!isSearchMode && (

        <section className="capture-section">

          <div className="section-heading">

            <div>

              <p className="section-kicker">
                Keep something safe
              </p>


              <h2>
                Save it before it slips
                your mind.
              </h2>

            </div>

          </div>


          <div className="capture-grid">

            <UploadBox
              selectedFile={
                selectedFile
              }
              setSelectedFile={
                setSelectedFile
              }
              onUpload={
                handleUpload
              }
              uploading={
                uploading
              }
            />


            <ReelBox
              reelUrl={
                reelUrl
              }
              setReelUrl={
                setReelUrl
              }
              onSave={
                handleSaveReel
              }
              saving={
                savingReel
              }
            />

          </div>

        </section>

      )}


      {/* ======================================
          SEARCH RESULTS
      ====================================== */}

      {isSearchMode ? (

        <section className="memory-section">

          <div className="section-heading row">

            <div>

              <p className="section-kicker">
                Here's what I found
              </p>


              <h2>
                Results for “{query}”
              </h2>

            </div>


            <button
              type="button"
              className="text-button"
              onClick={() => {

                setQuery("");

                loadMemories();

              }}
            >
              Back to everything
            </button>

          </div>


          {loading ? (

            <p className="status-text">

              Looking through your
              memories...

            </p>

          ) : memories.length === 0 ? (

            <div className="empty-state">

              <h3>
                Nothing matched that memory.
              </h3>

              <p>
                Try describing what you
                remember in another way.
              </p>

            </div>

          ) : (

            <MemoryGrid
              memories={
                memories
              }
              onDelete={
                handleDelete
              }
              onOpen={
                setOpenedMemory
              }
            />

          )}

        </section>

      ) : (

        <>

          {/* ==================================
              RECENT MEMORIES
          ================================== */}

          <section className="memory-section">

            <div className="section-heading">

              <p className="section-kicker">
                Recently remembered
              </p>


              <h2>
                Things you've kept
                close lately.
              </h2>

            </div>


            {loading ? (

              <p className="status-text">

                Gathering your
                memories...

              </p>

            ) : recentMemories.length ===
              0 ? (

              <div className="empty-state">

                <h3>
                  Your shelf is quiet
                  for now.
                </h3>

                <p>
                  Save a screenshot or
                  Reel and it'll appear
                  here.
                </p>

              </div>

            ) : (

              <MemoryGrid
                memories={
                  recentMemories
                }
                onDelete={
                  handleDelete
                }
                onOpen={
                  setOpenedMemory
                }
              />

            )}

          </section>


          {/* ==================================
              REELS
          ================================== */}

          {reels.length > 0 && (

            <section className="memory-section">

              <div className="section-heading">

                <p className="section-kicker">
                  Reels you kept
                </p>


                <h2>
                  Things worth watching
                  again.
                </h2>

              </div>


              <MemoryGrid
                memories={
                  reels
                }
                onDelete={
                  handleDelete
                }
                onOpen={
                  setOpenedMemory
                }
                variant="reels"
              />

            </section>

          )}


          {/* ==================================
              SCREENSHOTS
          ================================== */}

          {screenshots.length > 0 && (

            <section className="memory-section">

              <div className="section-heading">

                <p className="section-kicker">
                  Screenshots you kept
                </p>


                <h2>
                  Little pieces you didn't
                  want to lose.
                </h2>

              </div>


              <MemoryGrid
                memories={
                  screenshots
                }
                onDelete={
                  handleDelete
                }
                onOpen={
                  setOpenedMemory
                }
                variant="screenshots"
              />

            </section>

          )}

        </>

      )}


      {/* ======================================
          MEMORY MODAL
      ====================================== */}

      <MemoryModal
        memory={
          openedMemory
        }
        onClose={() =>
          setOpenedMemory(null)
        }
      />


      {/* ======================================
          TOAST
      ====================================== */}

      <Toast
        message={
          toast.message
        }
        type={
          toast.type
        }
        onClose={
          closeToast
        }
      />

    </main>

  );

}


export default HomePage;