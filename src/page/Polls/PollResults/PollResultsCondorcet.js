import React, { useState } from "react";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './PollResults.css';
import ProposalDetails from "./ProposalDetails";
import { PieChart } from 'react-minimal-pie-chart';
import ReactTooltip from "react-tooltip";

const { REACT_APP_PROXY } = process.env;

export default function PollResultsCondorcet({ allProposals }) {
    if (allProposals === undefined || allProposals === null || allProposals.detail === "Not found.") { return <div className="card-rounded p-4 my-4"><div>No winning proposal</div></div > }

    // sorted proposals
    const proposals = allProposals ? allProposals.sort((a, b) => b.final_score_positive - a.final_score_positive) : [];

    const totalVotesReducer = (currentTotal, currProposal) => currentTotal + currProposal.final_score_positive;
    const totalVotes = proposals.reduce(totalVotesReducer, 0);

    return <div className="card-rounded p-4 my-4">
        <h4>Results</h4>
        {allProposals &&
            <div className="m-xl-5 m-lg-4 m-md-3 m-sm-5 m-3"><ResultsPieChart allProposals={allProposals}
                totalVotes={totalVotes} /></div>}
        {proposals ? proposals.map((proposal, index) => <RankedProposal key={proposal.id} proposal={proposal}
            ranking={index + 1}
            totalVotes={totalVotes} />) : <></>}</div>
}

// Will display max 10 options in the pie chart
function ResultsPieChart({ allProposals, totalVotes }) {
    const [hovered, setHovered] = useState(null);

    const topProposals = allProposals.slice(0, 9);
    const otherProposals = allProposals.slice(9, allProposals.length);

    const colors = ['#277DA1', '#577590', '#4D908E', '#43AA8B', '#90BE6D', '#F94144', '#F3722C', '#F8961E', '#F9844A'];

    let data = topProposals.map((proposal, index) => {
        const percentage = (proposal.final_score_positive / totalVotes);
        const title = getProposalTitleAndDescription(proposal)[0];

        return {
            title: (index + 1) + ". " + title, value: percentage, color: colors[index]
        }
    });

    const otherData = {
        title: (colors.length + 1) + ". other proposals",
        value: otherProposals.reduce((acc, proposal) => acc + (proposal.final_score_positive / totalVotes), 0),
        color: '#f1c45b',
    };

    if (otherProposals.length !== 0) {
        data.push(otherData);
    }

    return <div data-tip="" data-for="chart"><PieChart
        data={data}
        label={({ dataEntry }) => {
            return dataEntry.value.toLocaleString(undefined, { style: 'percent' })
        }}
        labelStyle={() => ({
            fontSize: '4px', fontFamily: 'sans-serif', fill: '#FFF',
        })}
        onMouseOver={(_, index) => {
            setHovered(index);
        }}
        onMouseOut={() => {
            setHovered(null);
        }}
    />
        <ReactTooltip
            id="chart"
            getContent={() => typeof hovered === 'number' ? makeTooltipContent(data[hovered]) : null}
        />
    </div>;
}

function makeTooltipContent(entry) {
    return `${entry.title}`;
}

function RankedProposal({ proposal, ranking = 0, totalVotes = 0 }) {
    const proposalNameSplit = getProposalTitleAndDescription(proposal);
    const proposalName = proposalNameSplit[0];
    const proposalDescription = proposalNameSplit[1];

    const votes = proposal.final_score_positive;
    const percentOfVotes = (votes / totalVotes).toLocaleString(undefined, { style: 'percent' });
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

function getProposalTitleAndDescription(proposal) {
    return proposal.proposal.split("~");
}