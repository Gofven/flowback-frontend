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

import React, { useState, useEffect } from "react";
import { postRequest, getRequest } from "../../../utils/API";
import { Dropdown } from "react-bootstrap"
import Image from "../../common/Image";
import Modal from 'react-bootstrap/Modal';
import a from 'react-bootstrap/Button';
import './styles.css';
import Loader from '../../common/Loader';
import { SearchFilter, DropDownFilterGroup } from "../../common/Filter";


export default function GroupMembers(props) {
    const [groupId, setGroupId] = useState(props.groupId);
    const [userType, setUserType] = useState(props.userType);
    const [members, setMembers] = useState([]);
    const [totalMembers, setTotalMemebers] = useState(0);
    const [canMemberVote, setCanMemberVote] = useState([]);
    const [status, setStatus] = useState({ text: "", color: "black" });
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [chosenDelegateId, setChosenDelegateId] = useState(null);
    const [filter, setFilter] = useState({ search: "", typeOfMember: null })
    /**
     * To get all group memebers
     */
    const getGroupMembers = () => {
        setLoading(true)
        postRequest("api/v1/user_group/group_participants", { id: groupId }).then(
            (response) => {
                if (response) {
                    const { status, data } = response;
                    setMembers(data.participant);
                    setTotalMemebers(data.total_participant);

                }
                setLoading(false)
            }
        );
    }

    useEffect(() => {
        getAndSetDelegator({ group_id: groupId });
        getGroupMembers();

        getVotingRights();
        // postVotingRights();
    }, [groupId])

    /**
     * To change member type in a group
     * @param {*} member 
     * @param {*} newType 
     */
    const changeMemberType = (member, newType) => {
        const data = {
            user_id: member.id,
            group_id: groupId,
            old_user_type: member.user_type,
            new_user_type: newType
        }
        postRequest("api/v1/user_group/update_group_member_type", data).then(
            (response) => {
                if (response) {
                    const { status, data } = response;
                    getGroupMembers();
                }

            }
        );
    }

    // Delagator functions
    const getAndSetDelegator = (data) => postRequest("api/v1/group_poll/get_user_delegator", data).then(
        (response) => {
            if (response.status === "success") {
                setChosenDelegateId(response.data.delegator_id);
            }
            return response;
        }
    );

    const setDelegator = (data) => postRequest("api/v1/group_poll/delegate", data).then(
        (response) => {
            if (response.status === "success") {
                getAndSetDelegator({ group_id: groupId });
            }
            return response;
        }
    );

    const removeDelegator = (data) => postRequest("api/v1/group_poll/remove_delegate", data).then(
        (response) => {
            if (response.status === "success") {
                setChosenDelegateId(null);
            }
            return response;
        }
    );

    const SetDelegateButton = ({ groupId, userId, disabled }) => <a
        href="#"
        className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightgreen"
        disabled={disabled}
        onClick={() => setDelegator({ group_id: groupId * 1, delegator_id: userId * 1 })}
    >Select</a>;

    const SetBecomeDelegateButton = ({ groupId, userId, disabled }) => <a
        href="#"
        className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-info"
        disabled={disabled}
        onClick={handleShow}
    >Become Delegate</a>;


    const BecomeDelegateModal = () => {
        const [hasAccepted, setHasAccepted] = useState(true)

        const handleAccept = () => setHasAccepted(!hasAccepted)

        return <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Varning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Being a delegate means that members can select you as a delegate and copy your voting in every poll of the group, unless they alter the proposals in that particular poll.</p>
                <p>If you agree to becoming a delegate everyone will be able to see what you vote in every poll of this group, and you can no longer leave the group or become a regular member. <b>This decision is irreversible</b>.</p>
                <div className="delegateModalAccept"><input type="checkbox" className="acceptDelegate" onChange={handleAccept} />
                    <div>I understand that this is irreversible and that I must ask system admin to remove my delegate role
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button variant="secondary" className="btn btn-outline-active" onClick={handleClose}>
                    Close
                </button>
                <button variant="primary" className="btn btn-outline-danger" disabled={hasAccepted} onClick={handleOnBecomeDelegate}>
                    Become Delegate
                </button>
            </Modal.Footer>
        </Modal >
    }

    const handleOnBecomeDelegate = () => {
        handleClose();
        postRequest(`api/v1/user_group/${groupId}/leave_group`).then(
            (response) => {
                postRequest("api/v1/user_group/join_group", { group: groupId, as_delegator: true }).then(
                    (response) => {
                        if (response) {
                            setUserType("Delegator")
                        }
                    }).catch(e => console.error(e));

            }).catch(e => console.error(e));
    }


    const getVotingRights = () => {

        getRequest(`api/v1/user_group/${props.groupId}/group_members_get`).then(response => {
            console.log(response, "REPONSE VOTING RIGHTS");
            setCanMemberVote(response)
            setLoading(false);
        })
    }

    const postVotingRights = (memberId, allowVote) => {
        setLoading(true)
        console.log(canMemberVote)
        postRequest(`api/v1/user_group/${props.groupId}/group_member_update`, { target: memberId, allow_vote: allowVote }).then(response => {
            console.log(response, "REPONSE");
            console.log(canMemberVote)
            if (response.detail === "You do not have permission to perform this action.") {
                setStatus({ text: "You don't have permission to change users voting rights", color: "red" });
            }
            setStatus({ text: "Successfully changed voting rights", color: "green" });
            getVotingRights();
        })
    }

    const handleChangeVotingRight = (memberId, index) => {
        const members = canMemberVote;
        const member = members.find(member => member.user === memberId);
        const newVoteRight = !members[members.indexOf(member)].allow_vote;
        members[members.indexOf(member)].allow_vote = newVoteRight;
        setCanMemberVote(members);
        postVotingRights(memberId, newVoteRight);
    }

    const DeselectDelegateButton = () => {
        const [show1, setShow1] = useState(false);

        const handleClose = () => setShow1(false);
        const handleShow = () => setShow1(true);

        return (
            <>
                <a variant="primary" onClick={handleShow} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white deselect-btn">
                    Deselect
                </a>

                <Modal show={show1} onHide={handleClose} enforceFocus={false} autoFocus={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delegate voting options</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <a variant="primary" onClick={() => {
                            removeDelegator({ group_id: groupId * 1, keep_delegator_votes: true });
                            handleClose();
                        }} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white">
                            Keep delegate votes
                        </a>
                        <a variant="primary" onClick={() => {
                            removeDelegator({ group_id: groupId * 1, keep_delegator_votes: false });
                            handleClose();
                        }} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white">
                            Remove delegate votes
                        </a>
                    </Modal.Body>
                </Modal>
            </>
        );
    }

    console.log(members)

    return (
        <Loader loading={loading}>
            <BecomeDelegateModal />

            <SearchFilter setFilter={setFilter} filter={filter} />
            <DropDownFilterGroup setFilter={setFilter} filter={filter} />

            <div style={{ "color": status.color }}>{status.text}</div>
            <div className="mb-2 titles">
                <div>{totalMembers} Members</div>
                <div>Voting Rights</div>
                <div>Admin</div>
                <div>Select as Delegate</div>
            </div>
            {
                members?.map((member, index) => (
                    member.first_name?.toUpperCase().includes(filter.search.toUpperCase()) &&
                    (member.user_type === filter.typeOfMember || filter.typeOfMember === null) &&
                    < div className="titles media member-block" key={index} >
                        <div className="user-block">
                            <Image src={member.image} className="media-img" errImg='/img/no-photo.jpg' />
                            <div>
                                <p className="text-turncate mb-0">{member.first_name} {member.last_name}</p>
                            </div>
                        </div>
                        <div>
                            <input type="checkbox" checked={canMemberVote.find(m => m.user === member.id)?.allow_vote || false}
                                onChange={() => handleChangeVotingRight(member.id, index)}
                                disabled={(["Owner", "Admin"].includes(props.userType)) ? false : true}></input>
                        </div>
                        <div>
                            {member.user_type === "Owner" ? "YES" : "NO"}
                        </div>
                        <div>
                            {/* <div className="menu d-flex align-items-center"> */}
                            {chosenDelegateId === member.id ? <DeselectDelegateButton />
                                : (userType != "Delegator" && member.user_type === "Delegator" && chosenDelegateId === null && JSON.parse(window.localStorage.user).id !== member.id) &&
                                <SetDelegateButton groupId={groupId} userId={member.id} disabled={false} />}
                            {/* <span className="mr-1"> {member.user_type === "Delegator" ? "Delegate" : "Member"} </span> */}
                            {/* </div> */}
                            {JSON.parse(window.localStorage.user).id === member.id && userType !== "Delegator" && member.user_type !== "Owner" && <SetBecomeDelegateButton groupId={groupId} userId={member.id} disabled={false} />}
                            {JSON.parse(window.localStorage.user).id === member.id && userType === "Delegator" && <div>You are a delegator  </div>}
                            {(member.user_type === "Owner" || member.user_type === "Admin") && <div>Admin can't be delegator</div>}
                        </div>
                    </div>
                ))
            }
        </Loader >
    );
}