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

// import { MessageBox, ChatItem } from 'react-chat-elements';
import React, { useEffect, useState } from 'react';
import { useTab } from '../../hook/useTab';
import DirectMessage from './DirectMessage';
import '../MemberCard/styles.css';
import GroupChannels from './GroupChannels';
import './index.css'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Chat(props) {

  const [chatOpen, setChatOpen] = useState(false)

  const handleOpen = () => setChatOpen(true)
  const handleClose = () => setChatOpen(false)

  let {
    tab,
    activeTab,
    bind: handleOnClick,
  } = useTab(['Private Messages', 'Group Chats']);

  const userType = props.userType;

  useEffect(() => {
    if (props.userType != 'members') {
    }
  }, [props.userType]);

  const renderTab = () => {
    switch (activeTab) {
      case tab[0]:
        return <DirectMessage groupId={props.groupId} userType={userType} />;
      case tab[1]:
        return <GroupChannels groupId={props.groupId} />;
    }
  };

  const showTab = (tab) => {
    switch (tab) {
      case 'Group Join Requests':
        return ['Owner', 'Admin'].includes(props.userType);

      default:
        return true;
    }
  };
  return (
    <div className={`feed-card card-rounded mb-4 chat ${chatOpen ? "" : "chat-closed"}`}>
      <div className='card-header flex-header'>
        <h4 className="card-title">{window.t("Chat")}</h4>
        {chatOpen ?
          <FontAwesomeIcon icon={faMinus} className="clickable" onClick={handleClose} /> :
          <FontAwesomeIcon icon={faPlus} className="clickable" onClick={handleOpen} />
        }

      </div>
      <div className="card-header flex-header tab-header">
        <ul className="bottom-line-tab nav nav-pills noSelect" id="pills-tab">
          {tab?.map((item, index) =>
            showTab(item) ? (
              <li className="nav-item" key={index}>
                <span
                  className={`nav-link${item === activeTab ? ' active' : ''}`}
                  data-id={index}
                  {...handleOnClick}
                >
                  {window.t(item)}
                </span>
              </li>
            ) : null
          )}
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
