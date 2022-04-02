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

import React from "react";
import { useTranslation } from "react-i18next";

export default function AboutCard(props) {
    const {t} = useTranslation()
    let group = props.groupDetail;
    return (
        <div className="feed-card card-rounded mb-4">
            <div className="card-header flex-header tab-header">
                <h4 className="card-title">{t("About")}</h4>

            </div>
            <div className="card-body">
                <div className="tab-content" id="pills-tabContent">
                    <div id="PollsTab">
                        <div className="row">
                            <div className="row">
                                <div className="col-5">{t("Description")}</div>
                                <div className="col-6">{group.description}</div>
                            </div>
                            {/* <div className="row">
                                <div className="col-5">Tags</div>
                                <div className="col-6">
                                    {group && group.tags &&
                                        group.tags?.map((tag) => (
                                            < span className="badge rounded-pill bg-success mr-2 " > { tag}</span>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-5">Location</div>
                                <div className="col-6">{group.city && group.city.city_name}, {group.country && group.country.country_name}</div>
                            </div> */}
                            <div className="row">
                                <div className="col-5">{t("Created By")}</div>
                                <div className="col-6">{group.created_by && group.created_by.first_name} {group.created_by && group.created_by.last_name}</div>
                            </div>
                        </div>
                    </div >                </div>
            </div>
        </div>
    );
}
