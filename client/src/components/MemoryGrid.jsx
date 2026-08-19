import MemoryCard from "./MemoryCard";

function MemoryGrid({
  memories,
  onDelete,
  onOpen,
  variant = "default",
}) {
  if (memories.length === 0) {
    return (
      <div className="empty-state">
        <strong>
          Nothing here yet.
        </strong>

        <p>
          Keep something you don't want
          to lose.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`memory-grid memory-grid-${variant}`}
    >
      {memories.map((memory) => (
        <MemoryCard
          key={memory._id}
          memory={memory}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export default MemoryGrid;