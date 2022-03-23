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

import React, { useState, useEffect } from 'react';
import "./styles.css";
import TagsInput from 'react-tagsinput';
import { useHistory, useParams } from "react-router-dom";
import GroupChat from '../../../component/GroupChat/GroupChat';
import Layout1 from '../../../layout/Layout1';
import { Textbox, Textarea, Button, Label } from "../../../component/common";
import { formatDate, inputKeyValue } from "../../../utils/common";
import { postRequest } from '../../../utils/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import DateTimePicker from 'react-datetime-picker';
import DatePicker from "react-datepicker";
import { Form } from 'react-bootstrap';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { HTMEditor, getHTML, getDraftTime } from '../../../component/HTMEditor/HTMEditor'

export default function PollForm() {

    let { groupId } = useParams();
    let { pollId } = useParams();
    const [pollDetail, setPollDetail] = useState({
        group: groupId,
        title: "",
        description: "",
        tags: "",
        type: "",
        end_time: new Date(),
        voting_type: "condorcet"
    });
    const [tag, setTag] = useState([])
    const [pollDocs, setPollDocs] = useState([]);
    const [expandedDescription, setExpandedDescription] = useState(false);
    const [messege, setMessege] = useState({ messege: "", color: "black" })
    const maxTitleLength = 100;
    const maxDescriptionLength = 3000;
    let history = useHistory();

    // Set values from the inputs
    const handleOnChange = (e) => {
        setPollDetail({ ...pollDetail, ...inputKeyValue(e) });
        console.log("Value", e.target.value);
    };

    const changeVotingType = (e) => {
        const votingType = e.target.value
        setPollDetail({ ...pollDetail, voting_type: votingType });
        console.log(e.target.value, pollDetail)
    }

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
        if (pollDetail.title.length > maxTitleLength) {
            setMessege({ messege: `Title must be less than ${maxTitleLength} characters`, color: "red" })
        }

        if (pollDetail.description.length > maxDescriptionLength) {
            setMessege({ messege: `Description must be less than ${maxDescriptionLength} characters`, color: "red" })
        }

        pollDetail['end_time'].setTime(pollDetail['end_time'].getTime() + 60 * 60 * 1000); // Bodge to Stockholm Timezone
        const pollDetails = JSON.parse(JSON.stringify(pollDetail));
        pollDetails.description = getHTML();
        pollDetails.tags = tag.join(" ");
        if (pollDetails.voting_type === "time") {
            pollDetails.voting_type = "condorcet";
            pollDetails.type = "event";
        }
        var data = new FormData();
        var obj = {
            poll_details: JSON.stringify(pollDetails)
        }
        Object.keys(obj).forEach((key) => {
            if (key !== "description")
                data.append(key, obj[key]);
        })
        pollDocs.forEach((doc) => {
            data.append('poll_docs', doc, doc.file);
        })

        // if (votingType === "time")
        postRequest("api/v1/group_poll/create_poll", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    history.push(`/groupdetails/${groupId}/pollDetails/${data.poll}`);
                } else {
                    setMessege({ messege: data?.title[0], color: "red" })
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
        pollDetails.description = getHTML();
        pollDetails.tags = tag.join(" ");
        var data = {
            poll: pollId,
            title: pollDetails.title,
            description: pollDetails.description,
            // tags: pollDetails.tags,
            // end_time: pollDetails.end_time
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
                    <div className="row justify-content-center">
                        {/*/Group chat col*/}
                        {/*/Missions Featured Cards Col*/}
                        <div className="col-md-6">
                            <div className="grupper-card">
                                <div className="card  card-rounded overflow-hidden">
                                    <div className="card-header flex-header">
                                        <h4 className="card-title">{pollId ? "Edit" : "Create"} a Poll</h4>
                                    </div>
                                    <form className="form create_poll_form" id="createPollForm">
                                        <div className="mt-3 mx-2">
                                            <h4 style={{ "color": messege.color }}>{messege.messege}</h4>
                                        </div>
                                        <div className="form-group mt-3 mx-2">
                                            <Textbox
                                                type="text"
                                                name="title"
                                                placeholder="Poll name"
                                                maxLength={maxTitleLength}
                                                required
                                                onChange={handleOnChange}
                                                defaultValue={pollDetail.title}
                                            // onBlur={vailadated}
                                            />
                                        </div>
                                        {
                                            !pollId &&
                                            <label htmlFor='document'>
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
                                                                            {/* Add More Files */}
                                                                        </div>
                                                                    </label>
                                                                    <input type='file' accept='image/*,application/pdf,application/msword' name="document" id='document'
                                                                        onChange={OnDocumentsSelect}
                                                                        multiple="multiple"
                                                                    />
                                                                </div>
                                                            </div> :
                                                            <div className=''>
                                                                <div>
                                                                    Add File
                                                                </div>
                                                                <input type='file' accept='image/*,application/pdf,application/msword' name="document" id='document'
                                                                    onChange={OnDocumentsSelect}
                                                                    multiple="multiple"
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </label>
                                        }
                                        {/*<div className="form-group">
                                            <TagsInput className="tags-input"
                                            name="tags"
                                            value={tag}
                                            onChange={handleOnTagChange}
                                            defaultValue={tag} />
                                        </div>*/}

                                        <div className="form-group mx-2">
                                            <h4>Add Details</h4>
                                            <HTMEditor />
                                        </div>
                                        {pollId ? null :
                                            <>
                                                <div className="form-group mx-2" style={{"margin-top": "10px"}}>
                                                    <select name="type" id="type" onChange={handleOnTypeChange} className="form-select">
                                                        <option selected value="poll">Private</option>
                                                        <option value="mission">Public</option>

                                                    </select>
                                                </div>

                                                <div className="form-group field">
                                                    <Label>
                                                        Voting Type
                                                    </Label>
                                                    <div>
                                                        <Form.Check
                                                            inline
                                                            type="radio"
                                                            id="Ranking"
                                                            name="request"
                                                            label="Ranking"
                                                            value="condorcet"
                                                            checked={pollDetail.voting_type === "condorcet"}
                                                            onClick={changeVotingType}
                                                        />

                                                        <Form.Check
                                                            inline
                                                            type="radio"
                                                            id="For/Against"
                                                            name="request"
                                                            label="For/Against"
                                                            value="traffic"
                                                            checked={pollDetail.voting_type === "traffic"}
                                                            onClick={changeVotingType}
                                                        />

                                                        <Form.Check
                                                            inline
                                                            type="radio"
                                                            id="Cardinal"
                                                            name="request"
                                                            label="Cardinal"
                                                            value="cardinal"
                                                            checked={pollDetail.voting_type === "cardinal"}
                                                            onClick={changeVotingType}
                                                        />

                                                        <Form.Check
                                                            inline
                                                            type="radio"
                                                            id="Time"
                                                            name="request"
                                                            label="Time"
                                                            value="time"
                                                            checked={pollDetail.voting_type === "time"}
                                                            onClick={changeVotingType}
                                                        />


                                                    </div>
                                                </div>
                                                <div className="form-group field votingExplanation" onClick={() => setExpandedDescription(!expandedDescription)} style={{ cursor: 'pointer' }}>

                                                    {expandedDescription ? <div className="votingExplanationTexts">
                                                        <div>
                                                            <b>Ranking</b> is the method of preferential voting known as the borda count. The top proposal in Added always gets the number of points as there are proposals (it does not depend on there being proposals below it), and the one below that gets that number minus one, the one below that gets that number minus two and so on. Each proposal that are in abstain each get zero points. This is added over all voters and is divided by the total number of votes to get the result.
                                                        </div>
                                                        <div>
                                                            <b>For/Against</b> is the method where each proposal that is voted for gets one point and each voted against gets minus one independently of order, all other proposals get zero points. The points are then added over all voters and is divided by the total number of votes to get the result.
                                                        </div>
                                                        <div>
                                                            <b>Cardinal</b> is the method where each member can rank by writing any number for all polls, which are ranked accordingly and get the percentage compared to the total that the member gives, the percentages are added up over all members and divided by the total to get the result. This means that not only are the proposals ranked by order of preference, but the degree by which one proposal is better than another is reflected. Totals will not exceed 10^6.
                                                        </div>
                                                        <div>
                                                            <b>Time polls</b>  is the method where dates and times are voted on to decide meetings or events for the members of the group. Time polls are always Private and can only be seen by group members. One can only vote for a time or vote to drop the proposal, a default proposal for every time poll. This is carried out by the ranking method.
                                                        </div>
                                                    </div> :
                                                        <div >
                                                            Click here to get information about the different voting types
                                                        </div>}


                                                    <FontAwesomeIcon className={`fa expand-description-circle ${expandedDescription ? "clicked" : null}`}
                                                        icon={faArrowCircleDown}
                                                        color=''
                                                        size='2x'
                                                        onClick={() => setExpandedDescription(!expandedDescription)} />

                                                </div>
                                                <div className="form-group field">
                                                    <div>
                                                        <Label>
                                                            End Time
                                                        </Label>
                                                    </div>
                                                    {/* <DateTimePicker
                                                onChange={onDateTimeSelect}
                                                value={pollDetail.end_time}
                                                defaultValue={pollDetail.end_time}

<option value="event">Event</option> was removed above as an option

                                            /> */}

                                                    <DatePicker
                                                        selected={pollDetail.end_time}
                                                        onChange={onDateTimeSelect}
                                                        minDate={new Date()}
                                                        showTimeSelect
                                                        dateFormat="Pp"
                                                        popperPlacement="top-start"
                                                    />
                                                </div></>}
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
                    </div>
                </div>
            </section >
        </Layout1 >
    );
}