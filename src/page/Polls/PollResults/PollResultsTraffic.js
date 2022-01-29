import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import ProposalDetails from "./ProposalDetails";

const {REACT_APP_PROXY} = process.env;

export default function PollResultsTraffic({allProposals, pollDetails}) {
    const totalVotes = pollDetails.total_participants
    const proposals = allProposals ? allProposals.sort((a, b) => (b.final_score_positive - b.final_score_negative) - (a.final_score_positive - a.final_score_negative)) : [];

    return <div className="card-rounded p-4 my-4">
        <h4>Results</h4>
        {proposals ? proposals.map((proposal, index) => <TrafficProposal key={proposal.id} proposal={proposal}
                                                                         ranking={index + 1}
                                                                         totalVotes={totalVotes}/>) : <></>}</div>
}

function VoteTypePercent({totalVotes, votes, text = "vote type", cssClass = ""}) {
    const percentageOfVotes = (votes / totalVotes).toLocaleString(undefined, {style: 'percent'})
    const votesText = votes !== 1 ? "(" + votes + " votes)" : "(" + votes + " vote)"

    return <div className={"d-flex flex-column text-center p-1 px-2 " + cssClass}>
        <div className="fw-bold">{percentageOfVotes}</div>
        <div className="font-small">{votesText}</div>
        <div>{text}</div>
    </div>
}

function TrafficProposal({proposal, ranking = 0, totalVotes = 0}) {
    const proposalNameSplit = proposal.proposal.split("~");
    const proposalName = proposalNameSplit[0];
    const proposalDescription = proposalNameSplit[1];

    const votesAbstained = totalVotes - proposal.final_score_negative - proposal.final_score_positive;

    const createdAt = new Date(proposal.created_at).toLocaleString();
    const createdBy = proposal.user ? proposal.user.first_name : ""; // In case of a proposal created with a "null" user

    const fileLink = proposal.file ? REACT_APP_PROXY + proposal.file.substring(1) : proposal.file;

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
                        size='lg'/></a>}
                <div className="d-flex flex-column text-center mr-2">
                    <div className="fw-bold">{totalVotes}</div>
                    <div className="font-small">{"votes"}</div>
                </div>
                <VoteTypePercent totalVotes={totalVotes} votes={proposal.final_score_negative}
                                 text={"against"} cssClass={"bg-against"}/>
                <VoteTypePercent totalVotes={totalVotes}
                                 votes={votesAbstained}
                                 text={"abstain"} cssClass={"bg-abstain"}/>
                <VoteTypePercent totalVotes={totalVotes} votes={proposal.final_score_positive} text={"for"}
                                 cssClass={"bg-for"}/>
            </div>
        </div>
        <div>
            <ProposalDetails proposal={proposal} proposalDescription={proposalDescription}/>
            <div className="font-small mt-2 text-grey pl-3">{createdBy} · {createdAt}</div>
        </div>
    </div>
}