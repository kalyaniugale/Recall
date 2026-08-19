function UploadBox({
  selectedFile,
  setSelectedFile,
  onUpload,
  uploading,
}) {
  return (
    <section className="capture-card">

      <div className="capture-icon">
        ▧
      </div>

      <div className="capture-card-copy">
        <h3>
          Screenshot
        </h3>

        <p>
          Keep a screenshot and Recall
          will remember what's inside.
        </p>
      </div>

      <input
        className="file-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) =>
          setSelectedFile(
            event.target.files?.[0] ||
              null
          )
        }
      />

      <button
        className="capture-action"
        onClick={onUpload}
        disabled={
          !selectedFile ||
          uploading
        }
      >
        {uploading
          ? "Keeping it safe..."
          : selectedFile
          ? "Keep screenshot"
          : "Choose screenshot"}
      </button>

    </section>
  );
}

export default UploadBox;