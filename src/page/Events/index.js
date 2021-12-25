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
import "./events.css";
import Layout1 from "../../layout/Layout1";
import GroupChat from "../../component/GroupChat";

export default function Events() {
  return (
    <Layout1>
      <section className="event-dashboard mt-4">
        <div className="container-xl">
          <div className="row">

            <div className="col-md-6">
              <div className="mission-post-card row g-0 mb-4">
                <div className="col-md-6">
                  <div className="mission-post-img-view">
                    <img src="/img/top-story-img.jpg" className="img-fluid" />
                    <div className="img-content" />
                    <div>
                      <img src="/img/flower.jpg" />
                    </div>
                    <div>
                      <h5 className="mb-0 text-truncate">
                        Wed, Sep 27 at 18:00
                      </h5>
                      <h5 className="mb-0 text-truncate">
                        Vasaparken, 113 24 Stockholm
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mission-post-content">
                    <h4 className="mission-post-title text-truncate">
                      Events Name
                    </h4>
                    <p className="mission-post-para line-3">
                      Event text text about event blip blop wee woo text text
                      about event blip blop wee text about event blip blop wee
                      woo text tt about event blip blop wee woo text...
                    </p>
                  </div>
                </div>
              </div>
              <div className="mission-post-card row g-0 mb-4">
                <div className="col-md-6">
                  <div className="mission-post-img-view">
                    <img src="/img/top-story-img.jpg" className="img-fluid" />
                    <div className="img-content" />
                    <div>
                      <img src="/img/flower.jpg" />
                    </div>
                    <div>
                      <h5 className="mb-0 text-truncate">
                        Wed, Sep 27 at 18:00
                      </h5>
                      <h5 className="mb-0 text-truncate">
                        Vasaparken, 113 24 Stockholm
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mission-post-content">
                    <h4 className="mission-post-title text-truncate">
                      Events Name
                    </h4>
                    <p className="mission-post-para line-3">
                      Event text text about event blip blop wee woo text text
                      about event blip blop wee text about event blip blop wee
                      woo text tt about event blip blop wee woo text...
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card short-by-card chat-list-card chat-card card-rounded overflow-hidden">
                <div className="card-header pb-0 border-bottom-0">
                  <h4 className="card-title">Short by</h4>
                </div>
                <div className="card-body overflow-hidden">
                  <div className="pre-scrollable">
                    <ul
                      className="active-vertical-nav nav nav-pills"
                      id="pills-tab"
                    >
                      <li className="nav-item">
                        <a
                          className="nav-link short-by-link active"
                          href="#"
                          data-bs-toggle="pill"
                        >
                          New
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link short-by-link"
                          href="#"
                          data-bs-toggle="pill"
                        >
                          Popular
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link short-by-link"
                          href="#"
                          data-bs-toggle="pill"
                        >
                          Rising
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card filter-by-card mt-4 chat-list-card chat-card card-rounded overflow-hidden">
                <div className="card-header pb-0 border-bottom-0">
                  <h4 className="card-title">Filter by</h4>
                </div>
                <div className="card-body overflow-hidden">
                  <form className="form filter-form" action="#">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="MyGroupsOnly"
                      />
                      <label className="form-check-label" for="MyGroupsOnly">
                        My Groups only
                      </label>
                    </div>
                    <div className="location-group">
                      <h5 className="shrtby-intitle">Location</h5>
                      <label for="dateSelect" className="short-by-link active">
                        Anywhere
                      </label>
                      <select
                        className="form-select form-select-sm city-select border-0 mt-2"
                        id="citySelect"
                      >
                        <option selected>Choose a city...</option>
                        <option value="1">city-1</option>
                        <option value="2">city-2</option>
                        <option value="3">city-3</option>
                        <option value="4">city-4</option>
                      </select>
                    </div>
                    <div>
                      <div className="select-col">
                        <h5 className="shrtby-intitle">Date created</h5>
                        <label
                          for="dateSelect"
                          className="short-by-link active"
                        >
                          Anytime
                        </label>
                      </div>
                      <div className="select-row">
                        <select
                          className="form-select form-select-sm date-select"
                          id="dateSelect"
                        >
                          <option selected>09</option>
                          <option value="1">02</option>
                          <option value="2">03</option>
                          <option value="3">04</option>
                          <option value="4">05</option>
                        </select>
                        <select
                          className="form-select form-select-sm year-select"
                          id="yearSelect"
                        >
                          <option selected>2020</option>
                          <option value="1">2021</option>
                          <option value="2">2022</option>
                          <option value="3">2023</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout1>
  );
}
