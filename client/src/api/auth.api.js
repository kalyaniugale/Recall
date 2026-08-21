const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


export const registerUser = async ({
  name,
  email,
  password,
}) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Registration failed"
    );
  }

  return result.data;
};


export const loginUser = async ({
  email,
  password,
}) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Login failed"
    );
  }

  return result.data;
};