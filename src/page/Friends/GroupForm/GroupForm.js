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

import React, { useEffect, useState } from 'react';
import "./styles.css";
import TagsInput from 'react-tagsinput';
import { useHistory, useParams } from "react-router-dom";
import GroupChat from '../../../component/GroupChat/GroupChat';
import Layout1 from '../../../layout/Layout1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Textbox, Textarea, Radiobox, Button, Label } from "../../../component/common";
import { inputKeyValue } from "../../../utils/common";
import { postRequest } from '../../../utils/API';
import Image from '../../../component/common/Image/Image';
import { Form } from 'react-bootstrap';
import Loader from '../../../component/common/Loader/Loader';


export default function GroupForm(props) {
    //Initial values of group form
    const initialState = {
        name: "",
        description: "",
        profileImage: null,
        coverImage: null,
        tags: [],
        type: "Private",
        request: "Direct Join",
        poll_approval: 'direct_approve',
        country: "",
        city: ""
    }

    const [state, setState] = useState(initialState);
    const [editMode, setEditMode] = useState(false);
    const { name, description, tags, profileImage, coverImage, type, request, poll_approval, country, city } = state;
    let history = useHistory();
    const { groupId } = useParams();
    const [contries, setContries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Check whether form is opened for new group or for editing exist form
    // Also fetching countries
    useEffect(() => {
        if (groupId) {
            setEditMode(true);
            getGroupDetails();
        }
        countryList();
    }, [])

    // Fetching data of group for displaying exist data to edit
    const getGroupDetails = () => {
        postRequest("api/v1/user_group/get_group_details", { id: groupId }).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    if (status === 'success') {
                        setState({
                            name: data.title,
                            description: data.description,
                            tags: data.tags ? data.tags : [],
                            profileImage: data.image,
                            coverImage: data.cover_image,
                            type: data.public ? "Public" : "Private",
                            request: data.members_request == "direct_join" ? "Direct Join" : "Need Moderation",
                            poll_approval: data.poll_approval,
                            city: (data.city && data.city.id),
                            country: (data.country && data.country.id)
                        })
                        cityList(data.country.id)
                    }
                }

            }
        );
    }

    // Set input value in state
    const handleOnChange = (e) => {
        setState({ ...state, ...inputKeyValue(e) });
        console.log("State", state);
    };

    // Set tags in state
    const handleOnTagChange = (e) => {
        console.log("E:", e);
        setState({ ...state, tags: e });
        console.log("State", state);
    }

    //Remove Profile image
    const removeProfileImage = () => {
        setState({ ...state, profileImage: null });

    }

    // Add Profile image
    const onProfileImageChange = (e) => {
        const files = Array.from(e.target.files)
        var file = files[0];
        console.log("Actual File", file);
        setState({ ...state, profileImage: file });
    }

    // Remove Cover Image
    const removeCoverImage = () => {
        setState({ ...state, coverImage: null });

    }

    // Add cover Image
    const onCoverImageChange = (event) => {
        const coverFiles = Array.from(event.target.files)
        var coverFile = coverFiles[0];
        setState({ ...state, coverImage: coverFile });
    }

    // Fetch country list 
    const countryList = () => {
        !contries.length &&
            postRequest("api/v1/location/get_all_countries").then(
                (response) => {
                    console.log('response', response);
                    const { status, data } = response;
                    if (status === "success") {
                        setContries(data)

                    } else {
                        // setError();
                    }
                }
            );
    }

    // Set country 
    const handleOnCountrySelect = (e) => {
        // let selectedIndex = e.target.options.selectedIndex;
        // let countryId = e.target.options[selectedIndex].getAttribute('id');
        setState({ ...state, country: e.target.value })
        cityList(e.target.value)
    }

    // Fetch cities by country
    const cityList = (country) => {
        postRequest("api/v1/location/get_all_cities_by_country", { country: country }).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    setCities(data)
                } else {
                    // setError();
                }
            }
        );
    }

    // Select City
    const handleOnCitySelect = (e) => {
        setState({ ...state, city: e.target.value })

    }

    // Creating Group
    const handleSubmit = (e) => {
        var tag = "";
        tag = tags.join(" ");
        console.log("tag:", tag)
        var data = new FormData();
        var obj = {
            title: name,
            description: description,
            image: profileImage,
            cover_image: coverImage,
            tags: tag,
            public: type == "Public" ? true : false,
            members_request: request == "Direct Join" ? "direct_join" : "need_moderation",
            poll_approval: poll_approval,
            country: country,
            city: city
        }
        if (!obj.title) {
            alert('Title is missing.');
            return;
        }
        if (!obj.image) {
            alert('Image is missing.');
            return;
        }
        if (!obj.cover_image) {
            alert('Cover image is missing.');
            return;
        }
        setLoading(true);
        Object.keys(obj).forEach((key) => {
            data.append(key, obj[key]);
        })
        postRequest("api/v1/user_group/create_group", data).then(
            (response) => {
                setLoading(false);
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    history.push("/groups");
                } else {
                    // setError();
                }
            }
        ).catch((err) => {
            setLoading(false);
        });
    }

    // Update Group
    const updateGroup = () => {
        var tag = "";
        tag = tags.join(" ");
        console.log("tag:", tag)
        var data = new FormData();
        var obj = {
            id: groupId,
            title: name,
            description: description,
            image: profileImage,
            cover_image: coverImage,
            tags: tag,
            public: type == "Public" ? true : false,
            members_request: request == "Direct Join" ? "direct_join" : "need_moderation",
            poll_approval: poll_approval,
            country: country,
            city: city
        }
        Object.keys(obj).forEach((key) => {
            data.append(key, obj[key]);
        })
        postRequest("api/v1/user_group/update_group", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    history.push(`/groupdetails/${groupId}`);
                } else {
                    // setError();
                }
            }
        );
    }

    return (
        <Layout1>
            <section className="grupper-dashboard mt-4">
                <div className="container-xl">
                    <div className="row justify-content-center">
                        {/*/Group chat col*/}

                        {/*/Missions Featured Cards Col*/}
                        <div className="col-md-6">
                            {/* Create Group form */}
                            <Loader loading={loading}>
                                <div className="grupper-card">
                                    <div className="card group-chat-card chat-list-card chat-card card-rounded overflow-hidden">
                                        <div className="card-header flex-header">
                                            <h4 className="card-title">{groupId ? "Edit" : "Create"} {window.t("a Group")}</h4>
                                        </div>
                                        <form className="form create_group_form" id="createGroupForm">
                                            <div className="form-group mt-3 mx-2">
                                                <Textbox
                                                    type="text"
                                                    name="name"
                                                    placeholder={window.t("Group name")}
                                                    defaultValue={state.name}
                                                    value={name}
                                                    required
                                                    onChange={handleOnChange}
                                                // onBlur={vailadated}
                                                />
                                            </div>

                                            <div className="form-group mx-2">
                                                <Textarea
                                                    name="description"
                                                    rows="2"
                                                    placeholder={window.t("Group description")}
                                                    required
                                                    onChange={handleOnChange}
                                                    defaultValue={state.description}
                                                />
                                            </div>
                                            {/*<div className="form-group">    <TagsInputclassName="tags-input"       name="tags"   defaultValue={state.tags}       value={tags} onChange={handleOnTagChange} />   </div>*/}
                                            <div className="form-group field">
                                                <div>
                                                    <Label>
                                                        {window.t("Profile Photo")}
                                                    </Label>
                                                </div>
                                                <div className='buttons fadein'>
                                                    <div className="">
                                                        {
                                                            profileImage ?
                                                                <div className='fadein img-block'>
                                                                    <div
                                                                        onClick={removeProfileImage}
                                                                        className='delete'
                                                                    >
                                                                        <FontAwesomeIcon icon={faTimesCircle} size='1x'
                                                                            className="cursor-pointer" />
                                                                    </div>
                                                                    <Image
                                                                        src={profileImage}
                                                                        className="profile-image-size"
                                                                        defaultValue={''}
                                                                        required />
                                                                </div> :
                                                                <div className='button field profile-upload-size d-flex align-items-center justify-content-center'>
                                                                    <label htmlFor='profilePhoto'>
                                                                        <FontAwesomeIcon icon={faCloudUploadAlt} color='#0264c3' size='4x' />
                                                                    </label>
                                                                    <input type='file' accept='image/*' name="profilePhoto" id='profilePhoto' onChange={onProfileImageChange} />
                                                                </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group field">
                                                <div>
                                                    <Label>
                                                        {window.t("Cover Photo")}
                                                    </Label>
                                                </div>
                                                <div className='buttons fadein'>
                                                    {
                                                        coverImage ?
                                                            <div className='fadein img-block'>
                                                                <div
                                                                    onClick={removeCoverImage}
                                                                    className='delete'
                                                                >
                                                                    <FontAwesomeIcon icon={faTimesCircle} size='1x'
                                                                        className="cursor-pointer" />
                                                                </div>
                                                                <Image
                                                                    src={coverImage}
                                                                    className="cover-image-size"
                                                                    defaultValue={''}
                                                                />
                                                            </div> :
                                                            <div className='button field cover-upload-size d-flex align-items-center justify-content-center'>
                                                                <label htmlFor='coverPhoto'>
                                                                    <FontAwesomeIcon icon={faCloudUploadAlt} color='#0264c3' size='4x' />
                                                                </label>
                                                                <input type='file' accept='image/*' name="coverImage" id='coverPhoto' onChange={onCoverImageChange} required />
                                                            </div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="form-group field">
                                                <Label>
                                                    {window.t("Members request")}
                                                </Label>
                                                <div>
                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="direct"
                                                        name="request"
                                                        label={window.t("Direct Join")}
                                                        value="Direct Join"
                                                        checked={request === "Direct Join"}
                                                        onClick={handleOnChange}
                                                    />

                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="moderation"
                                                        name="request"
                                                        label={window.t("Needs Moderation")}
                                                        value="Needs Moderation"
                                                        checked={request === "Needs Moderation"}
                                                        onClick={handleOnChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-center my-5">
                                                <Button
                                                    type="button"
                                                    className="btn login-btn btn-hover"
                                                    onClick={groupId ? updateGroup : handleSubmit}
                                                >
                                                    {groupId ? "Update" : window.t("Submit")}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Loader>
                        </div>
                    </div>
                </div>
            </section>
        </Layout1>
    );
}