export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = "5627f5908d354780ba1cf32839104b34";
export const redirectUri = "http://localhost:3000/CurrentlyPlaying";
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];