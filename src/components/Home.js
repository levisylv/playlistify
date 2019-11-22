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
import * as SpotifyWebApi from 'spotify-web-api-js';

let defaultStyle = {
  color: '#fff'
};
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img src={playlist.imageUrl} style={{width: '60px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song => 
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}    

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.spotifyApi = new SpotifyWebApi();
    this.state = {
      serverData: {},
      filterString: '',
      isLoading: true,
      playlist: [],
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

  getPlaylists(token) {
    
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/playlists",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      
      success: (data) => {
        console.log("data", data);
        this.setState({
          playlist: [{}],
        });
      },
      error: (errorThrown) => {
        alert('No Playlists');      }
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
      fetch('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + _token}
      }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))
  
      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {'Authorization': 'Bearer ' + _token}
      }).then(response => response.json())
      .then(data => this.setState({
        playlists: data.items.map(item => {
          console.log(data.items)
          return {
            name: item.name,
            imageUrl: item.images[0].url, 
            songs: []
          }
      })
      })) 
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
    let playlistToRender = 
      this.state.user && 
      this.state.playlists 
        ? this.state.playlists.filter(playlist => 
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())) 
        : []
    return (
      <div className="App">
      {this.state.user ?
      <div>
        <h1 style={{...defaultStyle, 'font-size': '54px'}}>
          {this.state.user.name}'s Playlists
        </h1>
        <Filter onTextChange={text => {
            this.setState({filterString: text})
          }}/>
        {playlistToRender.map(playlist => 
          <Playlist playlist={playlist} />
        )}
      </div> 
      : <button onClick={() => {
          window.location = window.location.href.includes('localhost') 
            ? 'http://localhost:8888/login' 
            : 'https://playlistify.levisylv.com/login' }
        }
        style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
      }
    
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
