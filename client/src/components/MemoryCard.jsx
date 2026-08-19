function MemoryCard({
  memory,
  onDelete,
  onOpen,
}) {
  // Pick preview based on memory type
  const previewUrl =
    memory.type === "reel"
      ? memory.reel?.thumbnailUrl
      : memory.asset?.url;

  return (
    <article
      className="memory-card"
      onClick={() => onOpen(memory)}
    >
      <div className="memory-image-wrapper">

        {/* Only create img when URL actually exists */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={
              memory.content?.title ||
              "Saved memory"
            }
          />
        ) : (
          <div className="memory-image-placeholder">
            No preview
          </div>
        )}

        <span className="memory-badge">
          {memory.type}
        </span>

      </div>

      <div className="memory-card-content">

        <h3>
          {memory.content?.title ||
            "Untitled Memory"}
        </h3>

        {memory.content?.summary && (
          <p className="memory-summary">
            {memory.content.summary}
          </p>
        )}

        {/* Reel creator */}
        {memory.type === "reel" &&
          memory.reel?.username && (
            <p className="memory-creator">
              @{memory.reel.username}
            </p>
          )}

        <div className="memory-card-footer">

          <small>
            {new Date(
              memory.createdAt
            ).toLocaleDateString()}
          </small>

          <button
            className="delete-button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(memory._id);
            }}
          >
            Delete
          </button>

        </div>
      </div>
    </article>
  );
}

export default MemoryCard;