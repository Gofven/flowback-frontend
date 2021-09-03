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
import { useTab } from "../../../../hook/useTab";
import MyGroupsTab from "./MyGroupsTab";
import NewGroupsTab from "./NewGroupsTab";
import PopularGroupsTab from "./PopularGroupsTab";

export default function Trendig2() {
  const { tab, activeTab, bind: handleOnClick } = useTab([
    "My Groups",
    "New",
    "Popular",
  ]);
  const renderTab = () => {
    switch (activeTab) {
      case tab[0]:
        return <MyGroupsTab />;
      case tab[1]:
        return <NewGroupsTab />;
      case tab[2]:
        return <PopularGroupsTab />;
    }
  };
  return (
    <div className="card groups-card chat-list-card chat-card card-rounded overflow-hidden">
      <div className="card-header pb-0">
        <h4 className="card-title">Trending</h4>
        <ul className="bottom-line-tab nav nav-pills" id="pills-tab">
          {tab?.map((item, index) => (
            <li className="nav-item" key={index}>
              <span
                className={`nav-link${item === activeTab ? " active" : ""}`}
                data-id={index}
                {...handleOnClick}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-body overflow-hidden">
        <div className="pre-scrollable">
          <div className="tab-content" id="pills-tabContent">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
