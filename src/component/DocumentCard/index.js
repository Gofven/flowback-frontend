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
import { useTab } from "../../hook/useTab";
import AllTab from "./AllTab";

export default function DocumentCard(props) {
    const { tab, activeTab, bind: handleOnClick } = useTab([
        "All",
    ]);

    /**
     * To render tabs
     * Currently one tab "All" is available
     * @returns 
     */
    const renderTab = () => {
        switch (activeTab) {
            case tab[0]:
                return <AllTab groupId={props.groupId} userType={props.userType} />;
        };
    }

    return (
        <div className="document-card card-rounded mb-4">
            <div className="card-header flex-header tab-header">
                <h4 className="card-title">Documents</h4>
                <ul className="bottom-line-tab nav nav-pills" id="pills-tab">
                    {tab?.map((item, index) => (
                        <li className="nav-item" key={index}>
                            <span
                                className={`nav-link${item === activeTab ? " active" : ""}`}
                                data-id={index}
                                {...handleOnClick}
                            >
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="card-body">
                <div className="tab-content" id="pills-tabContent">
                    {renderTab()}
                </div>
            </div>
        </div>
    );
}
