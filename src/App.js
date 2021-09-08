/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * Copyright (C) 2021  Astroneatech AB
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./component/PrivateRoute";
import PublicRoute from "./component/PublicRoute";
import Home from "./page/HomePage";
import Events from "./page/Events";
import Login from "./page/Login";
import Missions from "./page/Missions";
import Votings from "./page/Votings";
import Mentions from "./page/Mentions";
import Friends from "./page/Friends";
import SearchPage from "./page/SearchPage";
import GroupForm from "./page/Friends/GroupForm";
import GroupDetails from "./page/Friends/GroupDetails";
import PollForm from "./page/Polls/PollForm";
import PollDetails from "./page/Polls/PollDetails";
import "react-datepicker/dist/react-datepicker.css";
// import { io } from "socket.io-client";
import socketIOClient, { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./component/Chat";
const { REACT_APP_PROXY } = process.env;

function App() {

  return (
    <>
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/events" component={Events} />
          <PrivateRoute exact path="/missions" component={Missions} />
          <PrivateRoute exact path="/votings" component={Votings} />
          <PrivateRoute exact path="/mentions" component={Mentions} />
          <PrivateRoute exact path="/groups" component={Friends} />
          <PrivateRoute exact path="/create" component={GroupForm} />
          <PrivateRoute exact path="/groupdetails/:groupId/edit" component={GroupForm} />
          <PrivateRoute exact path="/groupdetails/:groupId" component={GroupDetails} />
          <PrivateRoute exact path="/search" component={SearchPage} />
          <PrivateRoute exact path="/groupdetails/:groupId/pollcreate" component={PollForm} />
          <PrivateRoute exact path="/groupdetails/:groupId/poll/:pollId/edit" component={PollForm} />
          <PrivateRoute exact path="/groupdetails/:groupId/polldetails/:pollId" component={PollDetails} />

          <Route path="/" component={Login} />
        </Switch>
      </BrowserRouter>
      {  localStorage.getItem('user') &&
        <Chat />
      }
    </>
  );
}

export default App;