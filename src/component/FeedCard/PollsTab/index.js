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

import React, { useEffect, useState } from "react";
import { postRequest } from "../../../utils/API";
import { FormatComments } from "../../../utils/common";
import CommentBox from "../AllTab/CommentBox";
import Post from "../AllTab/Post";
import PostComment from "../AllTab/Post/PostComment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
import { UserTypes } from "../../../constants/constants";
import { DropDownPollFilter, SearchFilter } from '../../common/Filter/'
import ProposalDetails from "../../../page/Polls/PollResults/ProposalDetails";
import { Link } from "react-router-dom";
import Image from "../../common/Image";
import './index.css'

export default function PollsTab(props) {
    let groupId = props.groupId;
    let pollType = props.pollType;
    const [polls, setPolls] = useState([]);
    const [pollFilter, setPollFilter] = useState({ pollType: null, discussion: null, search: "" });
    const [lastPollCreatedDate, setLastPollCreatedDate] = useState();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    //The amount of polls that are loaded. If this value is at 1000, then this is only for demo. Please change to something lower when the backend is fixed to allow searching for polls in the database
    const [pageSize, setPageSize] = useState(1000);

    const getHomePolls = (first_page) => {
        let data = {
            first_page: first_page,
            last_poll_created_at: lastPollCreatedDate,
            page: page,
            page_size: pageSize,
            poll_type: pollType
        }
        postRequest("api/v1/group_poll/home_all_poll_list", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data: res } = response;
                    if (res != undefined) {
                        const data = res.data;
                        if (status == "success") {
                            if (first_page) {
                                setLastPollCreatedDate(res.last_poll_created_at);
                            }
                            console.log('poll data', data.data)
                            if (data) {
                                data.forEach((poll) => {
                                    poll.comments_details.comments = FormatComments(poll.comments_details.comments);
                                })
                            }
                            setPolls([...polls, ...data]);
                            setPage(page + 1);
                            setTotalPage(res.total_page);
                        }
                    }
                }
            }
        );
    }

    const getGroupPolls = (first_page) => {
        let data = {
            group_id: props.groupId,
            first_page: first_page,
            last_poll_created_at: lastPollCreatedDate,
            page: page,
            page_size: pageSize
        }
        postRequest("api/v1/group_poll/get_poll_list", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data: res } = response;
                    if (res != undefined) {
                        const data = res.data;
                        if (status == "success") {
                            if (first_page) {
                                setLastPollCreatedDate(res.last_poll_created_at);
                            }
                            console.log('poll data', data)
                            if (data) {
                                data.forEach((poll) => {
                                    poll.comments_details.comments = FormatComments(poll.comments_details.comments);
                                })
                            }
                            setPolls([...polls, ...data]);
                            setPage(page + 1);
                            setTotalPage(res.total_page);
                        }
                    }
                }

            }
        );
    }
    const getPolls = (first_page) => {
        if (groupId) {
            getGroupPolls(first_page)
        }
        else {
            getHomePolls(first_page);
        }

    }

    useEffect(() => {
        getPolls(true);
    }, [])

    const addComment = (message, pollId, replyTo) => {
        var data = {
            poll: pollId,
            comment: message
        }
        if (replyTo) {
            data.reply_to = replyTo;
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/create_poll_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('polls data', data);
                        let pollsDup = polls.slice();
                        const index = pollsDup.findIndex((poll) => poll.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        pollsDup.splice(index, 1, data);
                        setPolls(pollsDup);
                        // polls?.map((poll, index) => {
                        //     if (poll.id == data.id) {
                        //         pollsDup.splice(index, 1, data);
                        //         setPolls([...pollsDup]);
                        //     }
                        // })
                    }
                }

            }
        );
    }
    const updateVote = (status, poll) => {
        var data = {
            poll: poll.id,
            group: groupId || poll.group.id,
            voting_type: status
        }
        postRequest("api/v1/group_poll/poll_voting", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    let pollsDup = polls.slice();
                    const index = pollsDup.findIndex((poll) => poll.id === data.id);
                    data.comments_details.comments = FormatComments(data.comments_details.comments);
                    pollsDup.splice(index, 1, data);
                    setPolls(pollsDup);
                }
            });
    }

    const updateComment = (comment) => {
        var data = {
            comment_id: comment.id,
            comment: comment.comment
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/edit_poll_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('polls data', data);
                        let pollsDup = polls.slice();
                        const index = pollsDup.findIndex((poll) => poll.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        pollsDup.splice(index, 1, data);
                        setPolls(pollsDup);
                    }
                }

            }
        );
    }

    const likeComment = (comment) => {
        var data = {
            poll_comment: comment.id,
            like: !comment.liked
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/like_dislike_poll_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('polls data', data);
                        let pollsDup = polls.slice();
                        const index = pollsDup.findIndex((poll) => poll.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        pollsDup.splice(index, 1, data);
                        setPolls(pollsDup);
                    }
                }

            }
        );
    }

    const deleteComment = (commentId) => {
        var data = {
            comment: commentId
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/delete_poll_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('polls data', data);
                        let pollsDup = polls.slice();
                        const index = pollsDup.findIndex((poll) => poll.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        pollsDup.splice(index, 1, data);
                        setPolls(pollsDup);
                    }
                }

            }
        );
    }

    useEffect(() => {
        console.log("polls", polls);
    }, [polls])

    // useEffect(() => {
    //     //Scuffed solution, for when one filters polls, there's some polls missing and they're not being automatically loaded.
    //     //i.e one has to click the "load more..." button. 
    //     setInterval(getPolls(false), 500)

    // }, [pollFilter])

    let loadMore = (ev) => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            // getPolls(false)
        }
    };
    window.onscroll = loadMore;

    return (
        <div className="tab-pane fade show active" id="PollsTab">

            <DropDownPollFilter setPollFilter={setPollFilter} pollFilter={pollFilter} />
            {/* <DropDownFilter setPollFilter={setPollFilter} pollFilter={pollFilter} filterCategories={["In progress", "Finished"]} filterTitle="Poll Progress" /> */}
            <SearchFilter setFilter={setPollFilter} filter={pollFilter} />

            {polls?.map((poll, index) => {
                if (
                    (pollFilter.discussion === poll.discussion
                        || pollFilter.discussion === null)
                    && (
                        (pollFilter.pollType === poll.voting_type && poll.type !== "event")
                        || pollFilter.pollType === poll.type
                        || pollFilter.pollType === null)
                    && (
                        poll.title?.toUpperCase().includes(pollFilter.search.toUpperCase()) || poll.description?.toUpperCase().includes(pollFilter.search.toUpperCase()) || poll.group.title.toUpperCase().includes(pollFilter.search.toUpperCase())
                    )
                )
                    return <div style={{ "borderTop": "rgb(221, 221, 221) solid 1px", "marginTop": "25px", "paddingTop": "8px" }}>
                        <Link to={`/groupdetails/${(poll && poll.group && poll.group.id) ? poll.group.id : groupId}/polldetails/${poll.id}`}>
                            <div className="poll-title" >{poll.title}</div>
                        </Link>
                        <Link to={`/groupdetails/${(poll && poll.group && poll.group.id) ? poll.group.id : groupId}`}>
                            <div className="group-logo-and-title">
                                <Image src={poll.group.image} className="group-details-dp" />
                                <div className="poll-title" >{poll.group.title}</div>
                            </div>
                        </Link>

                        <p className="post-text">
                            <ProposalDetails proposalDescription={poll.description} proposal={{ id: poll.id }} />
                        </p>
                        <div className="post-img-wrapper"></div>
                        <Post poll={poll} key={poll.id}
                            addComment={(message, pollId, replyTo) => addComment(message, pollId, replyTo)}
                            updateComment={(comment) => updateComment(comment)}
                            deleteComment={(commentId) => deleteComment(commentId)}
                            likeComment={(comment) => likeComment(comment)}
                            readOnlyComments={true}
                            //readOnlyComments={poll.discussion === "Finished" || !(poll.group.user_type && poll.group.user_type !== UserTypes.Delegator)}
                            maxComments={-1}>
                        </Post>
                    </div>
            })
            }
            {
                (page < totalPage + 1) &&
                <div className="d-flex justify-content-end cursor-pointer" onClick={() => { getPolls(false) }}>Load more... </div>
            }
        </div>
    );
}
