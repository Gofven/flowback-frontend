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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import React, { Children } from "react";
import { formatDate } from "../../../../../utils/common";
import Image from "../../../../common/Image";

export default function PostComment({
  children,
  id,
  comment,
  created_at,
  created_by,
  edited,
  liked,
  likes_count,
  reply_to,
  depth,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
  onReplyClick,
  readOnly
}) {


  const user = JSON.parse(localStorage.getItem('user'));

  return (                //Pushes comments further left for each reply in a chain of replies
    <div className="media" style={{ "margin-left": `${depth * 15}px` }}>
      {created_by &&
        <Image src={created_by.image} className="post-user-img" errImg={'/img/no-photo.jpg'} />
      }
      <div className="media-body">
        <div className="reply-name">{created_by.first_name} {created_by.last_name}</div>
        <p className="reply-text">{comment}</p>
        <div className="reply-time">
          {formatDate(created_at)}
          {/*<a href="#">{likes_count || 0} {(likes_count === 1) ? 'Like' : 'Likes'}</a>*/}
          {
            edited &&
            <a href="#">Edited</a>
          }

          <a className="cursor-pointer"
            onClick={() => onReplyClick(id)}>Reply</a>

        </div>
        {children}
      </div>
      <div className="post-action dropdown d-flex justify-content-center">
        {/*
          (!readOnly || liked) &&
          <FontAwesomeIcon icon={(liked) ? faHeartSolid : faHeart} color="red"
            className={`${!readOnly ? "cursor-pointer " : ""}`}
            onClick={() => {
              if (!readOnly) {
                onLikeComment()
              }
            }}
          />
          */}
        <div>&nbsp;&nbsp;</div>
        {
          (user && (user.id === created_by.id) && !readOnly) &&
          <>
            <FontAwesomeIcon icon={faEdit}
              className="text-primary cursor-pointer"
              onClick={() => { onUpdateComment() }}
            />
            <div>&nbsp;&nbsp;</div>
            <FontAwesomeIcon icon={faTrashAlt} color='#DD4A4C'
              className="cursor-pointer"
              onClick={() => { onDeleteComment() }}
            />
          </>
        }
        {/* <a
          href="#"
          id="postAction"
          data-bs-toggle="dropdown"
          aria-expanded="true"
        >
          <i className="las la-ellipsis-h"></i>
        </a> */}
        {/* <ul
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
        </ul> */}
      </div>
    </div>
  );
}
