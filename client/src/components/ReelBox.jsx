function ReelBox({
  reelUrl,
  setReelUrl,
  onSave,
  saving,
}) {
  return (
    <section className="capture-card">

      <div className="capture-icon">
        ◎
      </div>

      <div className="capture-card-copy">
        <h3>
          Instagram Reel
        </h3>

        <p>
          Paste a reel you don't want
          to forget later.
        </p>
      </div>

      <div className="reel-input-area">

        <input
          type="url"
          className="reel-input"
          placeholder="instagram.com/reel/..."
          value={reelUrl}
          disabled={saving}
          onChange={(event) =>
            setReelUrl(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key ===
                "Enter" &&
              reelUrl.trim() &&
              !saving
            ) {
              onSave();
            }
          }}
        />

        <button
          className="capture-action"
          onClick={onSave}
          disabled={
            !reelUrl.trim() ||
            saving
          }
        >
          {saving
            ? "Getting to know it..."
            : "Keep Reel"}
        </button>

      </div>

      {saving && (
        <div className="gentle-status">

          <span className="processing-spinner" />

          <span>
            Listening, reading and
            remembering...
          </span>

        </div>
      )}

    </section>
  );
}

export default ReelBox;