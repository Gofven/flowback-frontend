import React, { useEffect, useState } from "react";
import { getRequest } from "../../../utils/API";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './PollResults.css';
import ProposalDetails from "./ProposalDetails";

export default function PollResultsCondorcet({ pollId }) {
    const [proposals, setProposals] = useState(null);
    const [totalVotes, setTotalVotes] = useState(0);
    const getProposals = (pollId) => getRequest(`api/v1/group_poll/${pollId}/all_proposals`);

    useEffect(() => {
        getProposals(pollId).then((response) => {
            // sort proposals before setting
            response.sort((a, b) => b.final_score_positive - a.final_score_positive);
            setProposals(response);

            const totalVotesReducer = (currentTotal, currProposal) => currentTotal + currProposal.final_score_positive;
            setTotalVotes(response.reduce(totalVotesReducer, 0));
        })

    }, []);

    return <div className="card-rounded p-4 my-4">
        <h4>Results</h4>
        {proposals ? proposals.map((proposal, index) => <RankedProposal key={proposal.id} proposal={proposal}
            ranking={index + 1}
            totalVotes={totalVotes} />) : <></>}</div>
}

function RankedProposal({ proposal, ranking = 0, totalVotes = 0 }) {
    const proposalNameSplit = proposal.proposal.split("~");
    const proposalName = proposalNameSplit[0];
    const proposalDescription = proposalNameSplit[1];

    const votes = proposal.final_score_positive;
    const percentOfVotes = (votes / totalVotes).toLocaleString(undefined, { style: 'percent' })
    const createdAt = new Date(proposal.created_at).toLocaleString();
    const createdBy = proposal.user ? proposal.user.first_name : ""; // In case of a proposal created with a "null" user
    const fileLink = proposal.file;

    return <div className="card-rounded my-4 p-2 ">
        <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row font-big">
                <div className="pr-2 fw-bold"> {ranking + "."}
                </div>
                <div className="pr-2 fw-bold">{proposalName}</div>
            </div>
            <div className="d-flex flex-row">
                {fileLink &&
                    <a className="pr-3" target="_blank" rel="noopener noreferrer" href={fileLink}><FontAwesomeIcon
                        className="fa"
                        icon={faDownload}
                        color=''
                        size='lg' /></a>}
                <div className="d-flex flex-column fw-bold text-center">
                    <div>{percentOfVotes}</div>
                    <div className="font-small">{"Approval"}</div>
                </div>
            </div>
        </div>
        <div>
            <ProposalDetails proposal={proposal} proposalDescription={proposalDescription} />
            <div className="font-small mt-2 text-grey pl-3">{createdBy} · {createdAt}</div>
        </div>
    </div>
}