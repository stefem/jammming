import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchResults : [ // may need to look at this again
        {
          name: 'Lands End',
          artist: 'Siouxsie and the Banshees',
          album: 'Tinderbox',
          id: '000',
          uri: 'uri000'
        }
      ],
      playListName: 'Liliths Playlist',
      playListTracks: [
        {
          name: '92 Degrees',
          artist: 'Siouxsie and the Banshees',
          album: 'Tinderbox',
          id: '001',
          uri: 'uri001'
        },
        {
          name: 'New Mind',
          artist: 'Swans',
          album: 'Children of God',
          id: '002',
          uri: 'uri002'
        },
        {
          name: 'Lunette',
          artist: 'Elbow',
          album: 'The Takeoff and Landing of Everything',
          id: '003',
          uri: 'uri003'
        },
        {
          name: 'Sanvean',
          artist: 'Dead Can Dance',
          album: 'A Serpents Kiss',
          id: '004',
          uri: 'uri004'
        }
      ]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
  }

  // addTrack(track) {
  //   if (this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)) {
  //     return;
  //   } else {
  //     this.state.playListTracks.map( trackName => {return console.log("BEFORE: " + trackName.name) });
  //     this.setState({
  //       playListTracks: this.state.playListTracks.concat([track])
  //     });
  //     this.state.playListTracks.map( trackName => {return console.log("AFTER: " + trackName.name) });
  //   }
  // }

  addTrack(track){

     if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){

       return;

     } else {

       let tracks = this.state.playlistTracks.concat(track); //rather than use push, use concat to merge track with playlistTracks and create a new array.

       this.setState({playlistTracks: tracks});

     }

   }

  removeTrack(track) {
    this.setState({
      playListTracks: this.state.playListTracks.filter(playListTrack => playListTrack.id !== track.id)
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playListName: name
    });
  }

  savePlayList() {
    // let trackURIs = [];
    // this.state.playListTracks.map(playListTrack => { trackURIs.push(playListTrack.uri)});
    // console.log('trackURIs: ' + trackURIs);
    //
    // Spotify.savePlaylist().then();
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
          Spotify.savePlayList(this.state.playlistName, trackURIs).then(() => {
            this.setState({
              playlistName: 'New Playlist',
              playlistTracks: []
            });
    })
  }

   search(term){

      Spotify.search(term).then(tracks => {

        this.setState({searchResults: tracks});

      });

    }

  render() {
    console.log('App.js - this.state.searchResults: ' + this.state.searchResults)
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
                  searchResults = {this.state.searchResults}
                  onAdd = {this.addTrack} />
            <PlayList
                  playListName = {this.state.playListName}
                  playListTracks = {this.state.playListTracks}
                  onRemove = {this.removeTrack}
                  onNameChange = {this.updatePlaylistName}
                  onSave = {this.savePlayList} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
