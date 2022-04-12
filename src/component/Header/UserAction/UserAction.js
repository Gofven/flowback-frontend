/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
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
import Profile from "../../User/Profile/Profile";
import Requests from "../../User/Requests/Requests";
import ActionRow from "./ActionRow";
import Support from "../../Support/Support"
import Tools from './Tools'

const loggedInData = [
  {
    title: "User Profile",
    url: "#",
    component: (<Profile><span>User Profile</span></Profile>)
  },
  // {
  //   title: "Requests",
  //   url: "#",
  //   component: (<Requests><span>Requests</span></Requests>)
  // },
  {
    title: "Support",
    url: "#",
    component: (<Support><span>User Profile</span></Support>)
  },
  {
    title: "Tools",
    url: "#",
    component: (<Tools><span>Tools</span></Tools>)
  },
  {
    title: "Log Out",
    url: "#",
    onClick: () => {
      logOut();
      window.location.href = "/";
    }
  },
];

const loggedOutData = [
  {
    title: "Log In",
    url: "#",
    onClick: () => {
      logOut();
      window.location.href = "/Login";
    }
  },
]

export default function UserAction(user) {

  const data = typeof user.user === "undefined" ? loggedOutData : loggedInData

  return (
    <ul
      className="dropdown-menu-mobile-fix dropdown-menu"
      aria-labelledby="avtarDrop"
      id="avtarDropdown"
    >
      {data?.map((item, index) => (
        <ActionRow {...item} key={index} />
      ))}
    </ul>
  );
}
