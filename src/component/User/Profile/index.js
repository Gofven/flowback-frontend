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

import { faEdit, faSave } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCross, faLink, faMapPin, faTimes, faUserPlus, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { render } from 'react-dom';
import { postRequest } from '../../../utils/API';
import { inputKeyValue } from '../../../utils/common';
import { getLocalStorage, setLocalStorage } from '../../../utils/localStorage';
import { Textarea, Textbox } from '../../common';
import Image from '../../common/Image';
import Loader from '../../common/Loader';
import './styles.css';
import { ConnectToMetamask, isSignedIn } from '../../Metamask/metamask';


export default function Profile(props) {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({});
    const [loggedInUser, setLoggedInUser] = useState(false)
    const [editMode, setEditMode] = useState(false);
    const [userForm, setUserForm] = useState({});
    const [loading, setLoading] = useState(false);

    const userImageFileRef = useRef(null);
    const [userImage, setUserImage] = useState();

    const userCoverImageFileRef = useRef(null);
    const [userCoverImage, setUserCoverImage] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (show) {
            setEditMode(false);
            if (props.id) {
                getOtherUserData(props.id);
            } else {
                getMyData();
            }
        } else {
            setUser(null);
            setEditMode(false);
            setUserImage(null);
        }
    }, [show, props.id])

    /**
     * Get logged in user data
     */
    const getMyData = () => {
        setLoading(true);
        postRequest("api/v1/me/get-my-data", null).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    // setGroup(data);
                    console.log("user data", data);
                    setUser(data);
                    setLoading(false);
                }

            }
        ).catch(() => {
            setLoading(false);
        });
    }

    /**
     * Get other user data by user id
     * @param {*} id 
     */
    const getOtherUserData = (id) => {
        setLoading(true);
        postRequest("api/v1/me/get-other-user", { id }).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    console.log("uesr data", data);
                    setUser(data);
                    setLoading(false);
                }

            }
        ).catch(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        if (getLocalStorage('user')) {
            try {
                setLoggedInUser(user.id === getLocalStorage('user').id);
            } catch (e) {
                setLoggedInUser(false);
            }
        }
    }, [user]);

    useEffect(() => {
        if (editMode) {
            setUserForm(user);
        } else {
            resetUserForm();
        }
    }, [editMode, user]);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    }

    const handleOnChange = (e) => {
        setUserForm({ ...userForm, ...inputKeyValue(e) });
    };

    /**
     * To update logged in user details
     */
    const updateUser = () => {
        setLoading(true);
        const data = {
            first_name: userForm.first_name,
            last_name: userForm.last_name,
            bio: userForm.bio,
            phone_number: userForm.phone_number
        }
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.set(key, data[key]);
        });
        if (userImage) {
            formData.set('image', userImage);
        }
        if (userCoverImage) {
            formData.set('cover_image', userCoverImage);
        }
        postRequest("api/v1/me/profile", formData).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    setUser(data);
                    setEditMode(false);
                    setLocalStorage('user', data);
                    setLoading(false);
                    window.location.reload();
                }
            }
        ).catch(() => {
            setLoading(false);
        });
    }

    /**
     * To change user profile image
     * @param {*} e 
     */
    const onUserImageChange = (e) => {
        const files = Array.from(e.target.files)
        var file = files[0];
        console.log("Actual File", file);
        setUserImage(file);
    }

    /**
     * To change user cover image
     * @param {*} e 
     */
    const onUserCoverImageChange = (e) => {
        const files = Array.from(e.target.files)
        var file = files[0];
        console.log("Actual File", file);
        setUserCoverImage(file);
    }

    /**
     * To reset user form
     */
    const resetUserForm = () => {
        setUserForm({});
        setUserImage(null);
        setUserCoverImage(null);
    }

    /**
     * To send friend request to other user
     */
    const friendRequest = () => {
        postRequest("api/v1/friend/send_friend_request", { user_2: user.id }).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    setUser({ ...user, friendship_status: "request" })
                }
            }
        ).catch(() => {
        });
    }

    /**
     * To accept or reject user friend request
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
                    getOtherUserData(props.id);
                }

            }
        ).catch(() => {
        });
    }

    return (
        <>
            <div className={props.className} onClick={handleShow}>
                {props.children}
            </div>

            <Modal show={show} onHide={handleClose} className={`profile-modal ${editMode ? 'edit-mode' : ''}`} centered >
                <Loader loading={loading}>
                    {user &&
                        <div className="profile-card">
                            {
                                loggedInUser &&
                                <div className='profile-actions d-flex'>
                                    {
                                        (editMode && !loading) &&
                                        <>
                                            <div className='profile-edit-icon'>
                                                <FontAwesomeIcon icon={faSave} onClick={() => updateUser()} />
                                            </div>
                                            <div className='profile-edit-icon' style={{ "marginLeft": "5%" }}>
                                                <FontAwesomeIcon icon={faTimes} onClick={() => toggleEditMode()} />
                                            </div>
                                        </>
                                    }
                                    {
                                        !editMode &&
                                        <div className='profile-edit-icon' id='1234' onClick={() => toggleEditMode()}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </div>
                                    }
                                </div>
                            }
                            <div className="profile-img-view">
                                <div className="media profile-img-content">
                                    <div>
                                        <label className={`position-relative ${editMode ? "onHoverStuff" : ""}`} htmlFor='profileDp'>
                                            {
                                                !userImage &&
                                                <div className='profile-dp-label'></div>
                                            }
                                            <Image src={userImage || user.image} className="profile-dp 2" alt="User Profile" errImg={'/img/no-photo.jpg'} />

                                        </label>
                                        {
                                            editMode &&
                                            <input type='file' accept='image/*' name="profile-dp" id='profileDp' value='' className='profile-dp-input' ref={userImageFileRef} onChange={onUserImageChange} />
                                        }
                                    </div>
                                    {/* <Image src={user.image} className="profile-dp" alt="User Profile" errImg={'/img/no-photo.jpg'} /> */}
                                    <div className="media-body title-overflow-fix">
                                        {
                                            !editMode &&
                                            <h3 className="profile-title text-truncate" >
                                                {`${user.first_name} ${user.last_name}`} {loggedInUser ? '(You)' : ""}
                                            </h3>
                                        }

                                    </div>
                                </div>
                                <div>
                                    <label htmlFor='profileCoverPhoto'>
                                        {
                                            !userCoverImage &&
                                            <div className='profile-cover-label'></div>
                                        }
                                        {/* <Image src={userImage || user.image} className="profile-dp 2" alt="User Profile" errImg={'/img/no-photo.jpg'} /> */}
                                        <Image src={userCoverImage || user.cover_image} className="profile-cover" alt='User Cover' errImg={'/img/no-banner.jpg'} />

                                    </label>
                                    {
                                        editMode &&
                                        <input type='file' accept='image/*' name="profile-cover-photo" id='profileCoverPhoto' value='' className='profile-cover-input' ref={userImageFileRef} onChange={onUserCoverImageChange} />
                                    }
                                </div>
                                {/* <Image src={user.cover_image} className="profile-cover" alt='User Cover' errImg={'/img/no-banner.jpg'} /> */}
                            </div>
                            {
                                editMode ?
                                    <div className="profile-content-view">
                                        <form className="form">
                                            <div className='d-flex mb-2'>
                                                <div className="form-group col-12 mr-2">
                                                    <Textbox
                                                        type="text"
                                                        name="first_name"
                                                        placeholder="Name"
                                                        required
                                                        maxLength="40"
                                                        value={userForm.first_name}
                                                        onChange={handleOnChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <Textarea
                                                    type="text"
                                                    name="bio"
                                                    placeholder="User Bio"
                                                    required
                                                    value={userForm.bio || ""}
                                                    maxLength="500"
                                                    onChange={handleOnChange}
                                                />
                                            </div>
                                            {/* <div className="form-group">
                                                <Textbox
                                                    type="text"
                                                    name="website"
                                                    placeholder="Website"
                                                    required
                                                    value={userForm.website || ''}
                                                    onChange={handleOnChange}
                                                />
                                            </div> */}
                                        </form>
                                    </div>
                                    :
                                    <div className="profile-content-view">
                                        <h5>About User</h5>
                                        <p>
                                            {user.bio || 'No data added yet.'}
                                        </p>
                                        <div className='my-2'>
                                            {/* <span><FontAwesomeIcon icon={faLink} size='sm' /> {' '} user?.website || 'no website added.'</span> */}
                                        </div>
                                        {/* <div>
                                            <span><FontAwesomeIcon icon={faMapPin} size='sm' /> {' '} {`Stockholm, Sweden`}</span>
                                            <span className='mx-4'><FontAwesomeIcon icon={faUserPlus} size='sm' /> {' '} {`Joined 2020 09 07`}</span>
                                        </div> */}
                                    </div>
                            }

                            {/* {loggedInUser && <div className="profile-content-view">{isSignedIn() ? "You are signed into Metamask" : "You are not signed into Metamask"}</div>} */}

                            {loggedInUser && <div className="profile-content-view">
                                <ConnectToMetamask />
                            </div>}
                        </div>
                    }
                </Loader>
            </Modal>
        </>
    )
}
