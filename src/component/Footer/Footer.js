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

const data = [
  { title: "Privacy Plicy", url: "#" },
  { title: "Terms of serivce", url: "" },
  { title: "Pricing", url: "" },
  { title: "Support", url: "" },
  { title: "About", url: "" },
  { title: "Developers", url: "" },
  { title: "Cookies", url: "" },
  { title: "Help", url: "" },
];
export default function Footer() {
  return (
    <div className="footer mt-4">
      {data?.map((item, index) => (
        <a href={item.url} key={index} className="footer-links">
          {item.title}
        </a>
      ))}

      <p className="copy-right-text">&copy; 2020 Flowback by Kunlabori</p>
    </div>
  );
}
