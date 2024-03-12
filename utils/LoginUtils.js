// HERE WE MAKE THE API CALLS TO BACKEND TO RECEIVE A TOKEN AND AUTHORIZATION!
import SHA256 from "crypto-js/sha256";

// ONLY USE IF DEVELOPING BACKEND FUNTIONALITY
export function HandleLogin(formData, setToken) {
  const hashedPassword = SHA256(formData.password).toString();

  let hashedConfirmPassword;
  if (formData.confirmPassword !== "") {
    hashedConfirmPassword = SHA256(formData.confirmPassword).toString();
  }

  console.log(
    "Formdata sent: ",
    formData.username,
    hashedPassword,
    hashedConfirmPassword
  );

  fetch("https://archidesk.azurewebsites.net/api/TokenFunction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.username,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      // Stringify the favourites array before storing it
      localStorage.setItem("favorites", JSON.stringify(data.favourites));
      setToken(data.token);

      console.log("Token received:", data.token);
      console.log("Favourites received:", data.favourites);
    })
    .catch((error) => {
      console.error("Error:", error);
      //alert(error.message);
    });
}

export function decodeTokenName(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.log("Token is invalid");
    return;
  }
  const payload = parts[1];
  const decodedPayload = atob(payload.replace(/_/g, "/").replace(/-/g, "+"));
  const jsonPayload = JSON.parse(decodedPayload);
  return jsonPayload.sub;
}

export async function ValidateToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found in local storage.");
    return;
  }

  try {
    const response = await fetch(
      "https://archidesk.azurewebsites.net/api/ValidateTokenFunction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Validation result:", result);
  } catch (error) {
    console.error("Error during token validation:", error);
  }
}

export async function SyncFavorites() {
  const favorites = localStorage.getItem("favorites");
  const parsedFavorites = favorites ? JSON.parse(favorites) : [];
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found in local storage.");
    return;
  }

  try {
    const response = await fetch(
      "https://archidesk.azurewebsites.net/api/SyncFavoritesFunction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorites: parsedFavorites, token: token }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Favorites successfully synced with the server.");
  } catch (error) {
    console.error("Error during syncing favorites:", error);
  }
}

export async function GetFavorites() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found in local storage.");
    return;
  }

  try {
    const response = await fetch(
      "https://archidesk.azurewebsites.net/api/GetFavoritesFunction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse the JSON response
    
    localStorage.setItem("favorites", data.favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}
