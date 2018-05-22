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
          searchResults : [],
          playListName: '',
          playListTracks: [

          ]
        };

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlayList = this.savePlayList.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack = (track) => {
         if (this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)){
            return;
         } else {
             let tracks = this.state.playListTracks.concat(track); //rather than use push, use concat to merge track with playlistTracks and create a new array.
             this.setState({playListTracks: tracks});
         }
     }

    removeTrack = (track) => {
        this.setState({
            playListTracks: this.state.playListTracks.filter(playListTrack => playListTrack.id !== track.id)
        });
    }

    updatePlaylistName = (name) => {
        this.setState({
            playListName: name
        });
    }

    savePlayList = () => {
        const trackURIs = this.state.playListTracks.map(track => track.uri);
        Spotify.savePlayList(this.state.playListName, trackURIs);
    }

     search(term){
        Spotify.search(term).then(tracks => {
          this.setState({searchResults: tracks});
        });
      }

    render() {
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
