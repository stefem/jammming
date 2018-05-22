let accessToken = '';
const clientID = 'e2fb90f108634dd2b2764c37044fb356';
// const redirectURI = 'http://localhost:3000';
const redirectURI = 'http://stefjammmingproject.surge.sh';

const Spotify = {
  getAccessToken: () => {
      if (accessToken) {
          return accessToken;
      }

      const urlHasToken = window.location.href.match(/access_token=([^&]*)/);
      const urlTokenExpires = window.location.href.match(/expires_in=([^&]*)/);

      if (urlHasToken && urlTokenExpires) {
          accessToken = urlHasToken[1];
          let expiresIn = Number(urlTokenExpires[1]);
          window.setTimeout(() => accessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
          return accessToken;
      } else {
          window.location =
          `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      }
  },

  search(searchTerm) {
      const accessToken = Spotify.getAccessToken();
      return fetch(
              `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
              {
                  headers: {Authorization: `Bearer ${accessToken}`}
              }

      ).then( response => {
          return response.json();
      }).then( jsonResponse => {
              if(jsonResponse.tracks.items) {
                return jsonResponse.tracks.items.map( track => (
                  {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
              } else {
                return [];
              }
      });

  },
  savePlayList(playListName, trackURIs) {
    console.log("IN SPOTIFY.JS SAVEPLAYLIST - root: METHOD CALLED");
    const accessToken = Spotify.getAccessToken();
    console.log("PlayListName:" + playListName);
    console.log("trackURIs.length:" + trackURIs.length);

    const headers =  {
          Authorization: `Bearer ${accessToken}`
    };
    let userId = '';

    return fetch('https://api.spotify.com/v1/me', {
        headers: headers
    })
    .then(console.log("IN SAVEPLAYLIST - RETURNING!"))
        .then(
              response => response.json()
        )
        .then( jsonResponse => {
                userId = jsonResponse.id;
                console.log("IN SAVEPLAYLIST - jsonResponse: " + userId);
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                      headers: headers,
                      method: 'POST',
                      body: JSON.stringify({ name: playListName })
                    });
        })

        .then( response => response.json())
        .then( jsonResponse => {
                const playlistId = jsonResponse.id;

                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                    {
                					headers: headers,
                					method: 'POST',
                					body: JSON.stringify({ uris: trackURIs })
                    });
        })

}};

export default Spotify;
