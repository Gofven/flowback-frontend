import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import ProposalDetails from "./ProposalDetails";

const { REACT_APP_PROXY } = process.env;

export default function PollResultsTraffic({ allProposals, pollDetails }) {
    const [showAbstain, setShowAbstain] = useState(true);
    const totalVotes = Number(pollDetails.total_participants);
    const proposals = allProposals ? allProposals.sort((a, b) => (Number(b.final_score_positive) - Number(b.final_score_negative)) - (Number(a.final_score_positive) - Number(a.final_score_negative))) : [];

    const toggleAbstainedVotes = () => setShowAbstain(!showAbstain);

    return <div className="card-rounded p-4 my-4">
        <div className="d-flex flex-row justify-content-between align-items-center"><h4>Results</h4>
            <div className="d-flex flex-row"><label htmlFor="includeAbstained">Include
                abstained</label><input className="m-1" defaultChecked={showAbstain} onChange={toggleAbstainedVotes}
                    type="checkbox" /></div>
        </div>
        {proposals ? proposals.map((proposal, index) => <TrafficProposal key={proposal.id} proposal={proposal}
            ranking={index + 1}
            totalVotes={totalVotes}
            showAbstain={showAbstain} />) : <></>}</div>
}

function VoteTypePercent({ totalVotes, votes, text = "vote type", cssClass = "" }) {
    const percentageOfVotes = votes !== 0 ? (votes / totalVotes).toLocaleString(undefined, { style: 'percent' }) : votes.toLocaleString(undefined, { style: 'percent' });
    const votesText = votes !== 1 ? "(" + Math.round(votes) + " votes)" : "(" + Math.round(votes) + " vote)"

    return <div className={"d-flex flex-column text-center p-1 px-2 " + cssClass}>
        <div className="fw-bold">{percentageOfVotes}</div>
        <div className="font-small">{votesText}</div>
        <div>{text}</div>
    </div>
}

function TrafficProposal({ proposal, ranking = 0, totalVotes = 0, showAbstain = true }) {
    const proposalNameSplit = proposal.proposal.split("~");
    const proposalName = proposalNameSplit[0];
    const proposalDescription = proposalNameSplit[1];

    const votesAbstained = totalVotes - Number(proposal.final_score_negative) - Number(proposal.final_score_positive);
    const displayedTotalVotes = showAbstain ? Math.round(totalVotes) : Math.round(Number(proposal.final_score_negative)) + Math.round(Number(proposal.final_score_positive));

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
                        size='lg' /></a>}
                <div className="d-flex flex-column text-center mr-2">
                    <div className="fw-bold">{displayedTotalVotes}</div>
                    <div className="font-small">{"votes"}</div>
                </div>
                <VoteTypePercent totalVotes={displayedTotalVotes} votes={Number(proposal.final_score_negative)}
                    text={"against"} cssClass={"bg-against"} />
                {showAbstain && <VoteTypePercent totalVotes={displayedTotalVotes}
                    votes={votesAbstained}
                    text={"abstain"} cssClass={"bg-abstain"} />}
                <VoteTypePercent totalVotes={displayedTotalVotes} votes={Number(proposal.final_score_positive)} text={"for"}
                    cssClass={"bg-for"} />
            </div>
        </div>
        <div>
            <ProposalDetails proposal={proposal} proposalDescription={proposalDescription} />
            <div className="font-small mt-2 text-grey pl-3">{createdBy} · {createdAt}</div>
        </div>
    </div>
}