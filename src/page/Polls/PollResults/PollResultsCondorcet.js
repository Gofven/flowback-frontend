import React, {useEffect, useState} from "react";
import {getRequest} from "../../../utils/API";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './PollResults.css';

export default function PollResultsCondorcet({pollId}) {
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
                                                                        totalVotes={totalVotes}/>) : <></>}</div>
}

function RankedProposal({proposal, ranking = 0, totalVotes = 0}) {
    const proposalNameSplit = proposal.proposal.split("~");
    const proposalName = proposalNameSplit[0];
    const proposalDescription = proposalNameSplit[1];

    const votes = proposal.final_score_positive;
    const percentOfVotes = (votes / totalVotes).toLocaleString(undefined, {style: 'percent'})
    const createdAt = new Date(proposal.created_at).toLocaleString();
    const createdBy = proposal.user ? proposal.user.first_name : ""; // In case of a proposal created with a "null" user
    const fileLink = proposal.file;

    return <div className="card-rounded my-4 p-2 ">
        <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row font-big">
                <div className="pr-2 fw-bold"> {ranking + "."}
                </div>
                <div className="pr-2">{proposalName}</div>
            </div>
            <div className="d-flex flex-row">
                {fileLink &&
                    <a className="pr-3" target="_blank" rel="noopener noreferrer" href={fileLink}><FontAwesomeIcon
                        className="fa"
                        icon={faDownload}
                        color=''
                        size='lg'/></a>}
                <div className="d-flex flex-column">
                    <div>{percentOfVotes}</div>
                    <div className="font-small">{"votes"}</div>
                </div>
            </div>
        </div>
        <div>
            <ProposalDetails proposal={proposal} proposalDescription={proposalDescription}/>
            <div className="font-small mt-2 text-grey pl-3">{createdBy} · {createdAt}</div>
        </div>
    </div>
}

function ProposalDetails({proposal, proposalDescription}) {
    const descriptionMaxChars = 45;
    const isLongDescription = proposalDescription.length > 45;
    const shortDescription = proposalDescription.substring(0, descriptionMaxChars - 1) + "...";

    return <div className="">
        {isLongDescription ? <div className="" id={"heading" + proposal.id}>
            <button className="accordion-button accordion collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target={"#collapse" + proposal.id} aria-expanded="false"
                    aria-controls={"collapse" + proposal.id}>
                <div id={"collapse" + proposal.id} className="accordion-collapse accordion collapse show"
                     aria-labelledby={"heading" + proposal.id}
                >
                    {shortDescription}
                </div>
            </button>
            <div id={"collapse" + proposal.id} className="accordion-collapse collapse accordion-body"
                 aria-labelledby={"heading" + proposal.id}
            >
                {proposalDescription}
            </div>
        </div> : <div className="" id={"heading" + proposal.id}>
            <div className="accordion-button accordion collapsed rm-accordion-icon"
            >
                <div className="accordion-collapse accordion collapse show">
                    {proposalDescription}
                </div>
            </div>
        </div>}
    </div>
}