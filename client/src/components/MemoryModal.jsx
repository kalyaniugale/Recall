function MemoryModal({
  memory,
  onClose,
}) {
  if (!memory) return null;

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
        >
          ×
        </button>

        <div className="modal-image">
          <img
            src={memory.asset?.url}
            alt={
              memory.content?.title ||
              "Memory"
            }
          />
        </div>

        <div className="modal-details">
          <span className="memory-badge">
            {memory.type}
          </span>

          <h2>
            {memory.content?.title ||
              "Untitled Memory"}
          </h2>

          {memory.content?.summary && (
            <p>
              {memory.content.summary}
            </p>
          )}

          {memory.content?.topics?.length > 0 && (
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