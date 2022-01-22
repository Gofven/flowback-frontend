import React from "react";

export default function ProposalDetails({proposal, proposalDescription}) {
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