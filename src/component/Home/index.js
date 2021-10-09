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
import FeedCard from "../FeedCard";
import GroupChat from "../GroupChat";
import "./home.css";
import Trendig1 from "./Trendig/Trendig1";
import Trendig2 from "./Trendig/Trendig2";

export default function Home() {
  return (
    <>
      {/*<section className="story-section">*/}
      {/*  <div className="container-xl">*/}
      {/*    <div className="owl-carousel topStorySlider">*/}
      {/*      <div className="story-card">*/}
      {/*        <img*/}
      {/*          src="/img/top-story-img.jpg"*/}
      {/*          className="img-fluid story-bg"*/}
      {/*          alt="story-img"*/}
      {/*        />*/}
      {/*        <div className="story-content">*/}
      {/*          <h4 className="story-title">The Mission</h4>*/}
      {/*          <div className="media">*/}
      {/*            <div className="media-body">*/}
      {/*              <p className="line-3">*/}
      {/*                Lorem ipsum dolor sit amet, consectetur adipisicing elit.*/}
      {/*                Dolorem blanditiis rerum veniam porro, repudiandae dolorum*/}
      {/*                accusamus quaerat error, pariatur perspiciatis aliquam,*/}
      {/*                autem, dignissimos minus nobis tempora perferendis labore*/}
      {/*                impedit esse.*/}
      {/*              </p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      <section className="home-dashboard">
        <div className="container-xl mt-4">
          <div className="row">
            <div className="col-md-3 mb-4">
              <GroupChat />
            </div>

            <div className="col-md-6">
              <FeedCard />
            </div>

            <div className="col-md-3">
              <Trendig1 />
              <Trendig2 />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
