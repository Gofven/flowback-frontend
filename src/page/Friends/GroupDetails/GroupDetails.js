/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

import React, { useState, useEffect } from "react";
import GroupButtons from "../GroupForm/GroupButtons";
import {
    Link,
    useParams,
} from "react-router-dom";
import "./GroupDetailsStyles.css";
import { useTab } from "../../../hook/useTab";
import Layout1 from "../../../layout/Layout1";
import { postRequest } from '../../../utils/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInfoCircle,
    faRss,
    faFileAlt,
    faUser,
    faPoll,
    faUsers,
    faEnvelope,
    faChartPie
} from '@fortawesome/free-solid-svg-icons'
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import FeedCard from "../../../component/FeedCard/FeedCard";
import DocumentCard from "../../../component/DocumentCard/DocumentCard";
import MemberCard from "../../../component/MemberCard/MemberCard";
import EmailCard from "../../../component/EmailCard/EmailCard";
import Image from "../../../component/common/Image/Image";
import UserGroup, { getGroupDetails } from "../../../apis/UserGroup";
import AboutCard from "../../../component/AboutCard/AboutCard";
import GroupStatsCard from "../../../component/GroupStatsCard/GroupStatsCard";
import Chat from "../../../component/Chat/Chat";
const { REACT_APP_JITSI } = process.env;

export default function GroupDetails() {

    let { groupId } = useParams();
    const [group, setGroup] = useState({});
    const [groupLoaded, setGroupLoaded] = useState(false);

    //List Names
    const { tab, activeTab, bind: handleOnClick } = useTab([
        "Feed",
        "About",
        "Documents",
        "Members",
        "Send Email",
        "Group statistics"
    ]);

    // List of icon for list
    const indexIcon = [faRss, faInfoCircle, faFileAlt, faUser, faEnvelope, faChartPie];

    // List to render on the screen
    const renderTab = () => {
        switch (activeTab) {
            case tab[0]:
                return (
                    group.user_type
                        // || group.public
                        ? <FeedCard groupId={groupId} /> : <NoAccessBlock message="Please join group to view feeds of this group." />
                );
            case tab[1]:
                return (
                    group.user_type || group.public ? <AboutCard groupDetail={group} /> : <NoAccessBlock message="Please join group to view group details." />
                );
            case tab[2]:
                return (
                    group.user_type ?
                        <DocumentCard groupId={groupId} userType={group.user_type} />
                        : <NoAccessBlock message="Please join group to view documents of this group." />
                );
            case tab[3]:
                return (
                    group.user_type ?
                        <MemberCard groupId={groupId} userType={group.user_type} />
                        : <NoAccessBlock message="Please join group to view members of this group." />
                );
            case tab[4]:
                return (
                    group.user_type ?
                        <EmailCard groupId={groupId} userType={group.user_type} />
                        : <NoAccessBlock message="Please join group to email." />
                );
            case tab[5]:
                return (
                    group.user_type ?
                        <GroupStatsCard groupId={groupId} userType={group.user_type} />
                        : <NoAccessBlock message="Please join group to view group statistics." />
                );
            default:
                return <FeedCard />;
        }
    };

    // Fetch group details
    const getGroupDetail = () => {
        UserGroup.getGroupDetails(groupId).then(
            (response) => {
                console.log('response', response);
                if (response) {
                    const { status, data } = response;
                    setGroup(data);
                    console.log("Group", group);
                    setGroupLoaded(true);
                }

            }
        );
    }

    // Join group request as a delegate
    const handleOnJoinGroupAsADelegate = (item) => {
        postRequest("api/v1/user_group/join_group", { group: item.id, as_delegator: true }).then(
            (response) => {
                if (response) {
                    const { status, data } = response;
                    getGroupDetail();
                }
            });
    }

    // Fetch group details
    useEffect(() => {
        getGroupDetail();
    }, [])

    // For displaying message for no access
    const NoAccessBlock = ({ message }) => {
        return (
            <div className="card-rounded mb-4 p-3 text-center">
                {message}
            </div>
        )
    }

    return (
        <Layout1>
            <section className="group-details-dashboard mt-4">
                <div className="container-xl">
                    <div className="group-details-card">

                        <div className="group-details-img-view d-flex">
                            <div className="col-6 media group-details-img-content ">
                                <Image src={group.image} className="group-details-dp" />
                                <div className="media-body d-flex align-items-center">

                                    <h3 className="group-details-title text-truncate mr-2">
                                        {group.title}
                                    </h3>
                                    {/* {
                                        ["Owner", "Admin", "Moderator"].includes(group.user_type) &&
                                        <div class="iconedit">
                                            <Link to={`/groupdetails/${groupId}/edit`}>
                                                <FontAwesomeIcon icon={faEdit} size="lg" color="black" />
                                            </Link>
                                        </div>
                                    } */}
                                </div>
                                <div className="">
                                    {groupLoaded && <div className="card-rounded group-buttons-in-group" ><GroupButtons user_type={group.user_type} groupId={group.id} groupJoinStatus={group.group_join_status} total_members={group.total_members} reload={true} /></div>}
                                </div>
                            </div>
                            <Image src={group.cover_image} className="group-details-cover" errImg={'/img/no-banner.jpg'} />
                        </div>
                    </div>
                </div>
            </section>
            <section className="home-dashboard">
                <div className="container-xl">
                    <div className="row justify-content-end">
                        {/* <div className="col-md-3"><Chat/></div> */}
                        <div className="col-md-6">
                            {renderTab()}
                        </div>

                        <div className="col-md-3">
                            <div className="card group-chat-card chat-list-card chat-card card-rounded overflow-hidden">
                                <div className="card-body overflow-hidden">
                                    {tab?.map((item, index) => (

                                        // (group.user_type || ["About"].includes(item)) ?
                                        <div className="mb-1 cursor-pointer" id={index} key={index}>
                                            <FontAwesomeIcon icon={indexIcon[index]} color='#737373' />
                                            <span className={`ml-2 ${item === activeTab ? "activeIndex" : ""}`}
                                                data-id={index}
                                                {...handleOnClick}> {window.t(item)}</span>
                                        </div>
                                        // : null
                                    ))}
                                </div>
                            </div>
                            {group.user_type &&
                                <div className="card group-chat-card chat-list-card chat-card card-rounded overflow-hidden my-2">
                                    <div className="card-body overflow-hidden">

                                        <div className="mb-1">
                                            <Link to={`/groupdetails/${groupId}/pollcreate`}>
                                                <FontAwesomeIcon icon={faPoll} color='#737373' />
                                                <span className="ml-2"
                                                >{window.t("Create Poll")}</span>
                                            </Link>
                                        </div>
                                        {REACT_APP_JITSI &&
                                            <div className="mb-1">
                                                <a target="_blank" href={`${REACT_APP_JITSI}/${group.room_name}`}>
                                                    <FontAwesomeIcon icon={faUsers} color='#737373' />
                                                    <span className="ml-2"
                                                    >{window.t("Video Conference")}</span>
                                                </a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                </div>
            </section>

        </Layout1 >
    );
}
