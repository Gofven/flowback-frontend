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
import { useTab } from "../../hook/useTab";
import { postRequest } from "../../utils/API";
import Groups from "./Groups";
import People from "./People";
import Polls from "./Polls";
import SearchBox from "./SearchBox";

export default function Search() {

  const [searchBy, setSearchBy] = useState("people");
  const [searchValue, setSearchValue] = useState("");
  const [peopleList, setPeopleList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [pollList, setPollList] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [lastUserCreatedAt, setLastUserCreatedAt] = useState();

  const [pageNumberPeople, setPageNumberPeople] = useState(1);
  const [pageNumberGroup, setPageNumberGroup] = useState(1);
  const [pageNumberPoll, setPageNumberPoll] = useState(1);
  const [totalPeoplePage, setTotalPeoplePage] = useState(0);
  const [totalGroupPage, setTotalGroupPage] = useState(0);
  const [totalPollPage, setTotalPollPage] = useState(0);

  const searchList = (searchBy, searchValue, firstPage) => {
    const data = {
      search_by: searchBy,
      search_value: searchValue,
      first_page: firstPage,
      page_size: pageSize,
      page: pageNumber,
      last_created_at: lastUserCreatedAt
    }
    postRequest("api/v1/user_group/get_search_result", data).then(
      (response) => {
        console.log('response', response);
        const { status, data } = response;
        if (status === "success") {
          if (firstPage) {
            switch (searchBy) {
              case "people":
                setPeopleList(data?.data);
              case "group":
                setGroupList(data?.data);
              case "polls":
                setPollList(data?.data);
            }
          }
          else {
            switch (searchBy) {
              case "people":
                setPeopleList([...peopleList, ...data?.data]);
              case "group":
                setGroupList([...groupList, ...data?.data]);
              case "polls":
                setPollList([...pollList, ...data?.data]);
            }
          }
          firstPage && setLastUserCreatedAt(data?.last_created_at);
          setPageNumber(pageNumber + 1);
          setTotalPage(data?.total_page);
        }
      }
    );
  }


  useEffect(() => {
    searchList(searchBy, searchValue, true);
  }, [searchBy, searchValue])
  return (
    <>
      <div className="search-view">
        <SearchBox searchBy={searchBy}
          onSearch={(searchValue) => {
            setSearchValue(searchValue);
            setPageNumber(1);
          }} />
      </div>
      <div className="search-card card-rounded mb-4">
        <div className="card-header flex-header tab-header">
          <ul
            className="bottom-line-tab nav nav-justified nav-pills w-100"
            id="pills-tab"
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                href="#peopleTab"
                data-bs-toggle="pill"
                onClick={() => {
                  setSearchBy("people")
                  setPageNumber(1)
                  setLastUserCreatedAt()
                }}
              >
                People
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#groupsTab" data-bs-toggle="pill"
                onClick={() => {
                  setSearchBy("group")
                  setPageNumber(1)
                  setLastUserCreatedAt()
                }}>
                Groups
              </a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="#postsTab" data-bs-toggle="pill">
                Posts
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#eventsTab" data-bs-toggle="pill">
                Events
              </a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link" href="#pollsTab" data-bs-toggle="pill"
                onClick={() => {
                  setSearchBy("polls")
                  setPageNumber(1)
                  setLastUserCreatedAt()
                }}>
                Polls
              </a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="#missionsTab" data-bs-toggle="pill">
                Missions
              </a>
            </li> */}
          </ul>
        </div>
        <div className="card-body">
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="peopleTab">
              <div className="contact-list">
                <People people={peopleList} />
                {
                  (pageNumber <= totalPage) &&
                  <div className="d-flex justify-content-end cursor-pointer" onClick={() => { searchList("people", searchValue, false) }}>Load more... </div>
                }
              </div>
            </div>
            <div className="tab-pane fade" id="groupsTab">
              <Groups groups={groupList} />
              {
                (pageNumber <= totalPage) &&
                <div className="d-flex justify-content-end cursor-pointer" onClick={() => { searchList("group", searchValue, false) }}>Load more... </div>
              }
              {/* /Group-3 */}
            </div>
            {/* /Groups Tab */}
            <div className="tab-pane fade" id="postsTab">
              <div id="importFeed"></div>
            </div>
            {/* /Posts Tab */}
            <div className="tab-pane fade" id="eventsTab">
              <div className="mission-post-card row g-0 mb-4">
                <div className="col-md-6">
                  <div className="mission-post-img-view">
                    <img src="/img/top-story-img.jpg" className="img-fluid" />
                    <div className="img-content">
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
                    <div className="text-end">
                      <button className="btn btn-light">
                        <i className="lar la-bookmark"></i>
                        Pin to calendar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /missions-1 */}
              <div className="mission-post-card row g-0 mb-4">
                <div className="col-md-6">
                  <div className="mission-post-img-view">
                    <img src="/img/top-story-img.jpg" className="img-fluid" />
                    <div className="img-content">
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
                    <div className="text-end">
                      <button className="btn btn-light">
                        <i className="lar la-bookmark"></i>
                        Pin to calendar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /missions-2 */}
            </div>
            {/* /Events Tab */}
            <div className="tab-pane fade" id="pollsTab">
              <Polls polls={pollList} />
              {
                (pageNumber <= totalPage) &&
                <div className="d-flex justify-content-end cursor-pointer" onClick={() => { searchList("polls", searchValue, false) }}>Load more... </div>
              }
            </div>
            {/* /Polls Tab */}
            <div className="tab-pane fade" id="missionsTab">
              <div className="mission-post-card row g-0 mb-4">
                <div className="col-md-6">
                  <div className="mission-post-img-view">
                    <img src="/img/top-story-img.jpg" className="img-fluid" />
                    <div className="img-content">
                      <div>
                        <img src="/img/flower.jpg" />
                      </div>
                      <div>
                        <div className="d-flex align-items-center justify-content-between">
                          <h5>264 signatures</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mission-post-content">
                    <h4 className="mission-post-title text-truncate">
                      Tree Mission
                    </h4>
                    <p className="mission-post-para line-3">
                      We wanna plant tree help us plant tree please we will help
                      the environment help us join us we will plant many trees
                      in the forest north of the south will be trees in forest
                      north of the south yea ..
                    </p>
                    <div className="text-end">
                      <button className="btn btn-light">
                        <i className="lar la-bookmark"></i>
                        Bookmark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /missions-1 */}
              <div className="mission-post-card row g-0 mb-4">
                <div className="col-md-6">
                  <div className="mission-post-img-view">
                    <img src="/img/top-story-img.jpg" className="img-fluid" />
                    <div className="img-content">
                      <div>
                        <img src="/img/flower.jpg" />
                      </div>
                      <div>
                        <div className="d-flex align-items-center justify-content-between">
                          <h5>
                            <small>SEK</small>4,207 raised
                          </h5>
                          <h5>87%</h5>
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "87%" }}
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mission-post-content">
                    <h4 className="mission-post-title text-truncate">
                      Tree Mission
                    </h4>
                    <p className="mission-post-para line-3">
                      We wanna plant tree help us plant tree please we will help
                      the environment help us join us we will plant many trees
                      in the forest north of the south will be trees in forest
                      north of the south yea ..
                    </p>
                    <div className="text-end">
                      <button className="btn btn-light">
                        <i className="lar la-bookmark"></i>
                        Bookmark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /missions-2 */}
            </div>
            {/* /Missions Tab */}
          </div>
        </div>
      </div>
    </>
  );
}
