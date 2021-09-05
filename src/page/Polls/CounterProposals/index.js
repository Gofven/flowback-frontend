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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { postRequest } from '../../../utils/API';
import CounterProposal from './CounterProposal';
import { faSort, faArrowsAltV, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { FormatComments } from '../../../utils/common';
import SortCounterProposal from './SortCounterProposal';
import './styles.css';
import { UserTypes } from '../../../constants/constants';

function Counterproposals({ poll, group }) {

    const [counterProposals, setCounterProposals] = useState([]);
    const [proposalIndexes, setProposalIndexes] = useState(null);

    useEffect(() => {
        getCounterProposals();
    }, [])

    /**
     * To get counter proposals
     */
    const getCounterProposals = () => {
        var data = new FormData();
        data.append('poll', poll.id);
        postRequest("api/v1/group_poll/get_all_counter_proposal", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    if (data && data.counter_proposals) {
                        data.counter_proposals.forEach((counterProposal) => {
                            counterProposal.comments_details.comments = FormatComments(counterProposal.comments_details.comments);
                        })
                        setCounterProposals(data.counter_proposals);
                    }
                    if (data && data.proposal_indexes) {
                        setProposalIndexes(data.proposal_indexes);
                    }
                }
            });
    }

    /**
     * To add comment in counter proposal
     * @param {*} message 
     * @param {*} counterProposalId 
     * @param {*} replyTo 
     */
    const addComment = (message, counterProposalId, replyTo) => {
        var data = {
            counter_proposal: counterProposalId,
            comment: message
        }
        if (replyTo) {
            data.reply_to = replyTo;
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/create_counter_proposal_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('counterproposalsdup data', data);
                        let counterProposalsDup = counterProposals.slice();
                        const index = counterProposalsDup.findIndex((counterProposal) => counterProposal.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        counterProposalsDup.splice(index, 1, data);
                        setCounterProposals(counterProposalsDup);
                        // counterproposalsdup?.map((poll, index) => {
                        //     if (poll.id == data.id) {
                        //         counterProposalsDup.splice(index, 1, data);
                        //         setCounterProposals([...counterProposalsDup]);
                        //     }
                        // })
                    }
                }

            }
        );
    }

    /**
     * To update a comment
     */
    const updateComment = (comment) => {
        var data = {
            comment_id: comment.id,
            comment: comment.comment
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/edit_counter_proposal_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('counterproposalsdup data', data);
                        let counterProposalsDup = counterProposals.slice();
                        const index = counterProposalsDup.findIndex((poll) => poll.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        counterProposalsDup.splice(index, 1, data);
                        setCounterProposals(counterProposalsDup);
                    }
                }

            }
        );
    }

    /**
     * To like a comment
     * @param {*} comment 
     */
    const likeComment = (comment) => {
        var data = {
            counter_proposal_comment: comment.id,
            like: !comment.liked
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/like_dislike_counter_proposal_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('counterproposalsdup data', data);
                        let counterProposalsDup = counterProposals.slice();
                        const index = counterProposalsDup.findIndex((poll) => poll.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        counterProposalsDup.splice(index, 1, data);
                        setCounterProposals(counterProposalsDup);
                    }
                }

            }
        );
    }

    /**
     * To delete a comment
     * @param {*} commentId 
     */
    const deleteComment = (commentId) => {
        var data = {
            comment: commentId
        }
        console.log("data:", data)
        postRequest("api/v1/group_poll/delete_counter_proposal_comment", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status == "success") {
                        console.log('counterproposalsdup data', data);
                        let counterProposalsDup = counterProposals.slice();
                        const index = counterProposalsDup.findIndex((counterProposal) => counterProposal.id === data.id);
                        data.comments_details.comments = FormatComments(data.comments_details.comments);
                        counterProposalsDup.splice(index, 1, data);
                        setCounterProposals(counterProposalsDup);
                    }
                }

            }
        );
    }

    const onUpdateIndexes = (reload) => {
        if (reload) {
            getCounterProposals();
        }
    }

    return (
        <div>
            <div className="card poll-details-card card-rounded overflow-hidden my-4">
                <div className="card-header flex-header d-flex justify-content-between">
                    <h4 className="card-title fw-bolder">Proposals</h4>
                    {
                        (counterProposals?.length && poll?.discussion !== 'Finished' && group && group.user_type) ?
                            <SortCounterProposal pollId={poll.id} counterProposals={counterProposals} proposalIndexes={proposalIndexes} onUpdateIndexes={onUpdateIndexes}>
                                <FontAwesomeIcon icon={faArrowsAltV} color="black" />
                                {/* testing */}
                            </SortCounterProposal>
                            : null
                    }
                </div>
                <div className="card-body overflow-hidden">
                    {
                        !counterProposals?.length ?
                            <div className='text-center'>No counter proposals are available.</div>
                            : null
                    }
                    {counterProposals?.map((counterProposal, index) => (
                        <CounterProposal counterProposal={counterProposal} key={counterProposal.id}
                            addComment={(message, pollId, replyTo) => addComment(message, counterProposal.id, replyTo)}
                            updateComment={(comment) => updateComment(comment)}
                            deleteComment={(commentId) => deleteComment(commentId)}
                            likeComment={(comment) => likeComment(comment)}
                            readOnlyComments={poll.discussion === "Finished" || !(group && group.user_type && group.user_type !== UserTypes.Delegator)}
                        >
                            <>
                                <div className='d-flex'>
                                    <FontAwesomeIcon className='counter-proposal-file' icon={faFileAlt} />
                                    <p className="post-text">
                                        {counterProposal.proposal}
                                    </p>
                                </div>
                                <div className="post-img-wrapper">
                                </div>
                            </>
                        </CounterProposal>
                    ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Counterproposals;