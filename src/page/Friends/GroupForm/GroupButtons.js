import { postRequest } from "../../../utils/API";
import React, { useState, useEffect } from "react";

export default function GroupButtons({ user_type, groupId, groupJoinStatus }) {
    const [isMember, setIsMember] = useState(user_type)

    // Join group request as a member
    const handleOnJoinGroupAsAMember = () => {
        postRequest("api/v1/user_group/join_group", { group: groupId, }).then(
            (response) => {
                if (response) {
                    setIsMember(true)
                    const { status, data } = response;
                    // getGroups();
                }
            });
    }

    const handleOnLeaveGroup = () => {
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
    const handleOnJoinGroupAsADelegate = () => {
        postRequest("api/v1/user_group/join_group", { group: groupId, as_delegator: true }).then(
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
                            onClick={() => { handleOnLeaveGroup() }}
                        >Leave Group</a>
                    </div>
                </h4> :
                (
                    (groupJoinStatus == "Requested") ?
                        <a
                            href="#"
                            className="btn btn-sm btn-block btn-outline-secondary"
                        >
                            {groupJoinStatus}
                        </a> :
                        <div className="flex-row">
                            <a
                                className="btn btn-sm btn-block btn-outline-secondary"
                                onClick={() => { handleOnJoinGroupAsAMember() }}
                            >Join Group</a>
                        </div>
                )
        }
    </div>
}