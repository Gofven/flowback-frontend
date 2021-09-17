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

import React, { useState, useEffect } from "react";
import "./styles.css";
import Layout1 from "../../layout/Layout1";
import GroupChat from "../../component/GroupChat";
import { Link } from "react-router-dom";
import { postRequest } from "../../utils/API";
import Image from "../../component/common/Image";
import { Form } from "react-bootstrap";

export default function Friends() {

  const [groups, setGroups] = useState([]);
  const [contries, setContries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({
    page_size: 20,
    sort_by: 'new',
    filter_my_groups: false,
    filter_date_created: '',
    filter_country: '',
    filter_city: ''
  });
  let month = 1;
  let year = 2020;

  //Load list of groups
  useEffect(() => {
    getGroups();
  }, [])

  //Load list of groups by filter
  useEffect(() => {
    getGroups();
  }, [filters])

  // Set filter for popular/Rising/New 
  const handleOnClick = (e) => {
    console.log("sort", e.target.innerText);
    let sort = "new";
    switch (e.target.innerText) {
      case "Popular":
        sort = "popular";
        break;

      case "Rising":
        sort = "rising";
        break;

      default:
        sort = "new";
        break;
    }
    setFilters({ ...filters, sort_by: sort });
  }

  //Set filter for my groups
  const toggleMyGroups = () => {
    setFilters({ ...filters, filter_my_groups: !filters.filter_my_groups });
  }

  //Reset time in filter
  const onClikcAnyTime = () => {
    month = null;
    year = null;
    setFilters({ ...filters, filter_date_created: null })
  }

  // Set Month in filter
  const handleOnMonthSelect = (e) => {
    month = e.target.value;
    let date = month + " " + year;
    setFilters({ ...filters, filter_date_created: date })
  }

  // Set Year in filter
  const handleOnYearSelect = (e) => {
    year = e.target.value;
    let date = month + " " + year;
    setFilters({ ...filters, filter_date_created: date })
  }

  // List of group
  const getGroups = () => {
    postRequest("api/v1/user_group/all_group", filters).then(
      (response) => {
        console.log('response', response);
        if (response) {
          const { status, data } = response;
          setGroups(data.data);
        }
      });
  }

  // Join group request as a member
  const handleOnJoinGroupAsAMember = (item) => {
    postRequest("api/v1/user_group/join_group", { group: item.id, }).then(
      (response) => {
        if (response) {
          const { status, data } = response;
          getGroups();
        }
      });
  }

  // Join group request as a delegate
  const handleOnJoinGroupAsADelegate = (item) => {
    postRequest("api/v1/user_group/join_group", { group: item.id, as_delegator: true}).then(
        (response) => {
            if (response) {
                const { status, data } = response;
                getGroups();
            }
        });
}

  // Reset filter for place
  const onClickAnywhere = () => {
    setFilters({ ...filters, filter_country: null, filter_city: null });

  }

  // Set filter by country
  const handleOnCountrySelect = (e) => {

    setFilters({ ...filters, filter_country: e.target.value, filter_city: null });
    cityList(e.target.value)
  }

  // API call for fetching all the country
  const countryList = () => {
    !contries.length &&
      postRequest("api/v1/location/get_all_countries").then(
        (response) => {
          console.log('response', response);
          const { status, data } = response;
          if (status === "success") {
            setContries(data)

          } else {
            // setError();
          }
        }
      );
  }

  // API call for fetching all the city by specific country
  const cityList = (country) => {
    postRequest("api/v1/location/get_all_cities_by_country", { country: country }).then(
      (response) => {
        console.log('response', response);
        const { status, data } = response;
        if (status === "success") {
          setCities(data)
        } else {
          // setError();
        }
      }
    );
  }

  // Set city which is selected
  const handleOnCitySelect = (e) => {
    setFilters({ ...filters, filter_city: e.target.value });

  }


  return (
    <Layout1>
      <section className="grupper-dashboard mt-4">
        <div className="container-xl">
          <div className="row">
            <div className="col-md-3 mb-4">
              <GroupChat />
            </div>
            {/*/Group chat col*/}

            {/*/Missions Featured Cards Col*/}
            <div className="col-md-6">
              <Link to='/create'>
                <div className="grupper-card">
                  <div className=" text-center my-2">
                    + Create a Group
                  </div>
                </div>
              </Link>
              {
                groups?.map((item, index) => (
                  <div className="grupper-card" key={item.id}>

                    <div className="grupper-img-view">
                      <div className="media grupper-img-content">
                        <Image src={item.image} className="grupper-dp" />
                        <div className="media-body">
                          <p className="location-txt text-truncate">
                            <i className="las la-map-pin"></i>
                            {item.city && item.city.city_name}, {item.country && item.country.country_name}
                          </p>
                          <h3 className="grupper-title text-truncate">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <Image src={item.cover_image} className="grupper-cover" errImg={'/img/no-banner.jpg'} />
                    </div>
                    <div className="grupper-content-view">
                      <div className="media">
                        <div className="pr-2">
                          <p className="member-count">
                            {item.total_members || 0} <small>member</small>
                          </p>
                          <p className="public-group-text">
                            <i className="las la-globe-americas"></i>
                            {item.public ?
                              <span>
                                Public
                          <br />
                          group
                        </span> :
                              <span>
                                Private
                          <br />
                          group
                        </span>}

                          </p>
                        </div>
                        <div className="media-body">
                          <p className="grupper-description line-4">
                            {item.description}
                          </p>
                        </div>
                        <div className="grupper-btn-view">
                          <Link to={`/groupdetails/${item.id}`}>
                            <a
                              href="#"
                              className="btn btn-sm btn-block btn-outline-secondary mb-2">
                              View group
                            </a>
                          </Link>
                          {
                            item.user_type ?
                              <a
                                href="#"
                                className="btn btn-sm btn-block btn-outline-secondary"
                              >
                                <i className="las la-check text-success mr-1"></i>
                                {item.user_type}

                              </a> :
                              (
                                (item.group_join_status == "Requested") ?
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-block btn-outline-secondary"
                                  >
                                    {item.group_join_status}
                                  </a> :
                                 <div className="flex-row">
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-block btn-outline-secondary"
                                    onClick={() => { handleOnJoinGroupAsAMember(item) }}
                                  >Join as member</a>
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-block btn-outline-secondary"
                                    onClick={() => { handleOnJoinGroupAsADelegate(item) }}
                                  >Join as delegate</a>
                                </div>
                              )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            {/*/Missions Featured Cards Col*/}

            {/*Short-by, Filter-by & Supported Col*/}
            <div className="col-md-3">
              {/*Short-by Card*/}
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
                          onClick={handleOnClick}
                        >New
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link short-by-link"
                          href="#"
                          data-bs-toggle="pill"
                          onClick={handleOnClick}
                        >
                          Popular
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link short-by-link"
                          href="#"
                          data-bs-toggle="pill"
                          onClick={handleOnClick}
                        >
                          Rising
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/*/Short-by Card*/}

              {/*Filter-by Card*/}
              <div className="card filter-by-card mt-4 chat-list-card chat-card card-rounded overflow-hidden">
                <div className="card-header pb-0 border-bottom-0">
                  <h4 className="card-title">Filter by</h4>
                </div>
                <div className="card-body overflow-hidden">
                  <form className="form filter-form" action="#">
                    <div className="form-check">
                      <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        value={filters.filter_my_groups}
                        id="MyGroupsOnly"
                        onChange={toggleMyGroups}
                      />
                      <label className="form-check-label cursor-pointer" for="MyGroupsOnly">
                        My Groups only
                      </label>
                    </div>
                    <div className="location-group">
                      <h5 className="shrtby-intitle">Location</h5>
                      <label for="dateSelect" className="short-by-link active cursor-pointer"
                        onClick={onClickAnywhere}>
                        Anywhere
                      </label>
                      <Form.Group>
                        <Form.Control as="select" className="form-select form-select-sm border-0 mt-2"
                          id="citySelect"
                          onChange={handleOnCountrySelect}
                          onClick={countryList}
                          placeholder="Country"
                        >
                          <option disabled selected>Choose a Country</option>
                          {
                            contries?.map((countryDetail) => (
                              <option value={countryDetail.id} key={countryDetail.id}
                                id={countryDetail.id}
                                selected={countryDetail.id === filters?.filter_country}
                              >{countryDetail.country_name}</option>
                            ))
                          }
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Control as="select"
                          className="form-select form-select-sm border-0 mt-2"
                          onChange={handleOnCitySelect}
                          disabled={!filters?.filter_country}
                        >
                          <option disabled selected>Choose a City</option>
                          {
                            cities?.map((cityDetail) => (
                              <option value={cityDetail.id} key={cityDetail.id}
                                id={cityDetail.id}
                                selected={cityDetail.id === filters?.filter_city}
                              >{cityDetail.city_name}</option>
                            ))
                          }
                        </Form.Control>
                      </Form.Group>

                    </div>
                    <div>
                      <div className="select-col">
                        <h5 className="shrtby-intitle">Date created</h5>
                        <label
                          for="dateSelect"
                          className="short-by-link active"
                          onClick={onClikcAnyTime}
                        >
                          Anytime
                        </label>
                      </div>
                      <div className="select-row">
                        <select
                          className="form-select form-select-sm date-select"
                          id="dateSelect" onChange={handleOnMonthSelect}
                        >
                          {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                              <option value={month} key={month}>{month}</option>
                            ))
                          }
                        </select>
                        <select
                          className="form-select form-select-sm year-select"
                          id="yearSelect"
                          onChange={handleOnYearSelect}
                        >
                          {
                            [2020, 2021].map((year) => (
                              <option value={year} key={year}>{year}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/*/Filter - by Card*/}
            </div>
            {/*/Short-by & Filter-by Col*/}
          </div>
        </div>

      </section>
    </Layout1>
  );
}
