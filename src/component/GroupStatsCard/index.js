import React, {useState, useEffect} from "react";
import {postRequest} from "../../utils/API";
import Loader from "../../component/common/Loader";

export default function GroupStatsCard({groupId, userType}) {
    const [pollCount, setPollCount] = useState(0);
    const [documentCount, setDocumentCount] = useState(0);
    const [memberCount, setMemberCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [pollsLoading, setPollsLoading] = useState(true);
    const [documentLoading, setDocumentLoading] = useState(true);
    const [memberLoading, setMemberLoading] = useState(true);

    function getAllGroupDocs() {
        postRequest("api/v1/user_group/get_all_group_docs", {group: groupId}).then(
            (response) => {
                if (response.data?.length) {
                    setDocumentCount(response.data.length);
                }
            }
        ).finally(() => setDocumentLoading(false));
    }

    function getPolls(pollType) {
        // The payload doesn't matter always gives all polls from all joined groups
        /*let data = {
            first_page: true,
            last_poll_created_at: '',
            page: 1,
            page_size: 100000000000000,
            poll_type: pollType,
            group: 1
        }*/
        postRequest("api/v1/group_poll/home_all_poll_list", {}).then(
            (response) => {
                if (response.data?.count) {
                    setPollCount(response.data.count);
                }
            }
        ).finally(() => setPollsLoading(false));
    }

    function getGroupParticipants() {
        postRequest("api/v1/user_group/group_participants", {id: groupId}).then(
            (response) => {
                if (response) {
                    if (response.data?.total_participant) {
                        setMemberCount(response.data.total_participant);
                    }

                }
            }
        ).finally(() => setMemberLoading(false));
    }

    useEffect(() => {
        getAllGroupDocs();
        getPolls();
        getGroupParticipants();
    }, [])

    useEffect(() => {
        if (!pollsLoading && !documentLoading && !memberLoading) {
            setLoading(false)
        }
    }, [pollsLoading, documentLoading, memberLoading]);


    return (
        userType === "Owner" ?
            <div className="document-card card-rounded mb-4">
                <div className="card-header flex-header tab-header">
                    <h4 className="card-title">Group statistics</h4>
                </div>
                <Loader loading={loading}>
                    <div className="card-body d-flex flex-row justify-content-center">
                        <StatsNumberCard label="Members" number={memberCount}/>
                        {/*<StatsNumberCard label="Polls" number={pollCount}/>*/}
                        <StatsNumberCard label="Documents" number={documentCount}/>
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

function StatsNumberCard({label = "label", number = 0}) {
    return <div className="card m-2" style={{width: "8rem"}}>
        <div className="card-body">
            <p className="mb-1 text-secondary ">{label}</p>
            <h2 className="fw-bold">{number}</h2>
        </div>
    </div>;
}