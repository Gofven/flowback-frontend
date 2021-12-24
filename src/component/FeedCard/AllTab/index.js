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
import Post from "./Post";

export default function AllTab() {
  return (
    <div className="tab-pane fade show active" id="allTab">
      <Post>
        <p className="post-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea
          repellendus aperiam magnam voluptatibus natus, sequi pariatur dolores
          aliquid laboriosam iure voluptas eius accusantium reprehenderit ullam
          quo fuga ducimus, perferendis tempora!
        </p>
        <div className="post-img-wrapper"></div>
      </Post>
      <Post>
        <p className="post-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea
          repellendus aperiam magnam voluptatibus natus, sequi pariatur dolores
          aliquid laboriosam iure voluptas eius accusantium reprehenderit ullam
          quo fuga ducimus, perferendis tempora!
        </p>
        <div className="post-img-wrapper">
          <img src="/img/post-img.jpg" className="img-fluid" alt="post-img" />
        </div>
      </Post>
      <Post>
        <p className="post-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea
          repellendus aperiam magnam voluptatibus natus.
        </p>
        <div className="mission-post-card row g-0">
          <div className="col-md-6">
            <div className="mission-post-img-view">
              <img src="/img/top-story-img.jpg" className="img-fluid" />
              <div className="img-content">
                <div>
                  <img src="/img/flower.jpg" />
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5>734 signatures</h5>
                    <h5>36%</h5>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "36%" }}
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
              <h4 className="mission-post-title text-truncate">Tree Mission</h4>
              <p className="mission-post-para line-4">
                We wanna plant tree help us plant tree please we will help the
                environment help us join us we will plant many trees in the
                forest north of the south will be trees in forest north of the
                south yea ..
              </p>
            </div>
          </div>
        </div>
      </Post>
    </div>
  );
}
