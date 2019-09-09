import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import AppliedRoute from "./components/AppliedRoute";
import Register from "./components/Register";
import NewPlaylist from "./components/NewPlaylist";
import Playlists from "./components/Playlists";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import CurrentlyPlaying from "./components/CurrentlyPlaying";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/register" exact component={Register} props={childProps} />
    <AuthenticatedRoute path="/playlist/new" exact component={NewPlaylist} props={childProps} />
    <AuthenticatedRoute path="/playlists/:id" exact component={Playlists} props={childProps} />
    <AuthenticatedRoute path="/currentlyplaying" exact component={CurrentlyPlaying} props={childProps} />    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;