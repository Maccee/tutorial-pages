// HERE WE MAKE THE API CALLS TO BACKEND TO RECEIVE A TOKEN AND AUTHORIZATION!
import SHA256 from 'crypto-js/sha256';

// ONLY USE IF DEVELOPING BACKEND FUNTIONALITY
function HandleLoginDEV(formData, setToken) {
    const hashedPassword = SHA256(formData.password).toString();

    fetch('https://archidesk.azurewebsites.net/api/TokenFunction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: formData.username,
            password: hashedPassword
        })
    })
        .then(async response => {
            if (response.ok) {
                return response.json();
            } else {

                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        })
        .then(data => {

            localStorage.setItem('token', data.token);
            setToken(data.token);

            console.log("Token received:", data.token);
            console.log("exported name from token: ", decodeTokenName(data.token));
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });

    console.log("HandleLogin triggered!", formData);
}
export function HandleLogin(formData, setToken) {
    console.log("HandleLogin triggered!", formData)
}

export function HandleRegister(formData, setToken) {
    console.log("HandleRegister triggered!", formData)
}

export function decodeTokenName(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Token is invalid');
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/_/g, '/').replace(/-/g, '+'));
    const jsonPayload = JSON.parse(decodedPayload);
    return jsonPayload.sub;
}

