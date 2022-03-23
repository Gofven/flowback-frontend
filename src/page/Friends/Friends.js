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

import React, { useState, useEffect } from "react";
import "./styles.css";
import Layout1 from "../../layout/Layout1";
import GroupChat from "../../component/GroupChat/GroupChat";
import { Link } from "react-router-dom";
import { postRequest } from "../../utils/API";
import Image from "../../component/common/Image/Image";
import { Form } from "react-bootstrap";
import { SearchFilter, DropDownFilterGroup } from '../../component/common/Filter/Filter'
import GroupButtons from "./GroupForm/GroupButtons";

export default function Friends() {

  const [filter, setFilter] = useState({ search: "", typeOfMember: null })
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
  console.log(groups)

  return (
    <Layout1>
      <section className="grupper-dashboard mt-4">
        <div className="container-xl">
          <div className="row justify-content-center">
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
              <SearchFilter setFilter={setFilter} filter={filter} />
              <DropDownFilterGroup setFilter={setFilter} filter={filter} />

              {
                groups?.map((group, index) => (
                  (group.title?.toUpperCase().includes(filter.search.toUpperCase()) ||
                    group.description?.toUpperCase().includes(filter.search.toUpperCase())) &&
                  (group.user_type === filter.typeOfMember || filter.typeOfMember === null ||
                    (group.user_type === "" && filter.typeOfMember === "Not Member")) &&
                  < div className="grupper-card" key={group.id} >

                    <Link to={`/groupdetails/${group.id}`}>
                      <div className="grupper-img-view">
                        <div className="media grupper-img-content">
                          <Image src={group.image} className="grupper-dp" />
                          <div className="media-body title-overflow-fix">
                            <h3 className="grupper-title text-truncate ">
                              {group.title}
                            </h3>
                          </div>
                        </div>
                        <Image src={group.cover_image} className="grupper-cover" errImg={'/img/no-banner.jpg'} />
                      </div>
                    </Link>
                    <div className="grupper-content-view">
                      <div className="media">
                        <div className="pr-2">
                        </div>
                        <div className="media-body">
                          {/* <Link to={`/groupdetails/${item.id}`}> */}
                          <p className="grupper-description line-4">
                            {group.description}
                          </p>
                          {/* </Link> */}
                        </div>
                        <div className="grupper-btn-view">
                          <GroupButtons user_type={group.user_type} groupId={group.id} groupJoinStatus={group.group_join_status} total_members={group.total_members} reload={false} />
                          {(group.user_type === "Owner" || group.user_type === "Delegator") && <div>You can't leave this group</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>
    </Layout1 >
  );
}
