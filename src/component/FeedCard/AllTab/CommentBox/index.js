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

import React, { useEffect, useRef, useState } from "react";
import { postRequest } from "../../../../utils/API";

export default function CommentBox({ border = true, onAddComment, replyTo, onInputBlur, updateComment, poll }) {

  const inputRef = useRef();
  const commentBeingRepliedTo = poll.comments_details.comments.find(comment=>comment.id===replyTo);
  const handleKeypress = (e) => {
    console.log("e", e);
    console.log("e", e.target.value);
    if (e.key === "Enter") {
      if (onAddComment && typeof onAddComment == 'function') {
        try {
          onAddComment(e.target.value);
          e.target.value = "";
        } catch (e) {
          console.error('Error in add comment', e);
        }
      }
    }
  }

  useEffect(() => {
    if (replyTo && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyTo])

  useEffect(() => {
    if (updateComment) {
      inputRef.current.focus();
      inputRef.current.value = updateComment.comment;
    }
  }, [updateComment])

  return (

    <div data-brackets-id="839" className="input-group pl-2">
      {/* <a
          data-brackets-id="840"
          href="#"
          className="btn btn-outline-secondary px-0"
          id="file"
        >
          <i data-brackets-id="841" className="las la-plus-circle"></i>
        </a>
        <a
          data-brackets-id="842"
          href="#"
          className="btn btn-outline-secondary px-1"
          id="emoji"
        >
          <i data-brackets-id="843" className="las la-smile"></i>
        </a> */}
      <input
        data-brackets-id="844"
        type="text"
        className="form-control"
        placeholder={commentBeingRepliedTo ? `Replying to ${commentBeingRepliedTo.created_by.first_name}` : "Write a comment"}
        onKeyPress={handleKeypress}
        ref={inputRef}
        onBlur={onInputBlur}
      />
    </div>
  );
}
