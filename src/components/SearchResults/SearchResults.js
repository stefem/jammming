import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {

  render () {
    console.log('SearchResults.js - this.props.searchResults: ' + this.props.searchResults)
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList
              tracks = {this.props.searchResults}
              onAdd = {this.props.onAdd}
              isRemoval = {false} />
      </div>
    );
  }
};

export default SearchResults;
