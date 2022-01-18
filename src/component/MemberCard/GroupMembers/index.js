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
import Button from 'react-bootstrap/Button';
import './styles.css';
import Loader from '../../common/Loader';


export default function GroupMembers(props) {
    const [groupId, setGroupId] = useState(props.groupId);
    const [userType, setUserType] = useState(props.userType);
    const [members, setMembers] = useState([]);
    const [totalMembers, setTotalMemebers] = useState(0);
    const [canMemberVote, setCanMemberVote] = useState([]);
    const [status, setStatus] = useState({text:"", color:"black"});
    const [loading, setLoading] = useState(false);

    const [chosenDelegateId, setChosenDelegateId] = useState(null);

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

    const SetDelegateButton = ({ groupId, userId, disabled }) => <Button
        href="#"
        className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightgreen"
        disabled={disabled}
        onClick={() => setDelegator({ group_id: groupId * 1, delegator_id: userId * 1 })}
    >Select</Button>;

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
                setStatus({text: "You don't have permission to change users voting rights", color:"red"});
            }
            setStatus({text:"Successfully changed vote", color:"green"});
            getVotingRights();
        })
    }

    const handleChangeVotingRight = (memberId, index) =>{
        const members = canMemberVote;
        members[index].allow_vote = !members[index].allow_vote;
        setCanMemberVote(members)
        postVotingRights(memberId, members[index].allow_vote);
    }

    const DeselectDelegateButton = () => {
        const [show, setShow] = useState(false);
        
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        
        return (
            <>
                <Button variant="primary" onClick={handleShow} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white deselect-btn">
                    Deselect
                </Button>

                <Modal show={show} onHide={handleClose} enforceFocus={false} autoFocus={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delegate voting options</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant="primary" onClick={() => {
                            removeDelegator({ group_id: groupId * 1, keep_delegator_votes: true });
                            handleClose();
                        }} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white">
                            Keep delegate votes
                        </Button>
                        <Button variant="primary" onClick={() => {
                            removeDelegator({ group_id: groupId * 1, keep_delegator_votes: false });
                            handleClose();
                        }} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white">
                            Remove delegate votes
                        </Button>
                    </Modal.Body>
                </Modal>
            </>
        );
    }



    return (
        <Loader loading={loading}>
            <div style={{"color":status.color}}>{status.text}</div>
            <div className="mb-2 titles">
                <div>{totalMembers} Members</div>
                <div>Voting Rights</div>
                <div>Admin</div> 
                <div>Select as Delegate</div>
            </div>
            {
                members?.map((member, index) => (
                    <div className="titles media member-block" key={index}>
                        <div className="user-block">
                            <Image src={member.image} className="media-img" errImg='/img/no-photo.jpg' />
                            <div>
                                <p className="text-turncate mb-0">{member.first_name} {member.last_name}</p>
                            </div>
                        </div>
                        <div>
                            <input type="checkbox" checked={canMemberVote[index]?.allow_vote || false} 
                            onChange={() => handleChangeVotingRight(member.id, index)} 
                            disabled={(["Owner", "Admin"].includes(props.userType)) ? false : true}></input>
                        </div>
                        <div>NO</div>
                        <div >
                            {/* <div className="menu d-flex align-items-center"> */}
                                {chosenDelegateId == member.id ? <DeselectDelegateButton /> : <SetDelegateButton groupId={groupId} userId={member.id} disabled={(userType === "Delegator" || member.user_type != "Delegator" || chosenDelegateId != null)} />}
                                {/* <span className="mr-1"> {member.user_type === "Delegator" ? "Delegate" : "Member"} </span> */}
                            {/* </div> */}
                        </div>
                            {/* {(["Owner", "Admin"].includes(props.userType) && member.user_type != "Owner") ?
                                <Dropdown>
                                    <Dropdown.Toggle variant="white" id="dropdown-basic">
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {["Admin", "Moderator", "Member", "Delegator"].map((type) => {
                                            return (member.user_type != type) ?
                                                <Dropdown.Item className="cursor-pointer" onClick={() => changeMemberType(member, type)}>
                                                    <img src={`/img/${type}.svg`} className="svg-icon mr-2" />
                                                    Make {type}</Dropdown.Item>
                                                : null
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown> :
                                null
                            } */}
                    </div>
                ))
            }
        </Loader>
    );
}