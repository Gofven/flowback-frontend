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

import React from "react";
import { logOut } from "../../../utils/common";
import Bookmarks from "../../User/Bookmarks";
import Profile from "../../User/Profile";
import Requests from "../../User/Requests";
import ActionRow from "./ActionRow";

const data = [
  {
    title: "User Profile",
    url: "#",
    component: (<Profile><span>User Profile</span></Profile>)
  },
  // {
  //   title: "Contacts",
  //   url: "#",
  // },
  // {
  //   title: "Bookmarks",
  //   url: "#",
  //   component: (<Bookmarks><span>Bookmarks</span></Bookmarks>)
  // },
  // {
  //   title: "Requests",
  //   url: "#",
  //   component: (<Requests><span>Requests</span></Requests>)
  // },
  // {
  //   title: "Flowback Premium",
  //   url: "#",
  // },
  // {
  //   title: "Activity Log",
  //   url: "#",
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  // },
  {
    title: "Log Out",
    url: "#",
    onClick: () => {
      logOut();
      window.location.href = '/';
    }
  },
];

export default function UserAction(user) {
  // TODO if user is anonymous, replace logout with login.
  // if (typeof user.user === "undefined") {
  //   data.at(-1).title = "Log In"
  // }
  return (
    <ul
      className="dropdown-menu"
      aria-labelledby="avtarDrop"
      id="avtarDropdown"
    >
      {data?.map((item, index) => (
        <ActionRow {...item} key={index} />
      ))}
    </ul>
  );
}
