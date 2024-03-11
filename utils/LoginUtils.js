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
    formData,
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
      setToken(data.token);

      console.log("Token received:", data.token);
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

export function SyncFavorites() {
  console.log("sync")
}