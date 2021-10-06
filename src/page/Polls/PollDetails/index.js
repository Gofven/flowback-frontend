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

import React, { useState, useEffect, useRef, createRef } from "react";
import "./styles.css";
import Layout1 from "../../../layout/Layout1";
import GroupChat from "../../../component/GroupChat";
import { Link, useParams } from "react-router-dom";
import { postRequest } from "../../../utils/API";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
import { FormatComments, formatDate, inputKeyValue } from "../../../utils/common";
import Post from "../../../component/FeedCard/AllTab/Post";
import UserGroup from "../../../apis/UserGroup";
import { Button, Textbox } from "../../../component/common";
import Counterproposals from "../CounterProposals";
import Loader from "../../../component/common/Loader";
import { UserTypes } from "../../../constants/constants";

export default function PollDetails() {
    let { groupId } = useParams();
    let { pollId } = useParams();
    const [poll, setPoll] = useState({});
    const [group, setGroup] = useState({});
    const [counterProposal, seteCounterProposal] = useState({});
    const [counterProposalLoading, setCounterProposalLoading] = useState(false);

    // Get Poll Details
    const getPollDetails = () => {
        var data = {
            group: groupId,
            poll: pollId
        }
        postRequest("api/v1/group_poll/poll_details", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    if (data.comments_details) {
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                    }
                    console.log('poll data', data);
                    setPoll(data);
                }
            });
    }

    // Get group detail for poll
    const getGroupDetail = (groupId) => {
        UserGroup.getGroupDetails(groupId).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    setGroup(data);
                }

            }
        );
    }

    // Calling function for fetching poll details, group detail and counter proposal detail
    useEffect(() => {
        getPollDetails();
        getGroupDetail(groupId);
        getCounterProposal();
    }, [])

    // Verify poll request
    const verifyPoll = () => {
        postRequest("api/v1/group_poll/verify_poll", { poll: pollId }).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    getPollDetails();
                    //     data.comments_details.comments = FormatComments(data.comments_details.comments);
                    // console.log('poll data', data);
                    // setPoll(data);
                }
            });
    }

    // Update Vote 
    const updateVote = (status) => {
        var data = {
            poll: pollId,
            group: groupId,
            voting_type: status
        }
        postRequest("api/v1/group_poll/poll_voting", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    getPollDetails();
                }
            });
    }

    // View Document
    const viewDocument = (item) => {
        window.open(item.file, '_blank');
    }

    // Add Comment
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
                        getPollDetails();
                        // console.log('polls data', data);
                        // data.comments_details.comments = FormatComments(data.comments_details.comments);
                        // setPoll(data);
                    }
                }

            }
        );
    }

    // Update Comment
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
                        getPollDetails();
                        // data.comments_details.comments = FormatComments(data.comments_details.comments);
                        // setPoll(data);
                    }
                }

            }
        );
    }

    // Like Comment
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
                        getPollDetails();
                        // data.comments_details.comments = FormatComments(data.comments_details.comments);
                        // setPoll(data);
                    }
                }

            }
        );
    }

    // Delete comment
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
                        getPollDetails();
                        // data.comments_details.comments = FormatComments(data.comments_details.comments);
                        // setPoll(data);
                    }
                }

            }
        );
    }

    // Delete Document
    const deleteDocument = (docId) => {
        var data = {
            poll: pollId,
            poll_doc: docId,
        }
        postRequest("api/v1/group_poll/remove_poll_doc", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    getPollDetails();
                }
            });
    }

    // Add Document
    const addDocuments = (e) => {
        console.log("Test")
        const files = Array.from(e.target.files);
        var data = new FormData();
        files.forEach((doc) => {
            data.append('poll_docs', doc, doc.file);
        })
        var obj = {
            poll: pollId
        }
        data.append('poll', pollId);
        postRequest("api/v1/group_poll/add_new_poll_docs", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    getPollDetails();
                }
            });

    }

    // Get Counter Propsal 
    const getCounterProposal = () => {
        var data = new FormData();
        data.append('poll', pollId);
        postRequest("api/v1/group_poll/get_counter_proposal", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    seteCounterProposal(data);
                }
            });
    }

    // Set Counter Proposal
    const handleOnChange = (e) => {
        console.log("Value", e.target.value);
        seteCounterProposal({ ...counterProposal, ...inputKeyValue(e) });
    };

    // Document Selection for Counter Proposal Document
    const onCounterProposalDocumentsSelect = (e) => {
        const files = Array.from(e.target.files)
        var file = files[0];
        seteCounterProposal({ ...counterProposal, file });
    }

    // Remove Document for Counter Proposal
    const removeCounterProposalDocument = () => {
        seteCounterProposal({ ...counterProposal, file: null });
    }

    // Save Counter Proposal
    const saveCounterProposal = () => {
        setCounterProposalLoading(true);
        var data = new FormData();
        data.append('file', counterProposal.file);
        data.append('proposal', counterProposal.proposal);
        data.append('poll', pollId);
        postRequest("api/v1/group_poll/add_counter_proposal", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    getPollDetails();
                    getCounterProposal();
                }
                setCounterProposalLoading(false);
            }).catch((err) => {
                setCounterProposalLoading(false);
            });
    }


    return (
        <Layout1>
            <section className=" mt-4">
                <div className="container-xl">
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <GroupChat />
                        </div>
                        {/*/Group chat col*/}

                        <div className="col-md-6">
                            <div className="card poll-details-card chat-card card-rounded overflow-hidden">
                                <div className="card-header flex-header">
                                    <h4 className="card-title fw-bolder">{poll.title}
                                        {
                                            ["Owner", "Admin", "Moderator"].includes(group.user_type) &&
                                            <Link to={`/groupdetails/${groupId}/poll/${pollId}/edit`}>
                                                <FontAwesomeIcon className="ml-2" icon={faEdit} size="lg" color="black" />
                                            </Link>
                                        }
                                    </h4>
                                    <div>
                                        <span className="poll-field" small>Created by: </span>

                                        {poll.created_by && poll.created_by.first_name}  {poll.created_by && poll.created_by.last_name}
                                    </div>
                                </div>

                                <div className="card-body overflow-hidden">
                                    <p>{poll.description}</p>
                                </div>

                            </div>

                            {
                                //(poll?.voting_status || counterProposal?.id) &&
                                (poll.discussion != "Finished") &&
                                <Loader loading={counterProposalLoading}>
                                    <div className="card poll-details-card card-rounded overflow-hidden my-4">
                                        <div className="card-header flex-header">
                                            <h4 className="card-title fw-bolder">
                                                Counter Proposal
                                    </h4>
                                        </div>
                                        <div className="card-body overflow-hidden">
                                            {
                                                counterProposal?.id ?
                                                    <div>
                                                        <p>{counterProposal?.proposal}</p>
                                                    </div>
                                                    :
                                                    <form className="form create_poll_form" id="createPollForm">
                                                        <div className="form-group">
                                                            <div className='field d-flex '>
                                                                {counterProposal?.file ?
                                                                    <div className='d-flex flex-column w-100'>
                                                                        <div className='d-flex justify-content-between align-items-center my-1'>
                                                                            <div className="mr-2" > {counterProposal?.file.name}</div>
                                                                            <FontAwesomeIcon icon={faTimes} color='red' onClick={() => { removeCounterProposalDocument() }} />
                                                                        </div>
                                                                    </div> :
                                                                    <div className=''>
                                                                        <label htmlFor='document'>
                                                                            <div>
                                                                                Add File
                                                            </div>
                                                                        </label>
                                                                        <input type='file' accept='image/*,application/pdf,application/msword' name="document" id='document'
                                                                            onChange={onCounterProposalDocumentsSelect}
                                                                            multiple="multiple"
                                                                        />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="form-group mx-2">
                                                            <Textbox
                                                                type="text"
                                                                name="proposal"
                                                                placeholder="Counter Proposal Details"
                                                                required
                                                                onChange={handleOnChange}
                                                                defaultValue={counterProposal.proposal}
                                                            // onBlur={vailadated}
                                                            />
                                                        </div>
                                                        <div className="text-center my-2 mt-4">
                                                            <Button
                                                                type="button"
                                                                className="btn btn-hover"
                                                                // disabled={!formValid}
                                                                onClick={saveCounterProposal}
                                                            >
                                                                Add
                                            </Button>
                                                        </div>
                                                    </form>

                                            }
                                        </div>
                                    </div>
                                </Loader>
                            }
                            <div className="card poll-details-card card-rounded overflow-hidden my-4">
                                <div className="card-header flex-header">
                                    <h4 className="card-title">{poll.title}</h4>
                                    {poll.accepted ?
                                        <div>
                                            <FontAwesomeIcon icon={faCheckCircle} color='#13873B' size="lg" />
                                            <p className="d-inline ml-2">Approved </p>
                                        </div> :
                                        (["Owner", "Admin", "Moderator"].includes(group.user_type) &&
                                            <p className="d-inline ml-2 cursor-pointer" onClick={verifyPoll}>Verify Poll </p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="card poll-details-card  card-rounded overflow-hidden my-4">
                                <div className="card-header flex-header">
                                    <h4 className="card-title">Details</h4>
                                </div>

                                <div className="card-body overflow-hidden">
                                    <div className="row">
                                        <div className="col-5">Created at</div>
                                        <div className="col-6">{formatDate(poll.created_at, 'DD/MM/YYYY kk:mm')}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-5">Accepted at</div>
                                        <div className="col-6">{poll.accepted_at && formatDate(poll.accepted_at, 'DD/MM/YYYY kk:mm') || "Remain to Approve"}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-5">Discussion Time</div>
                                        <div className="col-6">{formatDate(poll.end_time, 'DD/MM/YYYY kk:mm')}</div>
                                    </div>

                                    <div className="row">
                                        <div className="col-5">Group Name</div>
                                        <div className="col-6">
                                            <Link to={`/groupdetails/${group.id}`}>
                                                <div >{group.title}</div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-5">Documents</div>
                                        <div className="col-6">
                                            {
                                                poll && poll.files && poll.files.length ?
                                                    poll.files?.map((file) => (
                                                        <div className="d-flex justify-content-between align-items-center my-1 doc-view" key={file.id}>
                                                            <div key={file.file} className="text-primary"
                                                                onClick={() => { viewDocument(file) }}>{
                                                                    file && file.file &&
                                                                    file.file.slice(file.file.lastIndexOf("/") + 1, file.file.length)
                                                                }
                                                            </div>
                                                            <FontAwesomeIcon
                                                                icon={faTimes}
                                                                color='red'
                                                                className="cursor-pointer"
                                                                onClick={() => { deleteDocument(file.id) }}
                                                            />
                                                        </div>
                                                    )) :
                                                    <div>NA</div>
                                            }

                                            <div className='d-flex'>
                                                <label htmlFor='document' className="text-primary">
                                                    <div>
                                                        Add More File
                                                                    </div>
                                                </label>
                                                <input type='file' accept='image/*,application/pdf,application/msword' name="document" id='document'
                                                    onChange={addDocuments}
                                                    multiple="multiple"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {poll.accepted && group.id &&
                                <div className="card chat-list-card chat-card card-rounded overflow-hidden my-2 mb-4">
                                    <div className="card-body overflow-hidden">
                                        <div className="tab-pane fade show active" id="PollsTab">
                                            <Post poll={poll} key={poll.id}
                                                addComment={(message, pollId, replyTo) => addComment(message, poll.id, replyTo)}
                                                updateComment={(comment) => updateComment(comment)}
                                                deleteComment={(commentId) => deleteComment(commentId)}
                                                likeComment={(comment) => likeComment(comment)}
                                                readOnlyComments={poll.discussion === "Finished" ||
                                                    !(group.user_type && group.user_type !== UserTypes.Delegator)}
                                            >
                                            </Post>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                (poll && poll.id && !counterProposalLoading) &&
                                <Counterproposals poll={poll} group={group} />
                            }
                        </div>
                        <div className="col-md-3">
                            <div className="card group-chat-card chat-list-card chat-card card-rounded overflow-hidden">
                                <div className="card-header flex-header">
                                    <h4 className="card-title">Poll Status</h4>
                                </div>

                                <div className="card-body overflow-hidden">
                                    <div>
                                        <FontAwesomeIcon icon={faCheck} color='#737373' />
                                        <p className="text-turncate small mb-0 d-inline poll-field ml-1">Discussion</p>
                                        <p className="text-turncate ml-4">{poll.discussion}</p>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faCheck} color='#737373' />
                                        <p className="text-turncate small mb-0 d-inline poll-field ml-1">Voting</p>
                                        <p className="text-turncate ml-4">{poll.discussion}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout1 >
    );
}
