function MemoryModal({
  memory,
  onClose,
}) {
  if (!memory) return null;

  const previewUrl =
    memory.type === "reel"
      ? memory.reel?.thumbnailUrl
      : memory.asset?.url;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="memory-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* =========================
            PREVIEW
        ========================== */}

        {previewUrl && (
          <div className="modal-image">
            <img
              src={previewUrl}
              alt={
                memory.content?.title ||
                "Memory"
              }
            />
          </div>
        )}

        {/* =========================
            DETAILS
        ========================== */}

        <div className="modal-details">

          <span className="memory-badge">
            {memory.type}
          </span>

          <h2>
            {memory.content?.title ||
              "Untitled Memory"}
          </h2>

          {/* Reel creator */}
          {memory.type === "reel" &&
            memory.reel?.username && (
              <p className="reel-creator">
                {memory.reel.username}
              </p>
            )}

          {memory.content?.summary && (
            <p>
              {memory.content.summary}
            </p>
          )}

          {/* Topics */}
          {memory.content?.topics?.length >
            0 && (
            <div className="topic-list">
              {memory.content.topics.map(
                (topic) => (
                  <span key={topic}>
                    {topic}
                  </span>
                )
              )}
            </div>
          )}

          {/* =========================
              REEL ACTION
          ========================== */}

          {memory.type === "reel" &&
            memory.originalUrl && (
              <a
                href={memory.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="reel-open-button"
              >
                Watch original Reel ↗
              </a>
            )}

          <small>
            Saved{" "}
            {new Date(
              memory.createdAt
            ).toLocaleString()}
          </small>

        </div>
      </div>
    </div>
  );
}

export default MemoryModal;