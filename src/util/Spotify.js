export const clientId = '5627f5908d354780ba1cf32839104b34';
export const redirect_uri = 'https://www.playlistify.levisylv.com/';

let accessToken; 

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}

		const newAccessToken = window.location.href.match(/access_token=([^&]*)/);
		const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
		if (newAccessToken && newExpiresIn) {
			accessToken = newAccessToken[1];
			const expiresIn = Number(newExpiresIn[1]);
			window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&show_dialog=true&redirect_uri=${redirect_uri}`;
			window.location = accessUrl;
		}
	},
	

	search(searchTerm) {
		const accessToken = Spotify.getAccessToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`
		};
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers: headers })
			.then(
				(response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error('Request failed!');
				},
				(networkError) => {
					console.log(networkError.message);
				}
			)
			.then((jsonResponse) => {
				if (!jsonResponse.tracks) {
					return [];
				}
				return jsonResponse.tracks.items.map((track) => ({
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri
				}));
			});
	},

	savePlaylist(playlistName, trackURIs) {
		if (playlistName && trackURIs.length) {
			const accessToken = Spotify.getAccessToken();
			const headers = {
				Authorization: `Bearer ${accessToken}`
			};
			let userID;
			let playlistID;
			return fetch('https://api.spotify.com/v1/me', { headers: headers })
				.then(
					(response) => {
						if (response.ok) {
							return response.json();
						}
						throw new Error('Request failed!');
					},
					(networkError) => {
						console.log(networkError.message);
					}
				)
				.then((jsonResponse) => {
					userID = jsonResponse.id;
					return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
						method: 'POST',
						headers: headers,
						body: JSON.stringify({ name: playlistName })
					})
						.then(
							(response) => {
								if (response.ok) {
									return response.json();
								}
								throw new Error('Request failed!');
							},
							(networkError) => {
								console.log(networkError.message);
							}
						)
						.then((jsonResponse) => {
							playlistID = jsonResponse.id;
							return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
								method: 'POST',
								headers: headers,
								body: JSON.stringify({ uris: trackURIs })
							})
								.then(
									(response) => {
										if (response.ok) {
											return response.json();
										}
										throw new Error('Request failed!');
									},
									(networkError) => {
										console.log(networkError.message);
									}
								)
								.then((jsonResponse) => jsonResponse);
						});
				});
		} else {
			return;
		}
	}
};
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
];
export const authEndpoint = "https://accounts.spotify.com/authorize";


export default Spotify;
