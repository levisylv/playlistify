import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "../css/Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { authEndpoint, clientId, redirectUri, scopes } from "../spotifyAuth";
import * as $ from "jquery";
import Player from "./Player";
import hash from "./hash";
import Cards from "./Cards";
import CurrentlyPlaying from "./CurrentlyPlaying";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      playlists: [],

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
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
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
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderPlaylists() : this.renderLander()}
      </div>
    );
  }
}
