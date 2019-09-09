import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "../css/Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      playlists: []
    };
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
