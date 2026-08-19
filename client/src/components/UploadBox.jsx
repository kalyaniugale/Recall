function UploadBox({
  selectedFile,
  setSelectedFile,
  onUpload,
  uploading,
}) {
  return (
    <section className="upload-box">

      <div>
        <h2>Add a memory</h2>

        <p>
          Upload a screenshot and Recall will
          understand and index it.
        </p>
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) =>
          setSelectedFile(
            event.target.files?.[0] || null
          )
        }
      />

      <button
        onClick={onUpload}
        disabled={
          !selectedFile || uploading
        }
      >
        {uploading
          ? "Processing..."
          : "Upload Screenshot"}
      </button>

    </section>
  );
}

export default UploadBox;