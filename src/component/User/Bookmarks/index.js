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

import React, { useState } from 'react';
import { useTab } from '../../../hook/useTab';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function Bookmarks(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { tab, activeTab, bind: handleOnClick } = useTab([
        "All",
        "Missions",
    ]);

    const renderTab = () => {
        switch (activeTab) {
            case tab[0]:
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((value, index) => (
                    <BookmarkView key={index} index={index} />
                ));
            case tab[1]:
                return [1, 2, 3, 4, 5, 6].map((value, index) => (
                    <BookmarkView key={index} index={index} />
                ));

            default:
                return <div></div>;
        }
    };

    const BookmarkView = ({ data, index }) => {
        return (
            <div className="media bookmark-block my-3" key={index}>
                <img src="/img/flower.jpg" className="media-img" alt="bookmark-img" />
                <div className="media-body">
                    <p className="text-turncate mb-0">Cloe Decker</p>
                </div>
                <div className="menu">
                    <span className="mr-1"> Admin </span>
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
        );
    }
    return (
        <>
            <div onClick={handleShow}>
                {props.children}
            </div>
            <Modal show={show} onHide={handleClose} className='profile-modal' centered>
                <div className="feed-card card-rounded mb-4">
                    <div className="card-header flex-header tab-header">
                        <h4 className="card-title">Bookmarks</h4>
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
            </Modal>
        </>
    );
}