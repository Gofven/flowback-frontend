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

import React, { useState, useEffect } from "react";
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { postRequest, putRequest } from "../../../utils/API";
import Image from "../../common/Image";

export default function JoinRequests(props) {
    const [groupId, setGroupId] = useState(props.groupId);
    const [joinRequests, setJoinRequests] = useState([]);
    const [totalJoinRequests, setTotalJoinRequests] = useState(0);
    const status = [
        "accepted",
        "rejected"]

    /**
     * To get pending join requests for logged in user
     */
    const getJoinRequests = () => {
        postRequest("api/v1/user_group/get_group_join_requests", { group: groupId }).then(
            (response) => {
                if (response) {
                    const { status, data } = response;
                    setJoinRequests(data.requests);
                    setTotalJoinRequests(data.total_requests);
                }

            }
        );
    }

    /**
     * To update join requests when accept or reject button is clicked
     * @param {*} status 
     * @param {*} participant 
     */
    const updateRequest = (status, participant) => {
        let data = {
            group: groupId,
            participant: participant,
            status: status
        }
        putRequest("api/v1/user_group/accept_reject_group_request", data).then(
            (response) => {
                if (response) {
                    const { status, data } = response;
                    if (status === "success") {
                        getJoinRequests();
                    }
                }

            }
        );
    }

    useEffect(() => {
        getJoinRequests()
    }, [])
    return (
        <div>
            {
                <div>
                    <div className="mb-2">
                        {totalJoinRequests} Pending
                    </div>
                    {
                        joinRequests?.map((request, index) => (
                            <div className="media member-block">
                                <Image src={request.participant.image} className="media-img" errImg='/img/no-photo.jpg' />
                                <div className="media-body">
                                    <p className="text-turncate mb-0">{request.participant.first_name} {request.participant.last_name}</p>
                                </div>
                                <FontAwesomeIcon className="cursor-pointer"
                                    icon={faCheckCircle} size='lg' color='#069035' onClick={() => { updateRequest(status[0], request.participant.id) }} />
                                <div>&nbsp;&nbsp;</div>
                                <FontAwesomeIcon className="cursor-pointer"
                                    icon={faTimesCircle} size='lg' color='#DD4A4C' onClick={() => { updateRequest(status[1], request.participant.id) }} />
                            </div>
                        ))
                    }
                </div>
            }
        </div>

    );
}
