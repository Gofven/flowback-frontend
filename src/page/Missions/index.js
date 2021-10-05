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
import FeedCard from "../../component/FeedCard";
import Layout1 from "../../layout/Layout1";
import GroupChat from "../../component/GroupChat";
import Trendig1 from "../../component/Home/Trendig/Trendig1";
import Trendig2 from "../../component/Home/Trendig/Trendig2";

export default function Missions() {
  return <Layout1>
    <section className="home-dashboard">
        <div className="container-xl mt-4">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <FeedCard pollType={'mission'}/>
            </div>
          </div>
        </div>
      </section>
  </Layout1>;
}
