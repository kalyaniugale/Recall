const API_BASE_URL = "http://localhost:5000/api/v1";


export const getMemories = async () => {
  const response = await fetch(
    `${API_BASE_URL}/memories`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch memories"
    );
  }

  return result.data;
};


export const uploadScreenshot = async (file) => {
  const formData = new FormData();

  formData.append("screenshot", file);

  const response = await fetch(
    `${API_BASE_URL}/memories/screenshots`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Upload failed"
    );
  }

  return result.data;
};

export const saveReel = async (url) => {
  const response = await fetch(
    `${API_BASE_URL}/memories/reels`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        url,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Failed to save Reel"
    );
  }

  return result.data;
};

export const searchMemories = async (query) => {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Search failed"
    );
  }

  return result.data;
};


export const deleteMemory = async (memoryId) => {
  const response = await fetch(
    `${API_BASE_URL}/memories/${memoryId}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Delete failed"
    );
  }

  return result;
};