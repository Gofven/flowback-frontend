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

import React, { useState } from "react";
import Image from '../../../../component/common/Image';
import CommentBox from '../../../../component/FeedCard/AllTab/CommentBox';
import PostComment from '../../../../component/FeedCard/AllTab/Post/PostComment';
import Profile from '../../../../component/User/Profile';
import { formatDate } from '../../../../utils/common';
import './styles.css';

export default function CounterProposal({ counterProposal, addComment, updateComment, deleteComment, likeComment, maxComments, children, readOnlyComments }) {

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
        <div className="card counter-proposal-card">
            {counterProposal.final_score !== null? <div className='points'>{counterProposal?.final_score || 0}</div> : null}
            <div className="post-header d-flex justify-content-between card-header mb-0">
                {counterProposal && counterProposal.user &&
                    <div className="media post-meida">
                        <Image src={counterProposal.user.image} className="post-user-img" errImg={'/img/no-photo.jpg'} />
                        <div className="media-body">
                            <h5 className="user-name">
                                <Profile className='inline-block' id={counterProposal.user.id}>{counterProposal.user.first_name} {counterProposal.user.last_name} </Profile>
                            </h5>
                            <div className="post-time">{counterProposal && formatDate(counterProposal.created_at, 'DD/MM/YYYY kk:mm')}</div>
                        </div>
                    </div>
                }
            </div>
            <div className="counterproposal-body card-body">
                {children}
                <div className="counterproposal-comment-view">
                    <div className="counterproposal-share">
                        <div>
                            <a href="#">
                                <i className="las la-comment"></i>{counterProposal?.comments_details?.total_comments} Comments
              </a>
                        </div>
                    </div>
                    {
                        !readOnlyComments &&
                        <div className="media">
                            <Image src={user.image} className="userImage" errImg={'/img/no-photo.jpg'} />
                            <div className="media-body">
                                <CommentBox poll={counterProposal} replyTo={replyTo}
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
                                                    console.log('in counterproposal add comment', replyTo);
                                                    addComment(message, counterProposal.id, replyTo)
                                                } catch (e) {
                                                    // print error message
                                                }
                                            }
                                        }
                                    }} />
                            </div>
                        </div>
                    }
                    <div className="comment-reply">{reanderReply(counterProposal && counterProposal.comments_details && counterProposal.comments_details.comments)}</div>
                </div>
            </div>
        </div>
    );
}
