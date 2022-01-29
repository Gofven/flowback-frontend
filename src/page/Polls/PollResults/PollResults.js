import React from "react";
import PollResultsCondorcet from "./PollResultsCondorcet";
import PollResultsTraffic from "./PollResultsTraffic";

export default function PollResults({allProposals, pollDetails, votingType, type}) {
    const showResults = () => {
        if (type !== "event") {
            switch (votingType) {
                case 'condorcet':
                    return <PollResultsCondorcet allProposals={allProposals}/>
                case 'traffic':
                    return <PollResultsTraffic allProposals={allProposals} pollDetails={pollDetails}/>
                default:
                    return <></>;
            }
        } else {
            return <></>;
        }
    }
    return <>{showResults()}</>
}