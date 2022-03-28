import GroupChannel from './GroupChannel';
import { useState, useEffect } from 'react';
import './index.css';
import { postRequest } from '../../utils/API';

export default function GroupChannels() {
  const [groupId, setgroupId] = useState(null);
  const [groupList, setGroupList] = useState([]);

  const changeChat = (e) => {
    setgroupId(e);
  };

  const getGroups = () => {
    postRequest('api/v1/user_group/all_group').then((response) => {
      console.log('response', response);
      if (response) {
        const { status, data } = response;
        setGroupList(data.data);
      }
    });
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div className="group-chats">
      <div className="group-chat-buttons">
        {groupList.map((group) => (
          <button
            onClick={() => changeChat(group.id)}
            className="btn btn-secondary"
          >
            {group.title}
          </button>
        ))}
      
      </div>
      {groupId && <GroupChannel groupId={groupId} />}
    </div>
  );
}
