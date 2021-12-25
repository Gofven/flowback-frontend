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
import { postRequest } from "../../../../utils/API";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import Image from "../../../common/Image";


export default function FriendRequests() {
    const [lastRequestSentAt, setlastRequestSentAt] = useState();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);

    const [requests, setRequests] = useState([]);


    /**
     * To get all friend requests
     * @param {*} firstPage 
     */
    const friendRequests = (firstPage) => {

        const data = {
            first_page: firstPage,
            page: page,
            page_size: pageSize,
            last_request_sent_at: lastRequestSentAt
        }
        postRequest("api/v1/friend/get_all_friend_request", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    setRequests(response.data?.data);
                }

            }
        ).catch(() => {
        });
    }

    useEffect(() => {
        friendRequests(true)
    }, [])

    /**
     * To accept or reject friend request
     * @param {*} id 
     * @param {*} request 
     */
    const acceptRejectRequest = (id, request) => {
        const data = {
            friend_id: id,
            accept_or_reject: request
        }

        postRequest("api/v1/friend/accept_reject_friend_request", data).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    setRequests(response?.data?.data);
                }

            }
        ).catch(() => {
        });
    }

    return (
        <>
            {
                requests?.map((request, index) => (
                    <div className="media member-block" key={index}>
                        <Image src={request?.user_1?.image} className="media-img" errImg='/img/no-photo.jpg' />
                        <div className="media-body">
                            <p className="text-turncate mb-0">{request?.user_1?.first_page} {request?.user_1?.last_name}</p>
                        </div>
                        <FontAwesomeIcon className="cursor-pointer"
                            icon={faCheckCircle} size='lg' color='#069035' onClick={() => { acceptRejectRequest(request?.user_1?.id, "accept") }} />
                        <div>&nbsp;&nbsp;</div>
                        <FontAwesomeIcon className="cursor-pointer"
                            icon={faTimesCircle} size='lg' color='#DD4A4C' onClick={() => { acceptRejectRequest(request?.user_1?.id, "reject") }} />
                    </div>
                ))
            }
        </>
    );
}
