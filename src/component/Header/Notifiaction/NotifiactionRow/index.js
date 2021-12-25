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
import Image from "../../../common/Image";

export default function NotifiactionRow({
  img = "/img/flower.jpg",
  username = "Lorem ipsum",
  message = "dolor sit amet, consectetur adipisicing elit",
  duration = "1d ago",
}) {
  return (

    <div className="notification-list-row row mx-auto">
      <div className="col-2 px-0">
        <Image src={img} className="notification-list-img img-fluid" errImg={'/img/no-photo.jpg'} />
      </div>
      <div className="col-10 px-2 notification-list-content">
        <p>
          <b>{username}</b> {message}.
        </p>
        <div className="notification-time">{duration}</div>
        <a href="#" className="accept-btn">
          Accepted <i className="las la-check"></i>
        </a>
        <a href="#" className="decline-btn">
          Decline <i className="las la-times"></i>
        </a>
      </div>
    </div>
  );
}
