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

export default function CommentReply() {
  return (
    <div className="comment-reply">
      <div className="media">
        <img src="/img/no-photo.jpg" />
        <div className="media-body">
          <div className="reply-name">Emilio Mller</div>
          <p className="reply-text">Wow so cool!</p>
          <div className="reply-time">
            34m ago
            <a href="#">Edited</a>
            <a href="#">Reply</a>
          </div>
          <div className="media">
            <img src="/img/no-photo.jpg" />
            <div className="media-body">
              <div className="reply-name">Emilio Mller</div>
              <p className="reply-text">Wow so cool!</p>
              <div className="reply-time">
                34m ago
                <a href="#">Edited</a>
                <a href="#">Reply</a>
              </div>
            </div>
            <div className="post-action dropdown">
              <a
                href="#"
                id="postAction"
                data-bs-toggle="dropdown"
                aria-expanded="true"
              >
                <i className="las la-ellipsis-h"></i>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="postAction"
                id="postDrop"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Edit
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Share
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="post-action dropdown">
          <a
            href="#"
            id="postAction"
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            <i className="las la-ellipsis-h"></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="postAction"
            id="postDrop"
          >
            <li>
              <a className="dropdown-item" href="#">
                Edit
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Share
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Delete
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="collapse" id="showMoreCmt">
        <div className="media">
          <img src="/img/no-photo.jpg" />
          <div className="media-body">
            <div className="reply-name">Emilio Mller</div>
            <p className="reply-text">Wow so cool!</p>
            <div className="reply-time">
              34m ago
              <a href="#">Edited</a>
              <a href="#">Reply</a>
            </div>
          </div>
          <div className="post-action dropdown">
            <a
              href="#"
              id="postAction"
              data-bs-toggle="dropdown"
              aria-expanded="true"
            >
              <i className="las la-ellipsis-h"></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="postAction"
              id="postDrop"
            >
              <li>
                <a className="dropdown-item" href="#">
                  Edit
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Share
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <a
        href="#showMoreCmt"
        className="show-more-cmt"
        data-bs-toggle="collapse"
        role="button"
        aria-expanded="false"
      >
        {window.t("Show more comments")}
      </a>
    </div>
  );
}
