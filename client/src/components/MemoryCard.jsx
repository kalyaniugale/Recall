function MemoryCard({
  memory,
  onDelete,
  onOpen,
}) {
  return (
    <article
      className="memory-card"
      onClick={() => onOpen(memory)}
    >
      <div className="memory-image-wrapper">
        {memory.type === "screenshot" && (
          <img
            src={memory.asset?.url}
            alt={
              memory.content?.title ||
              "Saved screenshot"
            }
          />
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