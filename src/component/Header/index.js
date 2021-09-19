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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../common/Image";
import "./header.css";
import Notifiaction from "./Notifiaction";
import UserAction from "./UserAction";

const data = [
  { title: "Search", icon: "la-search", url: "/search" },
  { title: "Home", icon: "la-home", url: "/home" },
  { title: "Missions", icon: "la-globe-americas", url: "/missions" },
  { title: "Groups", icon: "la-user-friends", url: "/groups" },
  { title: "Votings", icon: "la-chart-bar", url: "/votings" },
  { title: "Events", icon: "la-calendar-week", url: "/votings" }, /* url: "/events" */
];

export default function Header() {
  const [user, setUser] = useState({})


  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);
  return (
    <nav className="main-navbar navbar navbar-expand-lg">
      <div className="container-lg">
        <a className="navbar-brand" href="/home">
          <img src="/img/Logo.png" className="main-logo" alt="logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="las la-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mx-auto main-nav">
            {data?.map((item, index) => (
              <li className="nav-item" key={index}>
                <Link className="nav-link" to={item.url}>
                  <i className={`las ${item.icon}`}></i>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav user-nav">
            <li className="nav-item dropdown notification-drop">
              <a
                className="nav-link notification-link"
                href="#notificationDrop"
                id="notificationDrop"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="las la-bell"></i>
                <span className="notification-badge">1</span>
              </a>
              <Notifiaction />
            </li>
            <li className="nav-item dropdown profile-drop">
              <a
                className="nav-link avtar-link"
                href="#avtarDrop"
                id="avtarDrop"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="avtar-row row align-items-center mx-auto">
                  <div className="col-3 px-0 avtrar-img-cl">
                    <Image
                      src={user.image}
                      className="avtrar-img img-fluid"
                      alt="User"
                      errImg={'/img/no-photo.jpg'}
                    />
                  </div>
                  <div className="col-8 px-1 avtra-name">
                    {
                      user ?
                        <span>{user.first_name} {user.last_name}</span>
                        : 'User'
                    }
                  </div>
                  <div className="col-1 down-arro px-0">
                    <img src="/img/avtar-arrow-blue.png" />
                  </div>
                </div>
              </a>
              <UserAction user={user.id}/>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
