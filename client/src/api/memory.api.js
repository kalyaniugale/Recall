import {
  getToken,
} from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// ==========================================
// AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {

  const token =
    getToken();


  if (!token) {

    // Tell App.jsx that the session
    // is no longer valid.

    window.dispatchEvent(
      new Event(
        "recall:unauthorized"
      )
    );


    throw new Error(
      "Your session has expired. Please sign in again."
    );

  }


  return {
    Authorization:
      `Bearer ${token}`,
  };
};


// ==========================================
// RESPONSE HANDLER
// ==========================================

const handleResponse = async (
  response,
  fallbackMessage
) => {

  let result;


  try {

    result =
      await response.json();

  } catch {

    result = {};

  }


  // ========================================
  // JWT INVALID / EXPIRED
  // ========================================

  if (response.status === 401) {

    window.dispatchEvent(
      new Event(
        "recall:unauthorized"
      )
    );


    throw new Error(
      "Your session has expired. Please sign in again."
    );

  }


  // ========================================
  // OTHER API ERROR
  // ========================================

  if (!response.ok) {

    throw new Error(
      result.message ||
      fallbackMessage
    );

  }


  return result;
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
      await handleResponse(
        response,
        "Failed to fetch memories"
      );


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
      await handleResponse(
        response,
        "Upload failed"
      );


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
      await handleResponse(
        response,
        "Failed to save Reel"
      );


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
      await handleResponse(
        response,
        "Search failed"
      );


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
      await handleResponse(
        response,
        "Delete failed"
      );


    return result;
  };