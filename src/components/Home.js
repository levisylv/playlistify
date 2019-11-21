import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "../css/Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import * as $ from "jquery";
import Player from "./Player";
import hash from "./hash";
import Cards from "./Cards";
import CurrentlyPlaying from "./CurrentlyPlaying";
import SpotifyPlaylist from "./SpotifyPlaylist";
import Spotify from "../util/Spotify";
import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import PlayList from './PlayList/PlayList';


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      playlists: [],
      "searchResults": [],
      "playlistName": "New Playlist",
      "playlistTracks": [],

      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms:0,
      },
      is_playing: "Paused",
      progress_ms: 0
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (!tracks.find(trackIndex => trackIndex.id === track.id)) {
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let newTracks = tracks.filter(trackIndex => trackIndex.id !== track.id);
    this.setState({playlistTracks: newTracks});

  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let tracks = this.state.playlistTracks;
    if(tracks.length && this.state.playlistName) {
      let trackURIs = tracks.map(trackIndex => trackIndex.uri);
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        });
        document.getElementById('Playlist-name').value = this.state.playlistName;
      });
    }
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(results => {
      this.setState({searchResults: results});
    });
  }
  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      }
    });
  }
  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const playlists = await this.playlists();
      this.setState({ playlists });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  playlists() {
    return API.get("playlistify", "/playlistify");
  }
  
  renderPlaylistsList(playlists) {
    return [{}].concat(playlists).map(
      (playlist, i) =>
        i !== 0
          ? <LinkContainer
              key={playlist.playlistId}
              to={`/playlists/${playlist.playlistId}`}
            >
              <ListGroupItem header={playlist.content.trim().split("\n")[0]}>
                {"Created: " + new Date(playlist.createdAt).toLocaleString()}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/playlist/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new playlist
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }
  

  renderLander() {
    return (
      <div className="lander">
        <h1>Playlistify</h1>
        <p>A simple playlist making app</p>
      </div>
    );
  }

  renderPlaylists() {
    return (
      <div className="playlists">
        <PageHeader>Your Playlists</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderPlaylistsList(this.state.playlists)}
        </ListGroup>
        <CurrentlyPlaying></CurrentlyPlaying>
        {/* <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div> */}
      </div>
    );
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (!tracks.find(trackIndex => trackIndex.id === track.id)) {
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let newTracks = tracks.filter(trackIndex => trackIndex.id !== track.id);
    this.setState({playlistTracks: newTracks});

  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let tracks = this.state.playlistTracks;
    if(tracks.length && this.state.playlistName) {
      let trackURIs = tracks.map(trackIndex => trackIndex.uri);
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        });
        document.getElementById('Playlist-name').value = this.state.playlistName;
      });
    }
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(results => {
      this.setState({searchResults: results});
    });
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderPlaylists() : this.renderLander()}
      </div>
    );
  }
}
