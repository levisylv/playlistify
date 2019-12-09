import React, { Component } from "react";
import * as $ from "jquery";
// import { authEndpoint, clientId, redirectUri, scopes } from "../spotifyAuth";
import hash from "./hash";
import Player from "./Player";
import { Auth } from "aws-amplify";
import "../css/CurrentlyPlaying.css";
import { Spotify, authEndpoint, clientId, redirect_uri, scopes } from '../util/Spotify';

class CurrentlyPlaying extends Component {
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
      playlists: [],
      num_playlist: 0,
      is_playing: "Paused",
      progress_ms: 0
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
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
      this.getPlaylists(_token);
    }
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
          playlists: data.items,
          num_playlist: data.total,
        });
      },
      error: (errorThrown) => {
        alert('No Playlists');      }
    });
  }
  

  render() {
    const listitems = this.state.playlists.map((item) => 
    <li key={item.id}>
        <a href={item.external_urls.spotify}>{item.name}</a>
    </li>
    )
    return (
        
      <div className="App">
        <header className="App-header">
        {this.state.token && this.state.num_playlist && (
            <div>
              <h2>Spotify Playlists :{this.state.num_playlist}</h2>
              <ul>
                {listitems}
              </ul>
            </div>
          )}
            <h1>Currently Playing</h1>
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
              playlist= {this.state.playlist}   
            />
            
          )}
        </header>
      </div>
    );
  }
}

export default CurrentlyPlaying;