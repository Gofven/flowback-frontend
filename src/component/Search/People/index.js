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

import React from 'react'
import Image from "../../common/Image";

export default function People(props) {
  const people = props.people;

  return (
    <>
      {people?.map((person, index) => (
        <div className="media contact-view" key={person.id}>
          <Image src={person.image} />
          <div className="media-body">
            <h6 className="contact-name">{person.first_name} {person.last_name}</h6>
            <p className="contact-location">
              
              {person.city && person.city.city_name} {person.country && person.country.country_name}
            </p>
          </div>
        </div>

      ))
      }
    </>
  )
}
