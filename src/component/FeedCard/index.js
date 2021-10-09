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
import { useTab } from "../../hook/useTab";
import AllTab from "./AllTab";
import EventsTab from "./EventsTab";
import MissionsTab from "./MissionsTab";
import PollsTab from "./PollsTab";
import VotingsTab from "./VotingsTab";

export default function FeedCard(props) {
  const { tab, activeTab, bind: handleOnClick } = useTab([
    "All",
    // "Missions",
    // "Polls",
    // "Events",
  ]);

  const renderTab = () => {
    switch (activeTab) {
      case tab[0]:
        return <PollsTab groupId={props.groupId} pollType={props.pollType}/>;
      case tab[1]:
        return <PollsTab groupId={props.groupId} pollType={props.pollType}/>;
      // case tab[1]:
      //   return <MissionsTab />;
      // case tab[1]:
      //   return <VotingsTab />;
      // case tab[3]:
      //   return <EventsTab />;
    }
  };

  let feedCardTitle;
  switch (props.pollType) {
    case 'mission':
      feedCardTitle = 'Missions';
      break;
    default:
      feedCardTitle = 'Feed'
  }

  return (
    <div className="feed-card card-rounded mb-4">
      <div className="card-header flex-header tab-header">
        <h4 className="card-title">{feedCardTitle}</h4>
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
      <div className="card-body">
        <div className="tab-content" id="pills-tabContent">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
