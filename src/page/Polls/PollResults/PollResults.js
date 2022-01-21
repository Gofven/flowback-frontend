import PollResultsCondorcet from "./PollResultsCondorcet";
import React from "react";

export default function PollResults({pollId, votingType, type}) {
    const showResults = () => {
        if (type !== "event") {
            switch (votingType) {
                case 'condorcet':
                    return <PollResultsCondorcet pollId={pollId}/>
                case 'traffic':
                    return <PollResultsCondorcet pollId={pollId}/> // TODO: change to traffic results component
                default:
                    return <></>;
            }
        } else {
            return <></>;
        }
    }
    return <>{showResults()}</>
}