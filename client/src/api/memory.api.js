import {
  getToken,
} from "../utils/auth";


const API_BASE_URL =
  "http://localhost:5000/api/v1";


// ==========================================
// AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {

  const token =
    getToken();

  if (!token) {

    throw new Error(
      "You are not logged in."
    );

  }

  return {
    Authorization:
      `Bearer ${token}`,
  };
};


// ==========================================
// GET MEMORIES
// ==========================================

export const getMemories =
  async () => {

    const response =
      await fetch(
        `${API_BASE_URL}/memories`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Failed to fetch memories"
      );

    }


    return result.data;
  };


// ==========================================
// UPLOAD SCREENSHOT
// ==========================================

export const uploadScreenshot =
  async (file) => {

    const formData =
      new FormData();


    formData.append(
      "screenshot",
      file
    );


    const response =
      await fetch(
        `${API_BASE_URL}/memories/screenshots`,
        {
          method: "POST",

          headers: {
            ...getAuthHeaders(),
          },

          body: formData,
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Upload failed"
      );

    }


    return result.data;
  };


// ==========================================
// SAVE REEL
// ==========================================

export const saveReel =
  async (url) => {

    const response =
      await fetch(
        `${API_BASE_URL}/memories/reels`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            ...getAuthHeaders(),
          },

          body: JSON.stringify({
            url,
          }),
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Failed to save Reel"
      );

    }


    return result.data;
  };


// ==========================================
// SEARCH MEMORIES
// ==========================================

export const searchMemories =
  async (query) => {

    const response =
      await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Search failed"
      );

    }


    return result.data;
  };


// ==========================================
// DELETE MEMORY
// ==========================================

export const deleteMemory =
  async (memoryId) => {

    const response =
      await fetch(
        `${API_BASE_URL}/memories/${memoryId}`,
        {
          method: "DELETE",

          headers: {
            ...getAuthHeaders(),
          },
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Delete failed"
      );

    }


    return result;
  };