import { useEffect } from "react";

function Toast({
  message,
  type = "error",
  onClose,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </div>

      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;