// HERE WE MAKE THE API CALLS TO BACKEND TO RECEIVE A TOKEN AND AUTHORIZATION!

export function HandleLogin(formData, setToken) {
    console.log("HandleLogin triggered!", formData);

    // Generate a dummy token. this would come from backend.
    const dummyToken = "DummyToken12345";
    localStorage.setItem('token', formData.username);
    console.log("Mock token stored in local storage.");

    // i need to set this here to trigger event listener in header component
    setToken(formData.username);

}


export function HandleRegister(formData, setToken) {
    console.log("HandleRegister triggered!", formData)
}