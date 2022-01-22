import React from "react";
import PollResultsCondorcet from "./PollResultsCondorcet";
import PollResultsTraffic from "./PollResultsTraffic";

export default function PollResults({pollId, pollDetails, votingType, type}) {
    const showResults = () => {
        if (type !== "event") {
            switch (votingType) {
                case 'condorcet':
                    return <PollResultsCondorcet pollId={pollId}/>
                case 'traffic':
                    return <PollResultsTraffic pollId={pollId} pollDetails={pollDetails}/>
                default:
                    return <></>;
            }
        } else {
            return <></>;
        }
    }
    return <>{showResults()}</>
}