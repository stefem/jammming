let accessToken = '';
let expires_in = '';
const clientID = 'meh';
const redirectURI = 'http://localhost:3000';

const Spotify = {
  getAccessToken() {
          // Check if access token and expiry time are present in the url
          const wlh = window.location.href;
          const regexHasToken = RegExp(/#access_token=([^&]*)/);
          const regexTokenExpiry = RegExp(/expires_in=([^&]*)/);
          let urlHasToken = regexHasToken.test(wlh);
          let urlTokenExpiry = regexTokenExpiry.test(wlh);

          if (accessToken) {

                // if access token already set
                  return accessToken;

          } else if (urlTokenExpiry && urlHasToken) {

                  // if access token and expiry time have just been added
                  accessToken = window.location.href.match(/#access_token=([^&]*)/)[1]; // gives accessToken a value
                  const expiryTime = window.location.href.match(/expires_in=([^&]*)/)[1]; // gives expiryTime a value
                  window.setTimeout(() => accessToken = '', expires_in * 1000); // zaps accessToken when time runs out
                  window.history.pushState('Access Token', null, '/'); // Clears parameters in URL
                  return accessToken;

          } else if(!accessToken && !urlHasToken) {

            // if access token is null and no token in url then redirect user to spotify url to login
            window.location.assign(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);

          }
  },
  search(term) {
    console.log('Spotify.search - in the method');
          if(!accessToken) {
                  this.getAccessToken()
                  console.log('Spotify.search - getting access token');
          }
            console.log('Spotify.search - fetching');
                  return fetch(
                          `https://api.spotify.com/v1/search?type=track&q=${term}`,
                          {
                            headers: {Authorization: `Bearer ${accessToken}`}
                          }

                  ).then( response => {
                          // console.log('response.json: ' + response.json());
                          return response.json();

                  }).then( jsonResponse => {

                          if(jsonResponse.tracks.items) {
                            console.log('returning jsonResponse.tracks.items: ' + jsonResponse.tracks.items);
                            return jsonResponse.tracks.items.map( track => (
                              {
                                id: track.id,
                                name: track.name,
                                artist: track.artists[0].name,
                                album: track.album.name,
                                uri: track.uri
                            }));
                          } else {
                            console.log('No valid response received from server.');
                            return;
                          }

                  }).then(tracks => console.log(tracks));

  },
  savePlayList(playListName, trackURIs) {
          // let accessToken = this.getAccessToken;
          if (!playListName || !trackURIs.length) {
          			return;
          }

          // if(!accessToken) {
          //       this.getAccessToken()
          // }
          const accessToken = this.getAccessToken;
          const headers =  {
                Authorization: `Bearer ${accessToken}`
          };
          let userId = '';

          // 1. Get spotify user name
          return fetch('https://api.spotify.com/v1/me', {headers: headers})
                  .then( response => response.json())
                  .then( jsonResponse => {
                          userId = jsonResponse.id;
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

                          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                          					headers: headers,
                          					method: 'POST',
                          					body: JSON.stringify({ uris: trackURIs })
                          });
                  })

}};

export default Spotify;
