import { postRequest } from "../../../utils/API";
import React, { useState, useEffect } from "react";

export default function GroupButtons({ item }) {
    const [isMember, setIsMember] = useState(item.user_type)

    // Join group request as a member
    const handleOnJoinGroupAsAMember = (item) => {
        postRequest("api/v1/user_group/join_group", { group: item.id, }).then(
            (response) => {
                if (response) {
                    setIsMember(true)
                    const { status, data } = response;
                    // getGroups();
                }
            });
    }

    const handleOnLeaveGroup = (groupId) => {
        postRequest(`api/v1/user_group/${groupId}/leave_group`).then(
            (response) => {
                if (response) {
                    setIsMember(false)
                    const { status, data } = response;
                    // getGroups();
                }
            });
    }

    // Join group request as a delegate
    const handleOnJoinGroupAsADelegate = (item) => {
        postRequest("api/v1/user_group/join_group", { group: item.id, as_delegator: true }).then(
            (response) => {
                if (response) {
                    const { status, data } = response;
                    // getGroups();
                }
            });
    }

    return <div className="grupper-btn-view">
        {
            isMember ?
                <h4>
                    <div className="flex-row">
                        <a
                            className="btn btn-sm btn-block btn-outline-secondary btn-outline-danger"
                            onClick={() => { handleOnLeaveGroup(item.id) }}
                        >Leave Group</a>
                    </div>
                </h4> :
                (
                    (item.group_join_status == "Requested") ?
                        <a
                            href="#"
                            className="btn btn-sm btn-block btn-outline-secondary"
                        >
                            {item.group_join_status}
                        </a> :
                        <div className="flex-row">
                            <a
                                className="btn btn-sm btn-block btn-outline-secondary"
                                onClick={() => { handleOnJoinGroupAsAMember(item) }}
                            >Join Group</a>
                        </div>
                )
        }
    </div>
}