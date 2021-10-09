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

import React, { useState, useEffect } from 'react';
import "./styles.css";
import TagsInput from 'react-tagsinput';
import { useHistory, useParams } from "react-router-dom";
import GroupChat from '../../../component/GroupChat';
import Layout1 from '../../../layout/Layout1';
import { Textbox, Textarea, Button, Label } from "../../../component/common";
import { formatDate, inputKeyValue } from "../../../utils/common";
import { postRequest } from '../../../utils/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import DateTimePicker from 'react-datetime-picker';
import DatePicker from "react-datepicker";

export default function PollForm() {

    let { groupId } = useParams();
    let { pollId } = useParams();
    const [pollDetail, setPollDetail] = useState({
        group: groupId,
        title: "",
        description: "",
        tags: "",
        type: "",
        end_time: new Date()
    });

    const [tag, setTag] = useState([])

    const [pollDocs, setPollDocs] = useState([]);
    let history = useHistory();

    // Set values from the inputs
    const handleOnChange = (e) => {
        console.log("Value", e.target.value);
        setPollDetail({ ...pollDetail, ...inputKeyValue(e) });
    };

    // Set Documents
    const OnDocumentsSelect = (e) => {
        const files = Array.from(e.target.files)
        var file = files.concat(pollDocs);
        setPollDocs(file);
    }

    // Remove Document
    const removeDocument = (item) => {
        var docs = pollDocs.slice();
        docs.splice(item, 1);
        setPollDocs(docs);
    }

    // Set tag
    const handleOnTagChange = (e) => {
        console.log("E:", e);
        setTag(e);
    }

    const handleOnTypeChange = (e) => {
        const selected_index = e.currentTarget.selectedIndex;
        const value = e.currentTarget[selected_index].value
        setPollDetail({ ...pollDetail, type: value });
    };

    //Select time
    const onDateTimeSelect = (e) => {
        setPollDetail({ ...pollDetail, end_time: e })
    }

    // Create Poll
    const handleSubmit = (e) => {
        const pollDetails = JSON.parse(JSON.stringify(pollDetail));
        pollDetails.tags = tag.join(" ");
        var data = new FormData();
        var obj = {
            poll_details: JSON.stringify(pollDetails)
        }
        Object.keys(obj).forEach((key) => {
            data.append(key, obj[key]);
        })
        pollDocs.forEach((doc) => {
            data.append('poll_docs', doc, doc.file);
        })
        postRequest("api/v1/group_poll/create_poll", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    history.push(`/groupdetails/${groupId}/pollDetails/${data.poll}`);
                } else {
                    // setError();
                }
            }
        );
    }

    // Fetch poll Details for existing poll
    const pollDetails = () => {
        var data = {
            group: groupId,
            poll: pollId
        }
        postRequest("api/v1/group_poll/poll_details", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    setPollDetail({
                        ...pollDetail,
                        title: data.title,
                        description: data.description,
                        tags: data.tags,
                        // end_time: formatDate(data.end_time, 'YYYY-MM-DDTHH:MM:SSZ')
                        end_time: new Date(data.end_time)
                    })
                    setTag(data.tags);
                }
            });
    }

    // Fetch poll details if form is for editing
    useEffect(() => {
        if (pollId) {
            pollDetails();
        }
    }, [])

    // Update Poll Details.
    const updatePollDetails = () => {
        const pollDetails = JSON.parse(JSON.stringify(pollDetail));
        pollDetails.tags = tag.join(" ");
        var data = {
            poll: pollId,
            title: pollDetails.title,
            description: pollDetails.description,
            tags: pollDetails.tags,
            end_time: pollDetails.end_time
        }
        postRequest("api/v1/group_poll/update_poll_details", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    history.push(`/groupdetails/${groupId}/pollDetails/${pollId ? pollId : data.poll}`);
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
                            <div className="grupper-card">
                                <div className="card  card-rounded overflow-hidden">
                                    <div className="card-header flex-header">
                                        <h4 className="card-title">{pollId ? "Edit" : "Create"} a Poll</h4>
                                    </div>
                                    <form className="form create_poll_form" id="createPollForm">
                                        <div className="form-group mt-3 mx-2">
                                            <Textbox
                                                type="text"
                                                name="title"
                                                placeholder="Poll name"
                                                required
                                                onChange={handleOnChange}
                                                defaultValue={pollDetail.title}
                                            // onBlur={vailadated}
                                            />
                                        </div>
                                        {
                                            !pollId &&

                                            <div className="form-group">
                                                <div className='field d-flex '>
                                                    {(pollDocs && pollDocs.length) ?
                                                        <div className='d-flex flex-column w-100'>
                                                            {pollDocs.map((pollDoc, index) => (
                                                                <div className='d-flex justify-content-between align-items-center my-1' key={index}>
                                                                    <div className="mr-2" > {pollDoc.name}</div>
                                                                    <FontAwesomeIcon icon={faTimes} color='red' onClick={() => { removeDocument(index) }} />
                                                                </div>
                                                            ))}
                                                            <div className='d-flex'>
                                                                <label htmlFor='document' className="text-primary">
                                                                    <div>
                                                                        Add More File
                                                                    </div>
                                                                </label>
                                                                <input type='file' accept='image/*,application/pdf,application/msword' name="document" id='document'
                                                                    onChange={OnDocumentsSelect}
                                                                    multiple="multiple"
                                                                />
                                                            </div>
                                                        </div> :
                                                        <div className=''>
                                                            <label htmlFor='document'>
                                                                <div>
                                                                    Add File
                                                            </div>
                                                            </label>
                                                            <input type='file' accept='image/*,application/pdf,application/msword' name="document" id='document'
                                                                onChange={OnDocumentsSelect}
                                                                multiple="multiple"
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        <div className="form-group">
                                            <TagsInput className="tags-input"
                                                name="tags"
                                                value={tag}
                                                onChange={handleOnTagChange}
                                                defaultValue={tag} />
                                        </div>

                                        <div className="form-group mx-2">
                                            <Textarea
                                                name="description"
                                                rows="6"
                                                placeholder="Add Details"
                                                required
                                                onChange={handleOnChange}
                                                defaultValue={pollDetail.description}

                                            />
                                        </div>

                                        <div className="form-group mx-2">
                                            <select name="type" id="type" onChange={handleOnTypeChange} className="form-select">
                                                <option selected value="poll">Default</option>
                                                <option value="mission">Mission</option>
                                            </select>
                                        </div>

                                        <div className="form-group field">
                                            <div>
                                                <Label>
                                                    Admission Time
                                            </Label>
                                            </div>
                                            {/* <DateTimePicker
                                                onChange={onDateTimeSelect}
                                                value={pollDetail.end_time}
                                                defaultValue={pollDetail.end_time}

                                            /> */}

                                            <DatePicker
                                                selected={pollDetail.end_time}
                                                onChange={onDateTimeSelect}
                                                minDate={new Date()}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        </div>
                                        <div className="text-center my-5">
                                            <Button
                                                type="button"
                                                className="btn login-btn btn-hover"
                                                // disabled={!formValid}
                                                onClick={pollId ? updatePollDetails : handleSubmit}
                                            >
                                                {pollId ? "Update" : "Submit"}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/*/Missions Featured Cards Col*/}

                        <div className="col-md-3">
                        </div>
                    </div>
                </div>
            </section>
        </Layout1>
    );
}