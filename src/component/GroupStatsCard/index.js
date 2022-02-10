import React, { useState, useEffect } from "react";
import { Textbox } from "../../component/common/Textbox";
import { Textarea } from "../../component/common/Textarea";
import {FormatComments, inputKeyValue} from '../../utils/common';
import { postRequest } from "../../utils/API";
import Loader from "../../component/common/Loader";

export default function GroupStatsCard({ groupId, userType }) {
    const [state, setState] = useState({ subject: "", message: "" });
    const { subject, message } = state;
    const [status, setStatus] = useState({ text: "", color: "black" });
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        console.log(state)
        setState({ ...state, ...inputKeyValue(e) });
    };

    const handleSendMail = () => {
        // console.log(groupId)
        setLoading(true)
        var data = new FormData();
        data.append("subject", state.subject);
        data.append("message", state.message);

        postRequest(`api/v1/user_group/${groupId}/mail_all_group_members`, data).then(response => {
            setLoading(false)
            if (response === "") {
                setStatus({ text: "Successfully sent mail", color: "green" });
            }
        }).catch(() => {
            setStatus({ text: "Something went wrong", color: "red" });
        })
    }

    function getAllGroupDocs() {
        postRequest("api/v1/user_group/get_all_group_docs", { group: groupId }).then(
            (response) => {
                console.log('api/v1/user_group/get_all_group_docs', response);
                /*const { status, data } = response;
                if (status === "success") {
                    setDocuments(data);
                } else {
                    // setError();
                }
                setLoading(false);*/
            }
        );
    }

    function getPolls(pollType) {
        let data = {
            first_page: true,
            last_poll_created_at: '',
            page: 1,
            page_size: 1000,
            poll_type: pollType,
            group: groupId
        }
        postRequest("api/v1/group_poll/home_all_poll_list", {data}).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    console.log("api/v1/group_poll/home_all_poll_list",response)
                    /*const { status, data: res } = response;
                    if (res != undefined) {
                        const data = res.data;
                        if (status == "success") {
                            if (first_page) {
                                setLastPollCreatedDate(res.last_poll_created_at);
                            }
                            console.log('poll data', data.data)
                            if (data) {
                                data.forEach((poll) => {
                                    poll.comments_details.comments = FormatComments(poll.comments_details.comments);
                                })
                            }
                            setPolls([...polls, ...data]);
                            setPage(page + 1);
                            setTotalPage(res.total_page);
                        }
                    }*/
                }
            }
        );
    }
    
    function getGroupParticipants() {
        //setLoading(true)
        postRequest("api/v1/user_group/group_participants", { id: groupId }).then(
            (response) => {
                if (response) {
                    console.log("api/v1/user_group/group_participants",response);
                    //const { status, data } = response;
                    //setMembers(data.participant);
                    //setTotalMemebers(data.total_participant);

                }
                //setLoading(false)
            }
        );
    }
    
    useEffect(() => {
        getAllGroupDocs();
        getPolls('condorcet');
        getGroupParticipants();
    }, [])
    
    return (
        userType === "Owner" ?
            <div className="document-card card-rounded mb-4">
                <div className="card-header flex-header tab-header">
                    <h4 className="card-title">Group statistics</h4>
                </div>
                <Loader loading={loading}>
                    <div className="card-body">
                        <StatsNumberCard label="Members" number={1305}/>
                    </div>
                </Loader>
            </div> : <div className="document-card card-rounded mb-4">
                <div className="card-header flex-header tab-header">
                    <h4 className="card-title">
                        Group statistics</h4>
                </div>
                <div className="card-body text-danger">Only an Admin is allowed to view group statistics.</div>
            </div>)
}

function StatsNumberCard({label = "label",number=0}) {
    return <div className="card">
        <div className="card-body">
            <p className="mb-1 text-secondary">{label}</p>
            <h2 className="fw-bold">{number}</h2>
        </div>
    </div>;
}