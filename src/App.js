import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Playlistify</h1>
      <Container>
        <Row>
          <Col>Spotify</Col>
          <Col>Itunes</Col>
          <Col>Google Play Music</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
