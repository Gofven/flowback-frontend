import GroupChannel from './GroupChannel';
import { useState, useEffect } from 'react';
import './index.css';
import { postRequest } from '../../utils/API';
import { Image } from 'react-bootstrap';
import Loader from '../common/Loader/Loader';

export default function GroupChannels() {
  const [groupId, setgroupId] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeChat = (e) => {
    setgroupId(e);
  };

  const getGroups = () => {
    setLoading(true);
    postRequest('api/v1/user_group/all_group').then((response) => {
      setLoading(false);
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
    <Loader loading={loading}>
      <div className="group-chats">
        <div className="group-chat-buttons">
          {groupList.map((group) => (
            <>
              {group.user_type !== "" && <img
                className="group-chat-image"
                key={group.id}
                src={group.image}
                onClick={() => changeChat(group.id)}
              />}
            </>
          ))}
        </div>
        {groupId && <GroupChannel groupId={groupId} />}
      </div>
    </Loader>
  );
}
