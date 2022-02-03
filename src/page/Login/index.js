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

import React, { useState } from "react";
import LoginCard from "../../component/LoginCard";
import SignUp from "../../component/SignUp";
import ResetPassword from "../../component/LoginCard/ResetPassword";
import { useTab } from "../../hook/useTab";
import "./styles.css";

export default function Login() {
  const { tab, activeTab, bind: handleOnClick } = useTab(["Login", "Register"]);

  //If user is already logged in, then make it impossible to access the login page
  if (localStorage.getItem('user')) {
    window.location.href = "/"
    return <h1>Already Loggin in, redirecting...</h1>
  }

  // Rendor tabs of login and sign up
  const renderTab = () => {
    switch (activeTab) {
      case tab[0]:
        return <LoginCard />;
      case tab[1]:
        return <SignUp />;
    }
  };
  return (
    <section className="login_container">
      <div className="logo-section">
        <a href="/">
          <img src="/img/Logo.png" className="img-fluid main-logo" alt="logo" />
          <span className="main-logo-text">Flowback</span>
        </a>
      </div>
      <div className="login_form_container">
        <div className="container">
          <div className="login_card">
            <div className="card">
              <div className="card-header">
                <ul
                  className="nav nav-pills nav-justified"
                  id="pills-tab"
                  role="tablist"
                >
                  {tab?.map((item, index) => (
                    <li className="nav-item" role="presentation" key={index}>
                      <span
                        className={`nav-link${item === activeTab ? " active" : ""
                          }`}
                        style={{ "color": "#575757" }}
                        data-id={index}
                        {...handleOnClick}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-body">
                <div className="tab-content" id="pills-tabContent">
                  {renderTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
