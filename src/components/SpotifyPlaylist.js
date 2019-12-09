import React, { Component } from "react";
import * as $ from "jquery";
import { Spotify, authEndpoint, clientId, redirect_uri, scopes } from '../util/Spotify';
import hash from "./hash";
import Player from "./Player";
import { Auth } from "aws-amplify";
import "../css/CurrentlyPlaying.css";

class SpotifyPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.SpotifyPlaylist = this.SpotifyPlaylist.bind(this);
  }
  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getSpotifyPlaylist(_token);
    }
  }

  getSpotifyPlaylist(token) {
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
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      },
      error: (errorThrown) => {
        alert('No Music Playing');      }
    });
  }
  

  render() {

    return (
        
      <div className="App">
        <header className="App-header">
            <h1>Spotify Playlists</h1>
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirect_uri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.progress_ms}     
            />  
          )}
        </header>
      </div>
    );
  }
}

export default SpotifyPlaylist;