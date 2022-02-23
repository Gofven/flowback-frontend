import Image from '../../../component/common/Image';
import LinesEllipsis from 'react-lines-ellipsis';
import Profile from '../../../component/User/Profile';
import { formatDate } from "../../../utils/common";

export const TopProposal = ({ topProposal }) => {
    return <div className="card counter-proposal-card bg-white">
        <div className="post-header d-flex justify-content-between card-header mb-0">
            {topProposal && topProposal.user &&
                <div className="media post-meida">
                    <Image src={topProposal.user.image} className="post-user-img" errImg={'/img/no-photo.jpg'} />
                    <div className="media-body">
                        <h5 className="user-name">
                            <Profile className='inline-block'
                                id={topProposal.user.id}>{topProposal.user.first_name} {topProposal.user.last_name} </Profile>
                        </h5>
                        <div
                            className="post-time">{topProposal && formatDate(topProposal.created_at, 'DD/MM/YYYY kk:mm')}</div>
                    </div>
                </div>
            }
        </div>
        <div className="counterproposal-body">
            {/* The backend only supports one textfield for a proposal so putting "~" between the title and description is a workaround */}
            <div className="counter-proposal-top">
                <div className="counter-proposal-title">
                    <h4>{topProposal?.date && topProposal?.title !== "Drop this mission" ? <>
                        <h4>{topProposal.date.split('T')[0]}</h4>
                        <h4>{topProposal.date.split('T')[1].split(".")[0].split(":")[0]}:{topProposal.date.split('T')[1].split(".")[0].split(":")[1]}
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
        </div>
    </div>
}