import Image from '../../../component/common/Image/Image';
import LinesEllipsis from 'react-lines-ellipsis';
import Profile from '../../../component/User/Profile/Profile';
import { formatDate } from "../../../utils/common";

export const TopProposal = ({ topProposal }) => {
    return <div className="card counter-proposal-card bg-white my-4">
        <div className="post-header d-flex justify-content-between card-header mb-0">
            {topProposal && topProposal.user &&
                <div className="media post-meida">
                    <div className="media-body">
                        <h5 className="user-name">
                            {window.t("Planned Time")}
                        </h5>
                    </div>
                </div>
            }
        </div>
        <div className="counterproposal-body">
            {/* The backend only supports one textfield for a proposal so putting "~" between the title and description is a workaround */}
            <div className="counter-proposal-top">
                <div className="counter-proposal-title">
                    <h4>{topProposal?.date && topProposal?.title !== "Drop this mission" ? <>
                        <h4>{topProposal?.date.split('T')[0]}</h4>
                        <h4>{topProposal?.date.split('T')[1].split(".")[0].split(":")[0]}:{topProposal?.date.split('T')[1].split(".")[0].split(":")[1]}
                        </h4></> : null}</h4>
                    <h4>{topProposal?.title}</h4>
                </div>
            </div>
            <div className="proposal-description">
                <LinesEllipsis
                    text={topProposal?.description}
                    ellipsis="..."
                    trimRight
                    basedOn='letters' />
            </div>
            <div className="font-small mt-2 text-grey top-prosal-creator">
                <div>{window.t("Creator")}: <Profile
                    id={topProposal?.user?.id}> {topProposal?.user?.first_name} </Profile>
                </div>
            </div>
        </div>
    </div>
}