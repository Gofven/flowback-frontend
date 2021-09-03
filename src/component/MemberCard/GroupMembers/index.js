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
import { postRequest } from "../../../utils/API";
import { Dropdown } from "react-bootstrap"
import Image from "../../common/Image";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './styles.css';


export default function GroupMembers(props) {
    const [groupId, setGroupId] = useState(props.groupId);
    const [userType, setUserType] = useState(props.userType);
    const [members, setMembers] = useState([]);
    const [totalMembers, setTotalMemebers] = useState(0);

    const [chosenDelegateId, setChosenDelegateId] = useState(null);

    /**
     * To get all group memebers
     */
    const getGroupMembers = () => {
        postRequest("api/v1/user_group/group_participants", { id: groupId }).then(
            (response) => {
                if (response) {
                    const { status, data } = response;
                    setMembers(data.participant);
                    setTotalMemebers(data.total_participant);

                }

            }
        );
    }

    useEffect(() => {
        getAndSetDelegator({group_id:groupId});
        getGroupMembers();
    }, [])

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
    const getAndSetDelegator = (data)=> postRequest("api/v1/group_poll/get_user_delegator", data).then(
        (response) => {
            if(response.status === "success"){
                setChosenDelegateId(response.data.delegator_id);
            }
            return response;
        }
    );

    const setDelegator = (data)=> postRequest("api/v1/group_poll/delegate", data).then(
        (response) => {
            if (response.status === "success") {
                getAndSetDelegator({group_id:groupId});
            }
            return response;
        }
    );

    const removeDelegator = (data)=> postRequest("api/v1/group_poll/remove_delegate", data).then(
        (response) => {
            if (response.status === "success") {
                setChosenDelegateId(null);
            }
            return response;
        }
    );

    const SetDelegateButton = ({groupId, userId}) => <a
                                    href="#"
                                    className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightgreen"
                                    onClick={() => setDelegator({group_id:groupId*1, delegator_id:userId*1})}
                                >Select as delegate</a>;

    const DeselectDelegateButton = () => {
        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
      
        return (
          <>
            <Button variant="primary" onClick={handleShow} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white">
              Deselect as delegate
            </Button>
      
            <Modal show={show} onHide={handleClose} enforceFocus={false} autoFocus={true}>
              <Modal.Header closeButton>
                <Modal.Title>Delegate voting options</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Button variant="primary" onClick={()=> {
                    removeDelegator({group_id:groupId*1,keep_delegator_votes:true});
                    handleClose();
                    }} className="btn btn-sm btn-block btn-outline-secondary temp-spacing temp-btn-color-lightcoral temp-btn-bg-white">
                Keep delegate votes
                </Button>
                <Button variant="primary" onClick={()=> {
                    removeDelegator({group_id:groupId*1,keep_delegator_votes:false});
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
        <div>
            <div className="mb-2">
                {totalMembers} Members
            </div>
            {
                members?.map((member, index) => (
                    <div className="media member-block" key={index}>
                        <Image src={member.image} className="media-img" errImg='/img/no-photo.jpg' />
                        <div className="media-body">
                            <p className="text-turncate mb-0">{member.first_name} {member.last_name}</p>
                        </div>
                        <div className="menu d-flex align-items-center">
                        {(userType != "Delegator" && member.user_type == "Delegator" && chosenDelegateId == null) ? <SetDelegateButton groupId={groupId} userId={member.id}/> : null}
                        {chosenDelegateId == member.id ? <DeselectDelegateButton/> :null}
                            <span className="mr-1"> {member.user_type} </span>
                            {(["Owner", "Admin"].includes(props.userType) && member.user_type != "Owner") ?
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
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    );
}