import MemoryCard from "./MemoryCard";

function MemoryGrid({
  memories,
  onDelete,
  onOpen,
}) {
  if (memories.length === 0) {
    return (
      <div className="empty-state">
        <div>
          <strong>No memories found</strong>
          <p>
            Try describing what you remember
            differently.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-grid">
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