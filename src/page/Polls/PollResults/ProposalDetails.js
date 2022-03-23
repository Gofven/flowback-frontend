import React from "react";
import { useEffect } from "react";
import { getTextBetweenHTMLTags } from "../../../component/HTMEditor";

export default function ProposalDetails({ proposal, proposalDescription }) {
    const descriptionMaxChars = 45;
    if (proposalDescription === null || proposalDescription === undefined) proposalDescription = "";
    const isLongDescription = proposalDescription.length > 45;
    // const shortDescription = proposalDescription.substring(0, descriptionMaxChars - 1) + "...";

    const plainTextDescription = getTextBetweenHTMLTags(proposalDescription);
    // const shortDescription = plainTextDescription?.length > descriptionMaxChars ? plainTextDescription?.substring(0, descriptionMaxChars - 1) + "..." : plainTextDescription;
    const shortDescription = plainTextDescription?.length > descriptionMaxChars ? "..." : ""

    useEffect(() => {
        const descriptions = document.getElementsByClassName(`description${proposal.id}`)
        for (let i = 0; i < descriptions.length; i++) {
            descriptions[i].innerHTML = proposalDescription;

        }
    })

    return <div className="proposal-details-text-fix">
        {isLongDescription ? <div className="" id={"heading" + proposal.id}>
            <button className="accordion-button accordion collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target={"#collapse" + proposal.id} aria-expanded="false"
                aria-controls={"collapse" + proposal.id}>
                <div id={"collapse" + proposal.id} className={`accordion-collapse accordion collapse show`}
                    aria-labelledby={"heading" + proposal.id}
                >
                    {shortDescription}
                </div>
            </button>
            <div id={"collapse" + proposal.id} className={`accordion-collapse collapse accordion-body description${proposal.id}`}
                aria-labelledby={"heading" + proposal.id}
            >
                {shortDescription}
            </div>
        </div> : <div className="" id={"heading" + proposal.id}>
            <div className="accordion-button accordion collapsed rm-accordion-icon"
            >
                <div className="accordion-collapse accordion collapse show">
                    {shortDescription}
                </div>
            </div>
        </div>}
    </div>
}