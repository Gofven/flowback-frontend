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

import './styles.css';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Children, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../../../../utils/common";
import Image from "../../../common/Image";
import Profile from "../../../User/Profile";
import CommentBox from "../CommentBox";
import PostComment from "./PostComment";

export default function Post({ poll, addComment, updateComment, deleteComment, likeComment, maxComments, children, readOnlyComments }) {
  let { groupId } = useParams();

  const [replyTo, setReplyTo] = useState(null);
  const [editComment, setEditComment] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const onReplyClick = (id) => {
    // replyTo(null);
    setReplyTo(id);
  }

  const onUpdateComment = (comment) => {
    setEditComment(comment);
  }

  const reanderReply = (reply) => {
    return reply?.map((item, index) => {
      if (item.reply) {
        return ((!maxComments || index < maxComments) ?
          <PostComment {...item} key={index} readOnly={readOnlyComments}
            onReplyClick={(replyId) => onReplyClick(replyId)}
            onUpdateComment={() => onUpdateComment(item)}
            onDeleteComment={() => deleteComment(item.id)}
            onLikeComment={() => likeComment(item)}
          >
            {reanderReply(item.reply)}
          </PostComment> : null
        );
      } else {
        return (
          (!maxComments || index < maxComments) ?
            <PostComment {...item} key={index} readOnly={readOnlyComments}
              onReplyClick={(replyId) => onReplyClick(replyId)}
              onUpdateComment={() => onUpdateComment(item)}
              onDeleteComment={() => deleteComment(item.id)}
              onLikeComment={() => likeComment(item)}
            /> : null);
      }
    });
  };



  return (
    <div className="post-view">
      <div className="post-header d-flex justify-content-between">
        {poll && poll.created_by &&
          <div className="media post-meida">
            <Image src={poll.created_by.image} className="post-user-img" errImg={'/img/no-photo.jpg'} />
            <div className="media-body">
              <h5 className="user-name">
                <Profile id={poll.created_by.id} className='cursor-pointer'>{poll.created_by.first_name || "Test"} {poll.created_by.last_name}</Profile><span>created a post</span>
              </h5>
              <div className="post-time">{poll && formatDate(poll.created_at, 'DD/MM/YYYY kk:mm')}</div>
            </div>
          </div>
        }
        <Link to={`/groupdetails/${(poll && poll.group && poll.group.id) ? poll.group.id : groupId}/polldetails/${poll.id}`}>
          <FontAwesomeIcon icon={faExternalLinkAlt} color='#737373' />
        </Link>

        {/* <div className="post-action dropdown">
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
                Tag
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Delete
              </a>
            </li>
          </ul>
        </div> */}
      </div>
      <div className="post-body">
        {children}
        <div className="post-comment-view">
          <div className="post-share">
            <div>
              <a href="#">
                <i className="las la-comment"></i>{poll?.comments_details?.total_comments} Comments
              </a>
            </div>
            <div>
              <a href="#">
                <i className="las la-share-square"></i>
                Share
              </a>
              <a href="#" className="ml-2">
                <i className="las la-bookmark"></i>
                Bookmark
              </a>
            </div>
          </div>
          {
            !readOnlyComments &&
            <div className="media">
              <Image src={user.image} className="userImage" errImg={'/img/no-photo.jpg'} />
              <div className="media-body">
                <CommentBox poll={poll} replyTo={replyTo}
                  updateComment={editComment}
                  onInputBlur={() => { setReplyTo(null); setEditComment(null) }}
                  onAddComment={(message) => {
                    if (editComment) {
                      const comment = editComment;
                      comment.comment = message;
                      updateComment(comment);
                    } else {
                      if (addComment && typeof addComment === 'function') {
                        try {
                          console.log('in post add comment', replyTo);
                          addComment(message, poll.id, replyTo)
                        } catch (e) {
                          // print error message
                        }
                      }
                    }
                  }} />
              </div>
            </div>
          }
          <div className="comment-reply">{reanderReply(poll && poll.comments_details && poll.comments_details.comments)}</div>
        </div>
      </div>
    </div>
  );
}
