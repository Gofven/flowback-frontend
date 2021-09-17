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

import React, { useEffect, useState } from 'react';
import "./styles.css";
import TagsInput from 'react-tagsinput';
import { useHistory, useParams } from "react-router-dom";
import GroupChat from '../../../component/GroupChat';
import Layout1 from '../../../layout/Layout1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Textbox, Textarea, Radiobox, Button, Label } from "../../../component/common";
import { inputKeyValue } from "../../../utils/common";
import { postRequest } from '../../../utils/API';
import Image from '../../../component/common/Image';
import { Form } from 'react-bootstrap';
import Loader from '../../../component/common/Loader';


export default function GroupForm(props) {
    //Initial values of group form
    const initialState = {
        name: "",
        description: "",
        profileImage: null,
        coverImage: null,
        tags: [],
        type: "Public",
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
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <GroupChat />
                        </div>
                        {/*/Group chat col*/}

                        {/*/Missions Featured Cards Col*/}
                        <div className="col-md-6">
                            {/* Create Group form */}
                            <Loader loading={loading}>
                                <div className="grupper-card">
                                    <div className="card group-chat-card chat-list-card chat-card card-rounded overflow-hidden">
                                        <div className="card-header flex-header">
                                            <h4 className="card-title">{groupId ? "Edit" : "Create"} a Group</h4>
                                        </div>
                                        <form className="form create_group_form" id="createGroupForm">
                                            <div className="form-group mt-3 mx-2">
                                                <Textbox
                                                    type="text"
                                                    name="name"
                                                    placeholder="Group name"
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
                                                    placeholder="Group description"
                                                    required
                                                    onChange={handleOnChange}
                                                    defaultValue={state.description}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <TagsInput
                                                    className="tags-input"
                                                    name="tags"
                                                    defaultValue={state.tags}
                                                    value={tags} onChange={handleOnTagChange} />
                                            </div>
                                            <div className="form-group field">
                                                <div>
                                                    <Label>
                                                        Profile Photo
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
                                                                        defaultValue={state.profileImage}
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
                                                        Cover Photo
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
                                                                    defaultValue={state.coverImage}


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
                                                    Group type
                         </Label>
                                                <div>
                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="public"
                                                        name="type"
                                                        label="Public"
                                                        value="Public"
                                                        checked={type === "Public"}
                                                        onClick={handleOnChange}
                                                    />
                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="private"
                                                        name="type"
                                                        label="Private"
                                                        value="Private"
                                                        checked={type === "Private"}
                                                        onClick={handleOnChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group field">
                                                <Label>
                                                    Members request
                          </Label>
                                                <div>
                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="direct"
                                                        name="request"
                                                        label="Direct Join"
                                                        value="Direct Join"
                                                        checked={request === "Direct Join"}
                                                        onClick={handleOnChange}
                                                    />

                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="moderation"
                                                        name="request"
                                                        label="Needs Moderation"
                                                        value="Needs Moderation"
                                                        checked={request === "Needs Moderation"}
                                                        onClick={handleOnChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group field">
                                                <Label>
                                                    Poll approval
                          </Label>
                                                <div>
                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="poll_approval_direct_approve"
                                                        name="poll_approval"
                                                        label="Direct Approve"
                                                        value="direct_approve"
                                                        checked={poll_approval === "direct_approve"}
                                                        onClick={handleOnChange}
                                                    />

                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        id="poll_approval_need_moderation"
                                                        name="poll_approval"
                                                        label="Needs Moderation"
                                                        value="need_moderation"
                                                        checked={poll_approval === "need_moderation"}
                                                        onClick={handleOnChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group field">
                                                <Label>
                                                    Location
                          </Label>
                                                <div>
                                                    <Form.Group>

                                                        <Form.Control as="select"
                                                            onChange={handleOnCountrySelect}
                                                            placeholder="Country"
                                                        >
                                                            <option disabled selected>Select a Country</option>
                                                            {
                                                                contries?.map((countryDetail) => (
                                                                    <option value={countryDetail.id} key={countryDetail.id}
                                                                        id={countryDetail.id}
                                                                        selected={countryDetail.id === country}
                                                                    >{countryDetail.country_name}</option>
                                                                ))
                                                            }
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group>
                                                        <Form.Control as="select"
                                                            onChange={handleOnCitySelect}
                                                            disabled={!state?.country}
                                                        >
                                                            <option disabled selected>Select a City</option>
                                                            {
                                                                cities?.map((cityDetail) => (
                                                                    <option value={cityDetail.id} key={cityDetail.id}
                                                                        id={cityDetail.id}
                                                                        selected={cityDetail.id === city}
                                                                    >{cityDetail.city_name}</option>
                                                                ))
                                                            }
                                                        </Form.Control>
                                                    </Form.Group>

                                                </div>
                                            </div>

                                            <div className="text-center my-5">
                                                <Button
                                                    type="button"
                                                    className="btn login-btn btn-hover"
                                                    // disabled={!formValid}
                                                    onClick={groupId ? updateGroup : handleSubmit}
                                                >
                                                    {groupId ? "Update" : "Submit"}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Loader>
                        </div>
                        {/*/Missions Featured Cards Col*/}

                        {/*Short-by, Filter-by & Supported Col*/}
                        <div className="col-md-3">
                            {/*Short-by Card*/}
                            <div className="card short-by-card chat-list-card chat-card card-rounded overflow-hidden">
                                <div className="card-header pb-0 border-bottom-0">
                                    <h4 className="card-title">Short by</h4>
                                </div>
                                <div className="card-body overflow-hidden">
                                    <div className="pre-scrollable">
                                        <ul
                                            className="active-vertical-nav nav nav-pills"
                                            id="pills-tab"
                                        >
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link short-by-link active"
                                                    href="#"
                                                    data-bs-toggle="pill"
                                                >
                                                    New
                        </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link short-by-link"
                                                    href="#"
                                                    data-bs-toggle="pill"
                                                >
                                                    Popular
                        </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link short-by-link"
                                                    href="#"
                                                    data-bs-toggle="pill"
                                                >
                                                    Rising
                        </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/*/Short-by Card*/}

                            {/*Filter-by Card*/}
                            <div className="card filter-by-card mt-4 chat-list-card chat-card card-rounded overflow-hidden">
                                <div className="card-header pb-0 border-bottom-0">
                                    <h4 className="card-title">Filter by</h4>
                                </div>
                                <div className="card-body overflow-hidden">
                                    <form className="form filter-form" action="#">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                id="MyGroupsOnly"
                                            />
                                            <label className="form-check-label" for="MyGroupsOnly">
                                                My Groups only
                      </label>
                                        </div>
                                        <div className="location-group">
                                            <h5 className="shrtby-intitle">Location</h5>
                                            <label for="dateSelect" className="short-by-link active">
                                                Anywhere
                      </label>
                                            <select
                                                className="form-select form-select-sm city-select border-0 mt-2"
                                                id="citySelect"
                                            >
                                                <option selected>Choose a city...</option>
                                                <option value="1">city-1</option>
                                                <option value="2">city-2</option>
                                                <option value="3">city-3</option>
                                                <option value="4">city-4</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div className="select-col">
                                                <h5 className="shrtby-intitle">Date created</h5>
                                                <label
                                                    for="dateSelect"
                                                    className="short-by-link active"
                                                >
                                                    Anytime
                        </label>
                                            </div>
                                            <div className="select-row">
                                                <select
                                                    className="form-select form-select-sm date-select"
                                                    id="dateSelect"
                                                >
                                                    <option selected>09</option>
                                                    <option value="1">02</option>
                                                    <option value="2">03</option>
                                                    <option value="3">04</option>
                                                    <option value="4">05</option>
                                                </select>
                                                <select
                                                    className="form-select form-select-sm year-select"
                                                    id="yearSelect"
                                                >
                                                    <option selected>2020</option>
                                                    <option value="1">2021</option>
                                                    <option value="2">2022</option>
                                                    <option value="3">2023</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/*/Filter-by Card*/}
                        </div>
                        {/*/Short-by & Filter-by Col*/}
                    </div>
                </div>
            </section>
        </Layout1>
    );
}