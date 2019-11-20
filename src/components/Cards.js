import React from 'react';
import { Card, Button, CardTitle, Row, Col } from 'reactstrap';
import '../css/Cards.css';

const Cards = (props) => {
  return (
    <Row>
      <Col className= "Cards-outline" sm="6">
        <Card body>
          <CardTitle>See what is currently playing!</CardTitle>
          <Button href= "/CurrentlyPlaying">Current Song</Button>
        </Card>
      </Col>
      <Col className= "Cards-outline" sm="6">
        <Card body>
          <CardTitle>Make playlists with your favorite songs!</CardTitle>
          <Button href= "/playlist/new">Make a Playlist</Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Cards;