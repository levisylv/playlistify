import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import AppliedRoute from "./components/AppliedRoute";
import Register from "./components/Register";
import NewPlaylist from "./components/NewPlaylist";



export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/register" exact component={Register} props={childProps} />
    <AppliedRoute path="/playlist/new" exact component={NewPlaylist} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;